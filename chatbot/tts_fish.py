# ##########################
# # FISH AUDIO TTS ADAPTER ###
# ##########################
"""
Fish Audio cloud Text-to-Speech (separate provider — selected via .env).

    TTS_PROVIDER=fish           # "fish" (cloud, this module) | "kokoro" (self-hosted)
    FISH_API_KEY=...            # from https://fish.audio/app/api-keys  (backend-only!)
    FISH_TTS_WS_URL=wss://api.fish.audio/v1/tts/live
    FISH_TTS_MODEL=s2.1-pro     # or s2.1-pro-free / s2-pro / drama-3 (sent as HTTP header)
    FISH_TTS_REFERENCE_ID=      # optional voice id from the Fish Voice Library
    FISH_TTS_LATENCY=balanced   # balanced = lowest time-to-first-audio (voice agents)
    FISH_TTS_SAMPLE_RATE=24000  # must match the browser's playback sample rate

Protocol (https://docs.fish.audio/api-reference/endpoint/websocket/tts-live.md):
- Auth is an HTTP header on the WS upgrade: Authorization: Bearer <key>
  (plus an optional `model` header).
- Frames are MessagePack. Client sends {"event": "start", "request": {...}}
  first (MUST be the first message), then {"event": "text", ...}, an optional
  {"event": "flush"} to force synthesis of buffered text, and finally
  {"event": "stop"} — the constant is "stop", NOT "close".
- Server replies with {"event": "audio", "audio": <bytes>} chunks and one
  {"event": "finish", "reason": "stop" | "error"}, then closes the socket.
- format="pcm" with sample_rate=24000 yields 16-bit LE mono — exactly what
  the browser already plays, so no frontend change is needed.
- Cancellation: Fish has no cancel event; closing the socket aborts the
  synthesis server-side. Like Kokoro, we open a FRESH connection per answer
  (reusing one after a barge-in would risk stale audio).
"""
import os

import msgpack
import websockets


def _fish_env() -> dict:
    """Read FISH_* config lazily so import order never matters (same pattern
    as stt_murf: this module can be imported before load_dotenv() runs)."""
    from dotenv import load_dotenv
    load_dotenv()
    return {
        "url": os.getenv("FISH_TTS_WS_URL", "wss://api.fish.audio/v1/tts/live"),
        "api_key": os.getenv("FISH_API_KEY", ""),
        "model": os.getenv("FISH_TTS_MODEL", "s2.1-pro"),
        "reference_id": os.getenv("FISH_TTS_REFERENCE_ID", ""),
        "latency": os.getenv("FISH_TTS_LATENCY", "balanced"),
        "sample_rate": int(os.getenv("FISH_TTS_SAMPLE_RATE", "24000")),
    }


async def open_fish_tts():
    """Open a Fish TTS-live session and send the mandatory StartEvent."""
    cfg = _fish_env()
    if not cfg["api_key"]:
        raise RuntimeError("FISH_API_KEY is not set (add it to .env)")

    request = {
        "text": "",  # text arrives via TextEvent(s); empty here is the norm
        "format": "pcm",
        "sample_rate": cfg["sample_rate"],
        "chunk_length": 200,   # smaller chunks emit audio sooner
        "latency": cfg["latency"],
        "normalize": True,     # expand numbers/dates so they are spoken correctly
    }
    if cfg["reference_id"]:
        request["reference_id"] = cfg["reference_id"]

    ws = await websockets.connect(
        cfg["url"],
        extra_headers={
            "Authorization": f"Bearer {cfg['api_key']}",
            "model": cfg["model"],
        },
        max_size=None,
        open_timeout=15,
    )
    await ws.send(msgpack.packb({"event": "start", "request": request}))
    return ws


async def send_fish_text(ws, text: str):
    """Push the whole answer, force immediate synthesis, then end the input."""
    await ws.send(msgpack.packb({"event": "text", "text": text}))
    await ws.send(msgpack.packb({"event": "flush"}))
    await ws.send(msgpack.packb({"event": "stop"}))


def parse_fish_message(raw):
    """Decode a server frame -> (event, payload).

    'audio'  -> payload is raw PCM bytes, forwarded straight to the browser
    'finish' -> payload is the reason ("stop" on success, "error" on failure)
    anything else -> control/extension event, ignored by the relay
    """
    try:
        data = msgpack.unpackb(raw, raw=False)
    except Exception:
        return "unknown", None
    etype = data.get("event")
    if etype == "audio":
        return "audio", data.get("audio")
    if etype == "finish":
        return "finish", data.get("reason")
    return etype or "unknown", None
