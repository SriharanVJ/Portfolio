"""One-shot diagnostic: connect to /ws/voice exactly like the browser does (no audio)."""
import asyncio
import json

import websockets


async def main():
    try:
        async with websockets.connect("ws://localhost:8000/ws/voice", open_timeout=10) as ws:
            print("connected to /ws/voice")
            for _ in range(3):
                try:
                    raw = await asyncio.wait_for(ws.recv(), timeout=6)
                    if isinstance(raw, bytes):
                        print(f"<- {len(raw)} audio bytes (unexpected before mic)")
                    else:
                        print(f"<- {raw[:200]}")
                except asyncio.TimeoutError:
                    print("no message in 6s — connection still OPEN (backend healthy)")
                    break
        print("probe closed cleanly")
    except Exception as e:
        print(f"FAILED: {type(e).__name__}: {e}")


asyncio.run(main())
