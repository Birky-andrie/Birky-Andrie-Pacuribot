export interface CeramicSwitchAudio {
  unlock: () => void;
  setMuted: (muted: boolean) => void;
  isMuted: () => boolean;
  isUnlocked: () => boolean;
  playPress: (row?: number, soft?: boolean) => void;
  playRelease: (row?: number, soft?: boolean) => void;
  dispose: () => void;
}

/**
 * Procedural Web Audio synthesizer tuned for heavy ceramic keycaps
 * mounted on tactile brown mechanical switches:
 *  - Pre-travel tactile leaf bump (subtle 1.85kHz damped transient)
 *  - Dense, creamy ceramic bottom-out thock (360->205Hz body + 940Hz porcelain formant + lowpass impact)
 *  - Clean ceramic upstroke return on key release
 */
export function createCeramicSwitchAudio(): CeramicSwitchAudio {
  let ctx: AudioContext | null = null;
  let noiseBuffer: AudioBuffer | null = null;
  let muted = false;
  let unlocked = false;
  let disposed = false;
  let lastSoftAt = 0;

  const ensureContext = (): AudioContext | null => {
    if (disposed || typeof window === "undefined") return null;
    if (!ctx) {
      const AudioCtor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtor) return null;
      try {
        ctx = new AudioCtor();
      } catch {
        return null;
      }
    }
    if (!noiseBuffer && ctx) {
      const len = Math.floor(ctx.sampleRate * 0.08);
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) {
        // Exponentially pre-shaped white noise for snappy mechanical transients
        const env = Math.exp(-i / (ctx.sampleRate * 0.014));
        data[i] = (Math.random() * 2 - 1) * env;
      }
      noiseBuffer = buf;
    }
    return ctx;
  };

  const unlock = () => {
    if (disposed) return;
    const audio = ensureContext();
    if (!audio) return;
    if (audio.state === "suspended") {
      void audio
        .resume()
        .then(() => {
          if (audio.state === "running") unlocked = true;
        })
        .catch(() => {});
    } else if (audio.state === "running") {
      unlocked = true;
    }
  };

  const rowPitchFactor = (row: number) => {
    // Row 0 (top) slightly tighter, Row 3 (bottom) deeper ceramic thock
    const rowShift = 1.045 - Math.max(0, Math.min(3, row)) * 0.032;
    const jitter = 0.965 + Math.random() * 0.07;
    return rowShift * jitter;
  };

  const playPress = (row = 1, soft = false) => {
    if (disposed || muted || typeof document === "undefined" || document.hidden) {
      return;
    }
    const nowMs = performance.now();
    if (soft) {
      if (nowMs - lastSoftAt < 52) return;
      lastSoftAt = nowMs;
    }

    const audio = ensureContext();
    if (!audio) return;
    if (audio.state !== "running") {
      if (!soft) unlock();
      return;
    }
    unlocked = true;

    const t = audio.currentTime;
    const pitch = rowPitchFactor(row);
    const vol = (soft ? 0.42 : 0.95) * (0.92 + Math.random() * 0.16);

    const master = audio.createGain();
    master.gain.setValueAtTime(vol * 0.42, t);
    master.connect(audio.destination);

    // 1. Tactile Brown switch leaf bump (0ms -> 11ms)
    if (noiseBuffer) {
      const bumpSrc = audio.createBufferSource();
      bumpSrc.buffer = noiseBuffer;
      const bumpFilter = audio.createBiquadFilter();
      bumpFilter.type = "bandpass";
      bumpFilter.frequency.setValueAtTime(1880 * pitch, t);
      bumpFilter.Q.setValueAtTime(3.1, t);

      const bumpGain = audio.createGain();
      bumpGain.gain.setValueAtTime(0.001, t);
      bumpGain.gain.linearRampToValueAtTime(0.24, t + 0.0022);
      bumpGain.gain.exponentialRampToValueAtTime(0.0008, t + 0.011);

      bumpSrc.connect(bumpFilter).connect(bumpGain).connect(master);
      bumpSrc.start(t);
      bumpSrc.stop(t + 0.014);
      bumpSrc.onended = () => {
        bumpSrc.disconnect();
        bumpFilter.disconnect();
        bumpGain.disconnect();
      };
    }

    // 2. Ceramic keycap bottom-out body thock (starts +6ms after tactile bump)
    const impactT = t + 0.0065;
    const bodyOsc = audio.createOscillator();
    bodyOsc.type = "sine";
    bodyOsc.frequency.setValueAtTime(375 * pitch, impactT);
    bodyOsc.frequency.exponentialRampToValueAtTime(195 * pitch, impactT + 0.056);

    const bodyGain = audio.createGain();
    bodyGain.gain.setValueAtTime(0.001, impactT);
    bodyGain.gain.linearRampToValueAtTime(0.82, impactT + 0.003);
    bodyGain.gain.exponentialRampToValueAtTime(0.0008, impactT + 0.064);

    bodyOsc.connect(bodyGain).connect(master);
    bodyOsc.start(impactT);
    bodyOsc.stop(impactT + 0.068);
    bodyOsc.onended = () => {
      bodyOsc.disconnect();
      bodyGain.disconnect();
    };

    // 3. Porcelain / ceramic resonant ring harmonic (dense glassy-warm sheen)
    const ceramicOsc = audio.createOscillator();
    ceramicOsc.type = "triangle";
    ceramicOsc.frequency.setValueAtTime(935 * pitch, impactT);
    ceramicOsc.frequency.exponentialRampToValueAtTime(760 * pitch, impactT + 0.024);

    const ceramicLP = audio.createBiquadFilter();
    ceramicLP.type = "lowpass";
    ceramicLP.frequency.setValueAtTime(1450 * pitch, impactT);

    const ceramicGain = audio.createGain();
    ceramicGain.gain.setValueAtTime(0.001, impactT);
    ceramicGain.gain.linearRampToValueAtTime(0.22, impactT + 0.0018);
    ceramicGain.gain.exponentialRampToValueAtTime(0.0008, impactT + 0.028);

    ceramicOsc.connect(ceramicLP).connect(ceramicGain).connect(master);
    ceramicOsc.start(impactT);
    ceramicOsc.stop(impactT + 0.032);
    ceramicOsc.onended = () => {
      ceramicOsc.disconnect();
      ceramicLP.disconnect();
      ceramicGain.disconnect();
    };

    // 4. Low-passed plate impact burst (warm bottom-out weight)
    if (noiseBuffer) {
      const hitSrc = audio.createBufferSource();
      hitSrc.buffer = noiseBuffer;
      const hitLP = audio.createBiquadFilter();
      hitLP.type = "lowpass";
      hitLP.frequency.setValueAtTime(690 * pitch, impactT);

      const hitGain = audio.createGain();
      hitGain.gain.setValueAtTime(0.001, impactT);
      hitGain.gain.linearRampToValueAtTime(0.55, impactT + 0.002);
      hitGain.gain.exponentialRampToValueAtTime(0.0008, impactT + 0.022);

      hitSrc.connect(hitLP).connect(hitGain).connect(master);
      hitSrc.start(impactT);
      hitSrc.stop(impactT + 0.028);
      hitSrc.onended = () => {
        hitSrc.disconnect();
        hitLP.disconnect();
        hitGain.disconnect();
        master.disconnect();
      };
    } else {
      bodyOsc.onended = () => {
        bodyOsc.disconnect();
        bodyGain.disconnect();
        master.disconnect();
      };
    }
  };

  const playRelease = (row = 1, soft = false) => {
    if (disposed || muted || typeof document === "undefined" || document.hidden) {
      return;
    }
    const audio = ensureContext();
    if (!audio || audio.state !== "running") return;

    const t = audio.currentTime;
    const pitch = rowPitchFactor(row);
    const vol = (soft ? 0.25 : 0.56) * (0.94 + Math.random() * 0.12);

    const master = audio.createGain();
    master.gain.setValueAtTime(vol * 0.34, t);
    master.connect(audio.destination);

    // Lighter ceramic top-housing upstroke return
    const upOsc = audio.createOscillator();
    upOsc.type = "sine";
    upOsc.frequency.setValueAtTime(560 * pitch, t);
    upOsc.frequency.exponentialRampToValueAtTime(380 * pitch, t + 0.032);

    const upGain = audio.createGain();
    upGain.gain.setValueAtTime(0.001, t);
    upGain.gain.linearRampToValueAtTime(0.48, t + 0.002);
    upGain.gain.exponentialRampToValueAtTime(0.0008, t + 0.034);

    upOsc.connect(upGain).connect(master);
    upOsc.start(t);
    upOsc.stop(t + 0.038);

    if (noiseBuffer) {
      const tickSrc = audio.createBufferSource();
      tickSrc.buffer = noiseBuffer;
      const tickBP = audio.createBiquadFilter();
      tickBP.type = "bandpass";
      tickBP.frequency.setValueAtTime(2450 * pitch, t);
      tickBP.Q.setValueAtTime(2.6, t);

      const tickGain = audio.createGain();
      tickGain.gain.setValueAtTime(0.001, t);
      tickGain.gain.linearRampToValueAtTime(0.18, t + 0.0015);
      tickGain.gain.exponentialRampToValueAtTime(0.0008, t + 0.012);

      tickSrc.connect(tickBP).connect(tickGain).connect(master);
      tickSrc.start(t);
      tickSrc.stop(t + 0.016);
      tickSrc.onended = () => {
        tickSrc.disconnect();
        tickBP.disconnect();
        tickGain.disconnect();
      };
    }

    upOsc.onended = () => {
      upOsc.disconnect();
      upGain.disconnect();
      master.disconnect();
    };
  };

  return {
    unlock,
    setMuted(next: boolean) {
      muted = next;
    },
    isMuted() {
      return muted;
    },
    isUnlocked() {
      return unlocked;
    },
    playPress,
    playRelease,
    dispose() {
      disposed = true;
      noiseBuffer = null;
      if (ctx) {
        void ctx.close().catch(() => {});
        ctx = null;
      }
    },
  };
}
