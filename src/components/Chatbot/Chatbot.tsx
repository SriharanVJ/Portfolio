import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Mic } from 'lucide-react';
import type { MicVAD } from '@ricky0123/vad-web';

// Ensure this is the RAW URL, typically starting with raw.githubusercontent.com
const SRIHARAN_IMAGE_URL = 'https://raw.githubusercontent.com/SriharanVJ/Portfolio/main/Sriharan%20Photo.jpg';

// Same FastAPI base URL as before — the WS endpoint is derived from it (no new env var)
const FASTAPI_URL = import.meta.env.VITE_FASTAPI_URL || 'http://localhost:8000';
const VOICE_WS_URL = FASTAPI_URL.replace(/^http/, 'ws') + '/ws/voice';

// Audio formats: mic -> 16 kHz PCM16 (Whisper), playback <- 24 kHz PCM16 (Kokoro)
const MIC_SAMPLE_RATE = 16000;
const TTS_SAMPLE_RATE = 24000;

// Client-side barge-in tuning. While the bot speaks, sustained mic energy is
// the user talking over the answer — browser AEC already stripped the bot's
// own voice from the capture, so Murf never has to hear the interruption
// first (its VAD waits for silence, which is what made turns queue up).
const BARGE_RMS = 0.04;          // speech level after AGC; AEC residue sits below this
const BARGE_SPEECH_MS = 300;     // sustained speech needed to fire
const BARGE_ARM_DELAY_MS = 700;  // let AEC converge after playback starts
const BARGE_COOLDOWN_MS = 800;   // one interrupt per utterance, not a machine gun

type Status = 'idle' | 'connecting' | 'listening' | 'thinking' | 'speaking' | 'error';

// RMS (0..~0.5) of an AnalyserNode's time-domain data — drives the avatar effects
const analyserRms = (analyser: AnalyserNode | null, buf: Uint8Array): number => {
  if (!analyser) return 0;
  analyser.getByteTimeDomainData(buf);
  let sum = 0;
  for (let i = 0; i < buf.length; i++) {
    const v = (buf[i] - 128) / 128;
    sum += v * v;
  }
  return Math.sqrt(sum / buf.length);
};

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [errorInfo, setErrorInfo] = useState<{ title: string; message: string } | null>(null);

  // Session resources
  const wsRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const micCtxRef = useRef<AudioContext | null>(null);
  const micSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const playbackCtxRef = useRef<AudioContext | null>(null);
  const playingSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const nextStartRef = useRef(0);
  const lastEndRef = useRef(0); // scheduled end time of the last queued chunk
  const playbackTokenRef = useRef(0); // bumped on stopPlayback to cancel stale done-timers
  const doneTimerRef = useRef<number | null>(null);
  const speakingRef = useRef(false);   // bot audio is streaming/playing (barge-in armed)
  const bargeArmAtRef = useRef(0);     // when the current playback started
  const vadRef = useRef<MicVAD | null>(null); // Silero VAD (neural speech detection)
  // Voice-reactive avatar: analysers on the mic and playback graphs feed CSS
  // variables (--mic-lvl / --tts-lvl) at 60fps without React re-renders
  const micAnalyserRef = useRef<AnalyserNode | null>(null);
  const playAnalyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const avatarWrapRef = useRef<HTMLDivElement | null>(null);
  const closingRef = useRef(false);

  // ---------------- Playback (24 kHz PCM16 -> Float32, gapless queue) ----------------
  const stopPlayback = useCallback(() => {
    playbackTokenRef.current += 1;
    speakingRef.current = false;
    if (doneTimerRef.current !== null) {
      window.clearTimeout(doneTimerRef.current);
      doneTimerRef.current = null;
    }
    playingSourcesRef.current.forEach(src => {
      try { src.stop(); } catch { /* already stopped */ }
    });
    playingSourcesRef.current = [];
    nextStartRef.current = 0;
    lastEndRef.current = 0;
  }, []);

  // Report real end-of-playback to the backend. Kokoro's `complete` arrives
  // when SYNTHESIS ends, which can be seconds before the browser finishes
  // playing its queued chunks — the backend's barge-in window must stay open
  // until actual playback ends, or interruptions during the tail get misread
  // as new questions.
  const maybePlaybackDone = useCallback(function maybePlaybackDone() {
    const ctx = playbackCtxRef.current;
    const ws = wsRef.current;
    if (!ctx || !ws || ws.readyState !== WebSocket.OPEN) return;
    if (playingSourcesRef.current.length > 0) return;
    const remainingMs = (lastEndRef.current - ctx.currentTime) * 1000;
    const token = playbackTokenRef.current;
    if (remainingMs > 30) {
      // onended fired slightly early relative to the schedule — re-check later
      doneTimerRef.current = window.setTimeout(() => {
        if (playbackTokenRef.current === token) maybePlaybackDone();
      }, remainingMs + 20);
      return;
    }
    doneTimerRef.current = null;
    speakingRef.current = false; // barge-in window closes with real playback
    setStatus(prev => (prev === 'speaking' ? 'listening' : prev));
    ws.send(JSON.stringify({ type: 'playback_done' }));
  }, []);

  const playChunk = useCallback((int16: Int16Array) => {
    const ctx = playbackCtxRef.current;
    if (!ctx) return;

    const float32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) float32[i] = int16[i] / 32768.0;

    const buffer = ctx.createBuffer(1, float32.length, TTS_SAMPLE_RATE);
    buffer.copyToChannel(float32, 0);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    // Route through the analyser so the avatar glow tracks the bot's voice
    source.connect(playAnalyserRef.current ?? ctx.destination);

    // Chain chunks back-to-back; resync the schedule if we've fallen behind
    const now = ctx.currentTime;
    if (nextStartRef.current < now + 0.05) nextStartRef.current = now + 0.05;
    source.start(nextStartRef.current);
    nextStartRef.current += buffer.duration;
    lastEndRef.current = nextStartRef.current;

    playingSourcesRef.current.push(source);
    source.onended = () => {
      playingSourcesRef.current = playingSourcesRef.current.filter(s => s !== source);
      maybePlaybackDone();
    };
  }, [maybePlaybackDone]);

  // ---------------- Mic capture (16 kHz PCM16 binary frames) ----------------
  const startMic = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        sampleRate: MIC_SAMPLE_RATE,
        echoCancellation: true,   // also prevents the bot hearing its own TTS
        noiseSuppression: true,
        autoGainControl: true,
      },
    });
    streamRef.current = stream;

    let ctx: AudioContext;
    try {
      ctx = new AudioContext({ sampleRate: MIC_SAMPLE_RATE });
    } catch {
      ctx = new AudioContext(); // older browsers: resample manually below
    }
    micCtxRef.current = ctx;

    const source = ctx.createMediaStreamSource(stream);
    micSourceRef.current = source;
    // Mic analyser: the avatar bubble tracks the user's voice while listening
    const micAnalyser = ctx.createAnalyser();
    micAnalyser.fftSize = 512;
    source.connect(micAnalyser);
    micAnalyserRef.current = micAnalyser;
    const processor = ctx.createScriptProcessor(4096, 1, 1);
    processorRef.current = processor;

    const ratio = MIC_SAMPLE_RATE / ctx.sampleRate;

    // Barge-in run-length state (per session): sustained speech over the bot's
    // playback cuts the audio immediately and flags the backend
    let bargeRunMs = 0;
    let lastBargeAt = 0;

    // Silero VAD speech start: fires on real speech even amid noise (the RMS
    // fallback below triggers on any loud sound). Also reports speech to the
    // backend, which extends a pending unfinished-turn hold so continued
    // speech merges into one question.
    const vadSpeechStart = () => {
      const ws = wsRef.current;
      if (!ws || ws.readyState !== WebSocket.OPEN) return;
      ws.send(JSON.stringify({ type: 'speech_start' }));
      const now = performance.now();
      if (
        speakingRef.current &&
        now - lastBargeAt > BARGE_COOLDOWN_MS &&
        now - bargeArmAtRef.current > BARGE_ARM_DELAY_MS
      ) {
        lastBargeAt = now;
        stopPlayback();
        setStatus('listening');
        ws.send(JSON.stringify({ type: 'interrupt' }));
        console.log('[VOICE] barge-in: Silero VAD speech over playback, cutting audio');
      }
    };

    processor.onaudioprocess = (event: AudioProcessingEvent) => {
      const ws = wsRef.current;
      if (!ws || ws.readyState !== WebSocket.OPEN) return;

      const input = event.inputBuffer.getChannelData(0);

      if (speakingRef.current) {
        let sum = 0;
        for (let i = 0; i < input.length; i++) sum += input[i] * input[i];
        const rms = Math.sqrt(sum / input.length);
        const frameMs = (input.length / ctx.sampleRate) * 1000;
        bargeRunMs = rms > BARGE_RMS ? bargeRunMs + frameMs : 0;
        const now = performance.now();
        if (
          bargeRunMs >= BARGE_SPEECH_MS &&
          now - lastBargeAt > BARGE_COOLDOWN_MS &&
          now - bargeArmAtRef.current > BARGE_ARM_DELAY_MS
        ) {
          bargeRunMs = 0;
          lastBargeAt = now;
          stopPlayback();
          setStatus('listening');
          ws.send(JSON.stringify({ type: 'interrupt' }));
          console.log('[VOICE] barge-in: speech over playback, cutting audio');
        }
      } else {
        bargeRunMs = 0;
      }

      const outLength = Math.round(input.length * ratio);
      const resampled = new Float32Array(outLength);
      for (let i = 0; i < outLength; i++) {
        const pos = i / ratio;
        const idx = Math.floor(pos);
        const frac = pos - idx;
        const s0 = input[idx] ?? 0;
        const s1 = input[idx + 1] ?? s0;
        resampled[i] = s0 + frac * (s1 - s0);
      }

      const int16 = new Int16Array(outLength);
      for (let i = 0; i < outLength; i++) {
        const s = Math.max(-1, Math.min(1, resampled[i]));
        int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
      }
      ws.send(int16.buffer);
    };

    source.connect(processor);
    // Destination is required for ScriptProcessor to fire; mute it to avoid echo
    const silentGain = ctx.createGain();
    silentGain.gain.value = 0;
    processor.connect(silentGain);
    silentGain.connect(ctx.destination);

    // Silero VAD (primary barge-in / speech detector). Dynamic import so the
    // ONNX runtime stays out of the initial page load; the model and wasm
    // come from /public/vad. If it fails (old browser, blocked assets) the
    // RMS detector in onaudioprocess remains the fallback.
    try {
      const { MicVAD: MicVADClass } = await import('@ricky0123/vad-web');
      const vad = await MicVADClass.new({
        getStream: async () => stream,
        // Never let the VAD stop our shared mic tracks (its default
        // pauseStream stops them, which would mute the STT feed too)
        pauseStream: async () => {},
        resumeStream: async (s) => s,
        baseAssetPath: '/vad/',
        onnxWASMBasePath: '/vad/',
        model: 'v5',
        positiveSpeechThreshold: 0.6,
        negativeSpeechThreshold: 0.4,
        minSpeechMs: 250,       // ignore coughs and clicks
        redemptionMs: 700,      // silence allowed before speech "ends"
        preSpeechPadMs: 300,    // keep the start of the first word
        onSpeechStart: vadSpeechStart,
      });
      await vad.start();
      vadRef.current = vad;
    } catch (e) {
      console.warn('[VOICE] Silero VAD unavailable, falling back to RMS barge-in', e);
    }
  }, [stopPlayback]);

  const stopMic = useCallback(() => {
    vadRef.current?.destroy().catch(() => undefined);
    vadRef.current = null;
    micAnalyserRef.current = null;
    processorRef.current?.disconnect();
    micSourceRef.current?.disconnect();
    processorRef.current = null;
    micSourceRef.current = null;
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    micCtxRef.current?.close().catch(() => undefined);
    micCtxRef.current = null;
  }, []);

  // ---------------- Session lifecycle ----------------
  const showError = useCallback((title: string, message: string) => {
    setErrorInfo({ title, message });
    setStatus('error');
    stopMic();
    stopPlayback();
  }, [stopMic, stopPlayback]);

  const startSession = useCallback(async () => {
    setStatus('connecting');
    setErrorInfo(null);
    closingRef.current = false;

    // Ask for mic permission first, then connect
    try {
      await startMic();
    } catch {
      showError('Microphone Access Needed', 'Please allow microphone access in your browser to talk to me.');
      return;
    }

    // Playback context for Kokoro's 24 kHz PCM16 audio
    try {
      playbackCtxRef.current = new AudioContext({ sampleRate: TTS_SAMPLE_RATE });
    } catch {
      playbackCtxRef.current = new AudioContext();
    }
    nextStartRef.current = 0;

    // Playback analyser feeds the avatar glow while the bot speaks
    const playAnalyser = playbackCtxRef.current.createAnalyser();
    playAnalyser.fftSize = 512;
    playAnalyser.connect(playbackCtxRef.current.destination);
    playAnalyserRef.current = playAnalyser;

    // 60fps avatar driver: fast attack, slow release, written straight to CSS
    // variables so the effects track the voice without React re-renders
    const micBuf = new Uint8Array(256);
    const playBuf = new Uint8Array(256);
    let micLvl = 0;
    let ttsLvl = 0;
    const tick = () => {
      micLvl = Math.max(analyserRms(micAnalyserRef.current, micBuf) * 5, micLvl * 0.85);
      ttsLvl = Math.max(analyserRms(playAnalyserRef.current, playBuf) * 5, ttsLvl * 0.85);
      const el = avatarWrapRef.current;
      if (el) {
        el.style.setProperty('--mic-lvl', Math.min(1, micLvl).toFixed(3));
        el.style.setProperty('--tts-lvl', Math.min(1, ttsLvl).toFixed(3));
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    const ws = new WebSocket(VOICE_WS_URL);
    ws.binaryType = 'arraybuffer';
    wsRef.current = ws;

    ws.onopen = () => console.log('[VOICE] connected to', VOICE_WS_URL);

    ws.onmessage = (event) => {
      if (typeof event.data === 'string') {
        const data = JSON.parse(event.data);
        switch (data.type) {
          case 'ready':
            setStatus('listening');
            break;
          case 'thinking':
            speakingRef.current = false;
            setStatus('thinking');
            break;
          case 'speaking':
            setStatus('speaking');
            break;
          // speaking_done is gone: the browser knows when playback actually
          // ends and reports `playback_done` to the backend itself
          case 'interruption':
            stopPlayback();
            setStatus('listening');
            break;
          case 'error':
            showError('Voice Assistant Unavailable', data.message ?? 'Something went wrong.');
            break;
        }
      } else if (event.data instanceof ArrayBuffer) {
        // First audio chunk opens the barge-in window (armed after a short
        // AEC-convergence delay so the bot never interrupts itself)
        if (!speakingRef.current) {
          speakingRef.current = true;
          bargeArmAtRef.current = performance.now();
        }
        playChunk(new Int16Array(event.data));
      }
    };

    ws.onerror = () => {
      if (!closingRef.current) {
        showError('Voice Assistant Unavailable', 'Could not reach the voice backend. It may be offline.');
      }
    };

    ws.onclose = () => {
      if (!closingRef.current) {
        showError('Voice Assistant Unavailable', 'The voice connection was closed. Please try again.');
      }
    };
  }, [playChunk, showError, startMic, stopPlayback]);

  const stopSession = useCallback(() => {
    closingRef.current = true;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    playAnalyserRef.current = null;
    wsRef.current?.close();
    wsRef.current = null;
    stopMic();
    stopPlayback();
    playbackCtxRef.current?.close().catch(() => undefined);
    playbackCtxRef.current = null;
    setStatus('idle');
    setErrorInfo(null);
  }, [stopMic, stopPlayback]);

  const toggleOpen = useCallback(() => {
    if (isOpen) {
      stopSession();
      setIsOpen(false);
    } else {
      setIsOpen(true);
      startSession();
    }
  }, [isOpen, startSession, stopSession]);

  // Cleanup if the component unmounts mid-session
  useEffect(() => stopSession, [stopSession]);

  const statusLabel: Record<Status, string> = {
    idle: 'Offline',
    connecting: 'Connecting…',
    listening: 'Listening… speak now',
    thinking: 'Thinking…',
    speaking: 'Speaking… (interrupt anytime)',
    error: 'Error',
  };
  const dotColor: Record<Status, string> = {
    idle: 'bg-gray-500',
    connecting: 'bg-crimson-400 animate-pulse',
    listening: 'bg-forest-500 animate-pulse',
    thinking: 'bg-forest-500 animate-pulse',
    speaking: 'bg-crimson-500 animate-pulse',
    error: 'bg-red-500',
  };

  return (
    // bottom/right-12 (48px): the ring extends 40px past the button, so the
    // old 28px margin clipped it at the screen corner
    <div className="fixed bottom-12 right-12 z-[9999]">
      {/* Component-scoped styles: the rotating ring + voice-reactive avatar.
          --mic-lvl / --tts-lvl (0..1) are written every frame by the rAF loop
          in startSession, so these effects track the actual audio. */}
      <style>{`
        @keyframes voice-spin { to { transform: rotate(360deg); } }
        .voice-ring { animation: voice-spin 14s linear infinite; }
        .avatar-bubble { transform: scale(calc(1 + var(--mic-lvl, 0) * 0.25)); }
        .avatar-glow {
          opacity: calc(var(--tts-lvl, 0) * 0.85);
          /* translate before scale = constant optical nudge (up-left) at any scale */
          transform: translate(-2px, -3px) scale(calc(0.75 + var(--tts-lvl, 0) * 0.55));
        }
        .avatar-ring {
          opacity: calc(var(--tts-lvl, 0) * 0.9);
          transform: translate(-2px, -3px) scale(calc(1 + var(--tts-lvl, 0) * 0.3));
        }
        @keyframes think-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.07); } }
        .thinking-pulse { animation: think-pulse 1.8s ease-in-out infinite; }
      `}</style>

      {/* Voice Toggle Button — photo with a rotating "talk to me" ring */}
      <div className="relative">
        {!isOpen && (
          // Explicit size + negative offset (NOT w-full/-inset-*): the svg is a
          // replaced element, so w-full there shrank it to the button's 80px and
          // shifted the ring off-centre. 160px box on an 80px button = -40px.
          <svg
            className="voice-ring absolute -left-10 -top-10 w-40 h-40 pointer-events-none"
            viewBox="0 0 100 100"
            aria-hidden="true"
          >
            <defs>
              <path
                id="talk-circle"
                fill="none"
                d="M 50,50 m -42,0 a 42,42 0 1,1 84,0 a 42,42 0 1,1 -84,0"
              />
            </defs>
            <text
              className="fill-white/90"
              style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontFamily: 'monospace' }}
            >
              <textPath href="#talk-circle" textLength="262">
                Talk to me • Talk to me •
              </textPath>
            </text>
          </svg>
        )}
        <button
          onClick={toggleOpen}
          className="
              w-20 h-20 rounded-full bg-black text-white shadow-lg
              flex items-center justify-center transition-transform duration-300
              hover:scale-110 focus:outline-none
              relative z-50 p-0 overflow-hidden border border-white/20
          "
        >
          {isOpen ? (
            <X size={28} className="text-white" />
          ) : (
            <img
              src={SRIHARAN_IMAGE_URL}
              alt="Sriharan Voice Bot Icon"
              className="w-full h-full object-cover rounded-full"
            />
          )}
        </button>
      </div>

      {/* Voice Window — transparent glass, avatar centred */}
      {isOpen && (
        <div
          className="
              absolute bottom-0 right-0 transform translate-y-[-112px]
              w-80 h-[380px] bg-transparent backdrop-blur-2xl text-forest-400 rounded-3xl
              shadow-2xl flex flex-col overflow-hidden border border-white/15
          "
        >
          {/* Error / Maintenance Popup */}
          {errorInfo && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-xl flex flex-col items-center justify-center p-4 z-20">
              <div className="w-20 h-20 rounded-full border-4 border-forest-600 mb-4 overflow-hidden">
                <img src={SRIHARAN_IMAGE_URL} alt="Bot Icon" className="w-full h-full object-cover" />
              </div>
              <p className="text-white text-xl font-bold text-center mb-2 font-serif">
                {errorInfo.title}
              </p>
              <p className="text-forest-400 text-center text-sm font-mono mb-6">
                {errorInfo.message}
                <br />
                Please try again later!
              </p>
              <button
                onClick={() => {
                  stopSession();
                  setIsOpen(false);
                }}
                className="bg-forest-600 text-white p-2 px-4 rounded-md hover:bg-forest-700 transition font-mono"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Header */}
          <div className="px-4 py-2.5 flex justify-between items-center border-b border-white/10 bg-white/5">
            <span className="font-serif text-base font-bold text-forest-300">
              Talk with Sriharan&apos;s Bot
            </span>
            <button onClick={toggleOpen} className="text-forest-400/80 hover:text-forest-300">
              <X size={18} />
            </button>
          </div>

          {/* Avatar stage — photo bubbles with the user's voice while
              listening, glows with the bot's voice while speaking. The glow
              and ring anchor to the photo box with negative insets; as bare
              absolute children of this flex stage their static position lands
              at the stage centre, ~16px below the photo's centre. */}
          <div ref={avatarWrapRef} className="relative flex-1 flex flex-col items-center justify-center gap-3 px-4">
            <div className="relative w-28 h-28">
              <div className="avatar-glow absolute -inset-8 rounded-full bg-forest-400/60 blur-2xl pointer-events-none" />
              <div className="avatar-ring absolute -inset-2 rounded-full border-2 border-forest-400 pointer-events-none" />
              <img
                src={SRIHARAN_IMAGE_URL}
                alt="Sriharan"
                className={`relative w-28 h-28 rounded-full object-cover border-2 border-white/25 shadow-xl ${
                  status === 'listening' ? 'avatar-bubble' : ''
                } ${status === 'thinking' ? 'thinking-pulse' : ''}`}
              />
            </div>
            <div className="flex items-center gap-2">
              <Mic size={14} className={status === 'listening' ? 'text-forest-400' : 'text-forest-400/60'} />
              <span className="text-sm font-mono text-forest-300">{statusLabel[status]}</span>
              <span className={`w-2 h-2 rounded-full ${dotColor[status]}`} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
