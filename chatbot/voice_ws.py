# ##########################
# # VOICE CHATBOT WEBSOCKET ##
# ##########################
"""
Voice WebSocket orchestrator.

Browser ──WS /ws/voice──► this backend ──WS──► STT  (Murf cloud OR self-hosted Whisper)
                                   └───WS──► Kokoro TTS  (/stream/tts, 24 kHz PCM16)

STT_PROVIDER env picks the STT service: "whisper" (local /stream/asr, handled
below) or "murf" (cloud, handled in stt_murf.py — see that module for details).
TTS_PROVIDER env picks the TTS service: "kokoro" (local /stream/tts, handled
below) or "fish" (cloud, handled in tts_fish.py — see that module for details).

Flow: mic audio is relayed to Whisper; Whisper's VAD/turn detection emits
`segment_completed` (final transcript per segment) and `turn_end` (user finished
talking). On `turn_end` we run RAG + Gemini (via the answer provider registered
by main.py), stream the answer through Kokoro, and relay the PCM16 audio back
to the browser.

Barge-in: once TTS audio starts flowing we send `tts_start` to Whisper (it
enables barge-in detection); when the user interrupts, Whisper emits
`interruption`, we cancel the in-flight answer task, and forward the event so
the browser stops playback. The cancelled task closes its Kokoro connection,
which sets Kokoro's stop_signal and aborts synthesis server-side.

Each answer gets its OWN Kokoro connection: reusing one connection after a
barge-in would replay stale queued audio and drop the next answer's text
(Kokoro's `clear` only empties its pending-text buffer).
"""
import asyncio
import json
import os
import time
import urllib.parse

from dotenv import load_dotenv
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import websockets

# .env must be loaded BEFORE importing stt_murf (it reads MURF_* env vars)
load_dotenv()

from stt_murf import open_murf_stt, make_murf_relay, extend_turn_hold, cancel_pending_turn
from tts_fish import open_fish_tts, send_fish_text, parse_fish_message

# STT provider: "whisper" (self-hosted) or "murf" (cloud) — decided in .env only
STT_PROVIDER = os.getenv("STT_PROVIDER", "whisper").strip().lower()
# TTS provider: "kokoro" (self-hosted) or "fish" (cloud) — decided in .env only
TTS_PROVIDER = os.getenv("TTS_PROVIDER", "kokoro").strip().lower()

WHISPER_WS_URL = os.getenv("WHISPER_WS_URL", "ws://localhost:8006/stream/asr")
KOKORO_WS_URL = os.getenv("KOKORO_WS_URL", "ws://localhost:8001/stream/tts")

# Kokoro voice settings (bm_daniel lives in the "b" lang pipeline)
KOKORO_VOICE = os.getenv("KOKORO_VOICE", "bm_daniel")
KOKORO_LANG_CODE = os.getenv("KOKORO_LANG_CODE", "b")
KOKORO_SPEED = os.getenv("KOKORO_SPEED", "1.0")

router = APIRouter()

# Registered by main.py via set_answer_provider(generate_answer) to avoid a circular import
_answer_provider = None


def set_answer_provider(fn):
    global _answer_provider
    _answer_provider = fn


def _with_query(url: str, params: dict) -> str:
    """Append query params to a WS URL, preserving any existing ones."""
    joiner = "&" if "?" in url else "?"
    return url + joiner + urllib.parse.urlencode(params)


async def _safe_send_json(ws: WebSocket, payload: dict):
    try:
        await ws.send_json(payload)
    except Exception:
        pass


async def _safe_ws_send(conn, data):
    try:
        await conn.send(data)
    except Exception:
        pass


async def _safe_ws_close(conn):
    try:
        await conn.close()
    except Exception:
        pass


async def _open_kokoro() -> websockets.WebSocketClientProtocol:
    """Open a fresh Kokoro TTS connection and complete its ready handshake."""
    tts_ws = await websockets.connect(
        _with_query(KOKORO_WS_URL, {
            "speed": KOKORO_SPEED,
            "voice": KOKORO_VOICE,
            "lang_code": KOKORO_LANG_CODE,
        }),
        max_size=None,
        open_timeout=15,
    )
    try:
        raw = await asyncio.wait_for(tts_ws.recv(), timeout=10)
        ready = json.loads(raw) if isinstance(raw, str) else {}
        if ready.get("type") != "ready":
            raise RuntimeError("TTS handshake failed")
    except Exception:
        await _safe_ws_close(tts_ws)
        raise
    return tts_ws


@router.websocket("/ws/voice")
async def voice_endpoint(browser_ws: WebSocket):
    await browser_ws.accept()

    if _answer_provider is None:
        await _safe_send_json(browser_ws, {"type": "error", "message": "Answer provider not registered"})
        await browser_ws.close()
        return

    stt_ws = None  # the active STT connection — Murf or Whisper, per STT_PROVIDER
    answer_task = None
    # Generation counter: bumped on every interruption / new answer so stale
    # Gemini results are discarded instead of being spoken after a barge-in.
    # speaking/answer track TTS playback (Murf barge-in echo rejection uses them;
    # harmless for Whisper). ignore_finals_until is a short grace window after
    # a barge-in during which finals from pre-interrupt audio are dropped.
    # turn_timer/held_texts belong to stt_murf's end-of-turn hold (Murf path
    # only; Whisper turns use segment buffering below).
    state = {
        "gen": 0,
        "speaking": False,
        "answer": "",
        "ignore_finals_until": 0.0,
        "turn_timer": None,
        "held_texts": [],
    }

    try:
        # ---- Connect to the STT service ----
        try:
            if STT_PROVIDER == "murf":
                stt_ws = await open_murf_stt()
            else:
                stt_ws = await websockets.connect(
                    _with_query(WHISPER_WS_URL, {
                        "use_vad": "true",
                        "vad_threshold": "0.5",
                        "buffer_duration_ms": "1500",
                        "turn_silence_ms": "2000",
                        "turn_threshold": "0.70",
                        "max_turn_duration_ms": "10000",
                        "enable_speech_start": "true",
                        "enable_partial": "true",
                    }),
                    max_size=None,
                    open_timeout=15,
                )
            print(f"[VOICE] STT provider: {STT_PROVIDER}")
            print(f"[VOICE] TTS provider: {TTS_PROVIDER}")
        except Exception as e:
            print(f"[VOICE] STT connect failed: {type(e).__name__}: {e}")
            await _safe_send_json(browser_ws, {
                "type": "error",
                "message": f"STT service unreachable: {e}",
            })
            await browser_ws.close()
            return

        # Murf sends nothing on connect; Whisper sends `ready` from its event
        # stream below. The browser needs `ready` either way to start listening.
        if STT_PROVIDER == "murf":
            await _safe_send_json(browser_ws, {"type": "ready"})

        # ---- Run RAG + Gemini for a finished user turn, then stream TTS back ----
        async def run_answer(user_text: str):
            my_gen = state["gen"]
            tts_ws = None
            print(f"[VOICE] turn: '{user_text[:80]}'")
            try:
                # Gemini is a blocking SDK call -> keep it off the event loop
                try:
                    answer = await asyncio.to_thread(_answer_provider, user_text)
                except asyncio.CancelledError:
                    raise
                except Exception as e:
                    print(f"[VOICE] answer error: {e}")
                    await _safe_send_json(browser_ws, {"type": "error", "message": f"Answer failed: {e}"})
                    return

                if state["gen"] != my_gen:
                    print("[VOICE] answer stale (interrupted during Gemini), dropping")
                    return

                await _safe_send_json(browser_ws, {"type": "response", "text": answer, "question": user_text})

                # Fresh TTS connection per answer (see module docstring)
                try:
                    if TTS_PROVIDER == "fish":
                        tts_ws = await open_fish_tts()
                    else:
                        tts_ws = await _open_kokoro()
                except Exception as e:
                    await _safe_send_json(browser_ws, {
                        "type": "error",
                        "message": f"TTS service unreachable: {e}",
                    })
                    return

                # Barge-in window opens: bot is audibly speaking
                state["speaking"] = True
                state["answer"] = answer
                print("[VOICE] TTS window open (barge-in armed)")

                # Enable Whisper barge-in detection for this TTS generation
                # (Murf needs no arming — its relay watches for barge-ins itself)
                if STT_PROVIDER == "whisper":
                    await _safe_ws_send(stt_ws, json.dumps({"type": "tts_start"}))

                # Send the whole answer; the TTS service synthesizes and streams back
                if TTS_PROVIDER == "fish":
                    await send_fish_text(tts_ws, answer)
                else:
                    # Kokoro synthesizes per sentence automatically
                    await _safe_ws_send(tts_ws, json.dumps({"type": "text", "content": answer}))
                    await _safe_ws_send(tts_ws, json.dumps({"type": "done"}))

                # ---- Relay TTS audio to the browser ----
                speaking_sent = False
                async for message in tts_ws:
                    if TTS_PROVIDER == "fish":
                        # Fish wraps audio in msgpack AudioEvents (binary frames)
                        etype, payload = parse_fish_message(message)
                        if etype == "audio" and payload:
                            if not speaking_sent:
                                speaking_sent = True
                                await _safe_send_json(browser_ws, {"type": "speaking"})
                            await browser_ws.send_bytes(payload)
                        elif etype == "finish":
                            if payload and payload != "stop":
                                print(f"[VOICE][FISH] finish reason: {payload}")
                            break
                    elif isinstance(message, bytes):
                        if not speaking_sent:
                            speaking_sent = True
                            await _safe_send_json(browser_ws, {"type": "speaking"})
                        await browser_ws.send_bytes(message)
                    else:
                        msg = json.loads(message)
                        if msg.get("type") == "complete":
                            break

                # NOTE: no speaking_done here — Kokoro's `complete` only means
                # SYNTHESIS ended; the browser may still be playing queued
                # audio for seconds. The browser sends `playback_done` when
                # playback truly ends (handled in browser_to_stt), and that is
                # what closes the barge-in window.
            except asyncio.CancelledError:
                # Barge-in (or newer turn): abort synthesis server-side.
                # Fish has no cancel event — closing the socket stops it;
                # Kokoro needs `clear` to drop its pending-text buffer.
                if tts_ws is not None:
                    if TTS_PROVIDER != "fish":
                        await _safe_ws_send(tts_ws, json.dumps({"type": "clear"}))
                    await _safe_ws_close(tts_ws)
                raise
            finally:
                state["speaking"] = False
                state["answer"] = ""
                if tts_ws is not None:
                    await _safe_ws_close(tts_ws)

        def spawn_answer(user_text: str):
            nonlocal answer_task, state
            if answer_task is not None and not answer_task.done():
                answer_task.cancel()
            state["gen"] += 1
            asyncio.ensure_future(_safe_send_json(browser_ws, {"type": "thinking"}))
            answer_task = asyncio.ensure_future(run_answer(user_text))

        # Shared by the browser's client-side VAD interrupt, Whisper's
        # `interruption` event and Murf's speech-during-TTS detection: stop the
        # in-flight answer and tell the browser to cut playback
        def trigger_barge_in():
            nonlocal answer_task
            print("[VOICE] barge-in triggered")
            state["gen"] += 1
            state["speaking"] = False
            state["answer"] = ""
            # Transcripts still in flight from before the cut are echo-tinged
            # audio the user talked over — give Murf ~1s to flush them, then
            # fresh finals carry the actual barge-in question again
            state["ignore_finals_until"] = time.monotonic() + 1.0
            cancel_pending_turn(state)
            if answer_task is not None and not answer_task.done():
                answer_task.cancel()
            asyncio.ensure_future(_safe_send_json(browser_ws, {"type": "interruption"}))

        # ---- Whisper → browser (STT events + interruption handling) ----
        async def whisper_to_browser():
            user_text_buffer = ""

            async for message in stt_ws:
                if not isinstance(message, str):
                    continue
                try:
                    event = json.loads(message)
                except json.JSONDecodeError:
                    continue

                etype = event.get("type")

                if etype == "partial":
                    await _safe_send_json(browser_ws, {"type": "partial", "text": event.get("text", "")})

                elif etype == "segment_completed":
                    text = (event.get("text") or "").strip()
                    if text:
                        user_text_buffer = f"{user_text_buffer} {text}".strip()

                elif etype == "turn_end":
                    # turn_end carries no text; the transcript accumulated from segments is the question
                    if user_text_buffer:
                        spawn_answer(user_text_buffer)
                        user_text_buffer = ""

                elif etype == "speech_start":
                    await _safe_send_json(browser_ws, {"type": "speech_start"})

                elif etype == "interruption":
                    trigger_barge_in()
                    # TTS playback ended -> tell Whisper to disable barge-in mode
                    await _safe_ws_send(stt_ws, json.dumps({"type": "tts_end"}))
                    user_text_buffer = ""

                elif etype == "ready":
                    await _safe_send_json(browser_ws, {"type": "ready"})

                # ping / status / complete / interrupt_ack: nothing to do

        # ---- browser → STT (mic audio + control messages) ----
        async def browser_to_stt():
            while True:
                try:
                    msg = await browser_ws.receive()
                except (WebSocketDisconnect, RuntimeError):
                    return
                if msg.get("type") == "websocket.disconnect":
                    return
                if "bytes" in msg and msg["bytes"] is not None:
                    await _safe_ws_send(stt_ws, msg["bytes"])
                # reset/interrupt control frames are Whisper-only; Murf rejects
                # unknown text frames, so never forward them there
                elif "text" in msg and msg["text"] is not None:
                    try:
                        data = json.loads(msg["text"])
                    except json.JSONDecodeError:
                        continue
                    ctype = data.get("type")
                    if ctype == "playback_done":
                        # The browser's audio queue actually drained. The
                        # barge-in window (state.speaking) stays open through
                        # the whole playback so interruptions during the tail
                        # cut the audio instead of becoming a new question.
                        state["speaking"] = False
                        state["answer"] = ""
                        if STT_PROVIDER == "whisper":
                            await _safe_ws_send(stt_ws, json.dumps({"type": "tts_end"}))
                    elif ctype == "interrupt":
                        # Client-side barge-in: the browser VAD heard the user
                        # talking over the playback and already cut the audio.
                        # Cancel the answer here; keep streaming mic audio to
                        # Murf so its next final carries the new question.
                        # (`interrupt` is a local control frame — never
                        # forwarded to Murf, which rejects unknown text frames.)
                        trigger_barge_in()
                        if STT_PROVIDER == "whisper":
                            await _safe_ws_send(stt_ws, msg["text"])
                    elif ctype == "speech_start":
                        # Client Silero VAD: the user started talking again.
                        # On the Murf path this extends a pending unfinished-
                        # turn hold so continuing speech merges into one
                        # question (the follow-up final lands before it
                        # fires). Whisper handles turns itself — ignore.
                        if STT_PROVIDER == "murf":
                            extend_turn_hold(state)
                    elif ctype == "reset" and STT_PROVIDER == "whisper":
                        await _safe_ws_send(stt_ws, msg["text"])

        relay_to_stt = asyncio.ensure_future(browser_to_stt())
        if STT_PROVIDER == "murf":
            relay_to_browser = asyncio.ensure_future(
                make_murf_relay(stt_ws, browser_ws, state, spawn_answer, trigger_barge_in)()
            )
        else:
            relay_to_browser = asyncio.ensure_future(whisper_to_browser())
        done, pending = await asyncio.wait(
            {relay_to_stt, relay_to_browser},
            return_when=asyncio.FIRST_EXCEPTION,
        )
        for task in pending:
            task.cancel()
        for task in done:
            if not task.cancelled() and task.exception() is not None:
                print(f"[VOICE] relay error: {task.exception()}")
                await _safe_send_json(browser_ws, {"type": "error", "message": "Voice relay failed"})

    except WebSocketDisconnect:
        pass
    except Exception as e:
        print(f"[VOICE] connection error: {e}")
    finally:
        cancel_pending_turn(state)
        if answer_task is not None and not answer_task.done():
            answer_task.cancel()
        if stt_ws is not None:
            await _safe_ws_close(stt_ws)
        try:
            await browser_ws.close()
        except Exception:
            pass
