"""One-shot diagnostic: try to open the Murf STT session exactly like voice_ws does."""
import asyncio
import os

from dotenv import load_dotenv

load_dotenv()

key = os.getenv("MURF_API_KEY", "")
print(f"MURF_API_KEY set: {bool(key) and not key.startswith('PASTE')}  (prefix: {key[:6]}...)")
print(f"MURF_STT_URL: {os.getenv('MURF_STT_URL')}")
print(f"MURF_STT_MODEL: {os.getenv('MURF_STT_MODEL')}  LANGUAGE: {os.getenv('MURF_STT_LANGUAGE')}")

from stt_murf import open_murf_stt


async def main():
    try:
        ws = await open_murf_stt()
        print("CONNECTED to Murf STT")
        try:
            msg = await asyncio.wait_for(ws.recv(), timeout=6)
            print(f"first message: {msg!r}")
        except asyncio.TimeoutError:
            print("no message in 6s — expected: Murf stays silent until audio arrives")
        await ws.close()
        print("probe closed cleanly (connection is fine)")
    except Exception as e:
        print(f"CONNECT FAILED: {type(e).__name__}: {e}")


asyncio.run(main())
