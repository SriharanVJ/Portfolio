# ##########################
# # OLLAMA LOCAL LLM ADAPTER #
# ##########################
"""
Ollama local LLM (separate provider — selected via .env). The open-source
counterpart of the cloud Gemini path in main.py.

    LLM_PROVIDER=ollama          # "ollama" (local, this module) | "gemini" (cloud/paid)
    OLLAMA_URL=http://localhost:11434
    OLLAMA_MODEL=qwen2.5:3b      # any tag from `ollama list`
    OLLAMA_TEMPERATURE=0.7
    OLLAMA_KEEP_ALIVE=30m        # keep the weights in VRAM between questions

Uses Ollama's native /api/chat with stream=false — the voice path wants the
full answer text before it starts TTS, so there is nothing to stream here.
Latency is dominated by model load + generation, both local: keep_alive keeps
the model resident in VRAM so the next question skips the multi-second cold
load (trade-off: the VRAM stays occupied next to Kokoro).

Persona rules arrive as the system message and the RAG context + question as
the user message — the standard shape for instruct models like qwen2.5.
"""
import os

import requests


def _ollama_env() -> dict:
    """Read OLLAMA_* config lazily so import order never matters (same
    pattern as stt_murf/tts_fish: safe to import before load_dotenv())."""
    from dotenv import load_dotenv
    load_dotenv()
    return {
        "url": os.getenv("OLLAMA_URL", "http://localhost:11434").rstrip("/"),
        "model": os.getenv("OLLAMA_MODEL", "qwen2.5:3b"),
        "temperature": float(os.getenv("OLLAMA_TEMPERATURE", "0.7")),
        "keep_alive": os.getenv("OLLAMA_KEEP_ALIVE", "30m"),
    }


def ask_ollama(system: str, user: str) -> str:
    """Blocking call: persona rules as the system message, context + question
    as the user message. Returns the raw answer text. Raises RuntimeError
    with a human-readable reason on any failure."""
    cfg = _ollama_env()
    payload = {
        "model": cfg["model"],
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        "stream": False,
        "keep_alive": cfg["keep_alive"],
        "options": {"temperature": cfg["temperature"]},
    }
    try:
        response = requests.post(f"{cfg['url']}/api/chat", json=payload, timeout=120)
        response.raise_for_status()
    except requests.exceptions.ConnectionError:
        raise RuntimeError(
            f"Ollama unreachable at {cfg['url']} — is it running? (`ollama serve`)"
        )
    except requests.exceptions.HTTPError as e:
        detail = ""
        try:
            detail = response.json().get("error", "")
        except Exception:
            pass
        raise RuntimeError(f"Ollama API error: {e} {detail}".strip())
    except requests.exceptions.Timeout:
        raise RuntimeError("Ollama timed out after 120s (first call loads the model — retry once)")

    data = response.json()
    content = (data.get("message") or {}).get("content", "").strip()
    if not content:
        raise RuntimeError("Ollama returned an empty answer")
    return content
