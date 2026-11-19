# ##########################
# # MURF CLOUD STT ADAPTER ###
# ##########################
"""
Murf streaming Speech-to-Text (separate provider — selected via .env).

    STT_PROVIDER=murf     # "murf" (cloud, this module) | "whisper" (self-hosted)
    MURF_API_KEY=...      # from https://murf.ai/api/dashboard  (backend-only!)
    MURF_STT_URL=wss://in.api.murf.ai/v1/transcription/stream-input
    MURF_STT_MODEL=finch_indic_1.0   # India host; finch_global_1.0 on us-east host
    MURF_STT_LANGUAGE=en  # or auto / comma-separated list

Protocol (https://murf.ai/api/docs/speech-to-text/streaming):
- Audio: 16-bit signed LE PCM, 16 kHz, mono is the DEFAULT format — exactly
  what the browser sends — so no AudioConfig message is needed.
- Send binary frames (20-100 ms each is recommended; the browser's 4096-sample
  frames are ~256 ms, Murf accepts them fine, partials just lag slightly).
- Receive {"type": "partial", "transcript": "..."} while the user speaks —
  each partial is the whole turn so far (replace, don't append) — and
  {"type": "final", ...} when the caller pauses (commit_mode=vad default:
  server-side VAD ends the turn, no Finalize needed from us).
- No KeepAlive needed: the browser mic streams continuously, so the connection
  never goes idle (Murf closes idle connections with code 4008).
- Close codes: 4001 bad key, 4002 bad config, 4004 concurrency limit (free
  tier: 5), 4005 out of credits, 4008 idle timeout.

Barge-in: Murf has no barge-in/interruption API (unlike the Whisper service's
tts_start/tts_end handshake). The PRIMARY detector is client-side: the browser
watches mic energy during playback (its AEC strips the bot's own voice) and
sends an `interrupt` control frame on sustained speech — voice_ws cancels the
answer immediately, so interruptions cut audio instantly instead of queueing.
As a backup, make_murf_relay() still cancels when a partial/final arriving
DURING playback is not an echo of the spoken answer (substring guard plus
Murf's bvc=1 background-voice cleanup).
"""
import asyncio
import json
import os
import re
import time
import urllib.parse

import websockets

def _murf_env() -> dict:
    """Read MURF_* config lazily so import order never matters: this module can
    be imported before load_dotenv() runs (voice_ws.py used to do exactly that,
    which made MURF_API_KEY come up empty). load_dotenv() is a no-op when .env
    is already loaded."""
    from dotenv import load_dotenv
    load_dotenv()
    return {
        "url": os.getenv("MURF_STT_URL", "wss://in.api.murf.ai/v1/transcription/stream-input"),
        "api_key": os.getenv("MURF_API_KEY", ""),
        "model": os.getenv("MURF_STT_MODEL", "finch_indic_1.0"),
        "language": os.getenv("MURF_STT_LANGUAGE", "en"),
    }


def _with_query(url: str, params: dict) -> str:
    """Append query params to a WS URL, preserving any existing ones."""
    joiner = "&" if "?" in url else "?"
    return url + joiner + urllib.parse.urlencode(params)


async def _safe_send_json(ws, payload: dict):
    try:
        await ws.send_json(payload)
    except Exception:
        pass


def _norm_text(s: str) -> str:
    return re.sub(r"[^a-z0-9 ]+", "", s.lower()).strip()


def _is_user_barge_in(text: str, answer: str) -> bool:
    """True if speech heard during TTS is the user, not an echo of the bot's own voice."""
    t = _norm_text(text)
    return bool(t) and t not in _norm_text(answer or "")


async def open_murf_stt():
    """Open the Murf transcription session. Murf sends nothing until audio arrives."""
    cfg = _murf_env()
    if not cfg["api_key"]:
        raise RuntimeError("MURF_API_KEY is not set (add it to .env)")
    url = _with_query(cfg["url"], {
        "api_key": cfg["api_key"],
        "model": cfg["model"],
        "language": cfg["language"],
        "bvc": "true",  # strip background voices (also helps reject bot self-echo)
    })
    return await websockets.connect(url, max_size=None, open_timeout=15)


def make_murf_relay(murf_ws, browser_ws, state, spawn_answer, trigger_barge_in):
    """
    Build the Murf -> browser relay coroutine (the Murf counterpart of
    voice_ws.whisper_to_browser). Shared state comes from voice_endpoint:

      state["speaking"]  True while Kokoro audio is streaming to the browser
      state["answer"]    the text currently being spoken (echo guard)
      spawn_answer(text) start RAG+Gemini+TTS for a finished user turn
      trigger_barge_in() cancel the in-flight answer + notify the browser
    """

    async def murf_to_browser():
        async for message in murf_ws:
            if not isinstance(message, str):
                continue
            try:
                event = json.loads(message)
            except json.JSONDecodeError:
                continue

            etype = event.get("type")

            if etype in ("partial", "final"):
                text = (event.get("transcript") or "").strip()
                if state["speaking"]:
                    # TTS audio is playing: real user speech is a barge-in; an
                    # echo of the bot's own answer is ignored. Partials are not
                    # forwarded to the browser during playback (transcript UI
                    # would churn over the answer bubble).
                    barge = bool(text) and _is_user_barge_in(text, state["answer"])
                    print(f"[VOICE][MURF] {etype} during TTS: '{text[:70]}' -> barge_in={barge}")
                    if barge:
                        trigger_barge_in()
                        # A turn that already finalized during playback is a
                        # full new question -> answer it immediately
                        if etype == "final":
                            spawn_answer(text)
                elif etype == "partial" and text:
                    print(f"[VOICE][MURF] partial: '{text[:70]}'")
                    await _safe_send_json(browser_ws, {"type": "partial", "text": text})
                elif etype == "final" and text:
                    # Right after a barge-in the first final can still be
                    # echo-tinged audio from before the cut — drop it inside
                    # the grace window; the user's ongoing speech produces a
                    # fresh final immediately after
                    if time.monotonic() < state.get("ignore_finals_until", 0.0):
                        print(f"[VOICE][MURF] final in barge-in grace, dropped: '{text[:70]}'")
                    else:
                        # Server-side VAD says the user finished: that's the question
                        print(f"[VOICE][MURF] final -> answer: '{text[:70]}'")
                        spawn_answer(text)

            elif etype == "Error":
                print(f"[VOICE][MURF] error: {event.get('message')}")
                await _safe_send_json(browser_ws, {
                    "type": "error",
                    "message": f"Speech-to-text error: {event.get('message')}",
                })

            elif etype == "QuotaWarning":
                print(f"[VOICE][MURF] low balance: {event.get('remaining_funds')}")

            # KeepAlive acks / unknown types: nothing to do

        # Falling out of the loop means Murf closed the session (4001 bad key,
        # 4004 concurrency, 4005 credits, 4008 idle) — the browser must know
        await _safe_send_json(browser_ws, {
            "type": "error",
            "message": "Speech-to-text service disconnected",
        })

    return murf_to_browser
