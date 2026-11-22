"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";

/**
 * 6-second cycle choreography (6000ms total):
 * - 0ms .. 3900ms: 4K Optical Depth-of-Field Portrait (phase = "photo")
 * - 3900ms .. 4300ms: Discrete Pixel-Block Step-Down (120 -> 64 -> 32 -> 18 grid)
 * - 4300ms .. 5600ms: Full 16-Bit Monochrome + #455CE9 Game Character Sprite + Floating Pixel HUD
 * - 5600ms .. 6000ms: Discrete Pixel-Block Step-Up back to 4K Optical DoF Portrait
 */
const CYCLE_MS = 6000;
const STEP_DOWN_START = 3900;
const SPRITE_HOLD_START = 4300;
const STEP_UP_START = 5600;

export function HeroPixelCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenRef = useRef<HTMLCanvasElement | null>(null);
  const photoImgRef = useRef<HTMLImageElement | null>(null);
  const spriteImgRef = useRef<HTMLImageElement | null>(null);

  const [isPixelMode, setIsPixelMode] = useState(false);
  const [manualLock, setManualLock] = useState(false);
  const cycleOffsetRef = useRef<number>(0);
  const manualLockRef = useRef<boolean>(false);

  useEffect(() => {
    manualLockRef.current = manualLock;
  }, [manualLock]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const offscreen = document.createElement("canvas");
    offscreenRef.current = offscreen;
    const offCtx = offscreen.getContext("2d");

    const photo = new Image();
    photo.decoding = "async";
    photo.src = "/hero-portrait-4k.jpg";

    const sprite = new Image();
    sprite.decoding = "async";
    sprite.src = "/hero-pixel-sprite.png";

    let loadedCount = 0;
    const onAssetLoad = () => {
      loadedCount += 1;
      if (loadedCount === 1) {
        // Set internal canvas resolution to high-DPI studio buffer (1440 x 1617)
        canvas.width = 1440;
        canvas.height = 1617;
      }
    };

    photo.onload = () => {
      photoImgRef.current = photo;
      onAssetLoad();
    };
    sprite.onload = () => {
      spriteImgRef.current = sprite;
      onAssetLoad();
    };

    let rafId = 0;
    let lastHudState = false;

    const render = (now: number) => {
      const pImg = photoImgRef.current;
      const sImg = spriteImgRef.current;

      if (pImg && canvas.width > 0 && canvas.height > 0) {
        const cw = canvas.width;
        const ch = canvas.height;

        if (manualLockRef.current && sImg) {
          // Locked in 16-bit Pixel Game Character state
          ctx.imageSmoothingEnabled = false;
          ctx.clearRect(0, 0, cw, ch);
          ctx.drawImage(sImg, 0, 0, cw, ch);
          if (!lastHudState) {
            lastHudState = true;
            setIsPixelMode(true);
          }
        } else {
          const elapsed = (now + cycleOffsetRef.current) % CYCLE_MS;

          if (elapsed < STEP_DOWN_START || !sImg) {
            // Phase 1: Razor-sharp 4K Optical Depth-of-Field Studio Portrait
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.clearRect(0, 0, cw, ch);
            ctx.drawImage(pImg, 0, 0, cw, ch);

            if (lastHudState) {
              lastHudState = false;
              setIsPixelMode(false);
            }
          } else if (elapsed < SPRITE_HOLD_START) {
            // Phase 2: Discrete Hardware Pixel-Block Step-Down into Game Sprite
            const t =
              (elapsed - STEP_DOWN_START) /
              (SPRITE_HOLD_START - STEP_DOWN_START);
            // Quantize into 4 discrete arcade block steps
            const steps = [160, 96, 56, 36];
            const stepIdx = Math.min(
              steps.length - 1,
              Math.floor(t * steps.length)
            );
            const gridW = steps[stepIdx];
            const gridH = Math.round((gridW * ch) / cw);

            if (offCtx) {
              offscreen.width = gridW;
              offscreen.height = gridH;
              offCtx.imageSmoothingEnabled = false;
              offCtx.clearRect(0, 0, gridW, gridH);
              // Cross-blend photo -> 16-bit sprite at low pixel resolution
              offCtx.globalAlpha = 1;
              offCtx.drawImage(t < 0.5 ? pImg : sImg, 0, 0, gridW, gridH);

              ctx.imageSmoothingEnabled = false;
              ctx.clearRect(0, 0, cw, ch);
              ctx.drawImage(offscreen, 0, 0, gridW, gridH, 0, 0, cw, ch);
            }

            if (!lastHudState && t > 0.45) {
              lastHudState = true;
              setIsPixelMode(true);
            }
          } else if (elapsed < STEP_UP_START) {
            // Phase 3: Hold Bespoke 16-Bit Monochrome + #455CE9 Pixel Game Character Sprite
            ctx.imageSmoothingEnabled = false;
            ctx.clearRect(0, 0, cw, ch);
            ctx.drawImage(sImg, 0, 0, cw, ch);

            if (!lastHudState) {
              lastHudState = true;
              setIsPixelMode(true);
            }
          } else {
            // Phase 4: Discrete Pixel-Block Step-Up back to 4K DoF Portrait
            const t =
              (elapsed - STEP_UP_START) / (CYCLE_MS - STEP_UP_START);
            const steps = [36, 56, 96, 160];
            const stepIdx = Math.min(
              steps.length - 1,
              Math.floor(t * steps.length)
            );
            const gridW = steps[stepIdx];
            const gridH = Math.round((gridW * ch) / cw);

            if (offCtx) {
              offscreen.width = gridW;
              offscreen.height = gridH;
              offCtx.imageSmoothingEnabled = false;
              offCtx.clearRect(0, 0, gridW, gridH);
              offCtx.drawImage(t < 0.45 ? sImg : pImg, 0, 0, gridW, gridH);

              ctx.imageSmoothingEnabled = false;
              ctx.clearRect(0, 0, cw, ch);
              ctx.drawImage(offscreen, 0, 0, gridW, gridH, 0, 0, cw, ch);
            }

            if (lastHudState && t > 0.5) {
              lastHudState = false;
              setIsPixelMode(false);
            }
          }
        }
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const handleTriggerPixel = () => {
    if (manualLock) {
      setManualLock(false);
      cycleOffsetRef.current = 0;
    } else {
      // Jump straight into the 16-bit Pixel Game Character phase
      const now = performance.now();
      cycleOffsetRef.current =
        STEP_DOWN_START - (now % CYCLE_MS) + CYCLE_MS;
    }
  };

  return (
    <div className="relative h-full w-full flex items-end justify-center">
      {/* Fallback / Immediate First-Paint 4K DoF Img beneath the canvas */}
      <img
        src="/hero-portrait.jpg"
        alt="Birky Andrie L. Pacuribot — 4K Depth of Field Studio Portrait"
        className="absolute inset-0 h-full w-full object-cover object-center transition-[filter] duration-500 ease-dennis"
        style={{ filter: "var(--hero-portrait-filter)" }}
      />

      {/* Real-Time 60fps 4K -> 16-Bit Pixel Game Character Step-Morph Canvas */}
      <canvas
        ref={canvasRef}
        width={1440}
        height={1617}
        aria-label="4K Studio Portrait morphing into a 16-bit pixelated game character every 6 seconds"
        className="relative z-10 h-full w-full object-cover object-center transition-[filter] duration-500 ease-dennis"
        style={{ filter: "var(--hero-portrait-filter)" }}
      />

      {/* Floating 16-Bit Arcade Status Pill (Appears during Pixel Character Phase, or click to trigger) */}
      <button
        type="button"
        onClick={handleTriggerPixel}
        onDoubleClick={() => setManualLock((prev) => !prev)}
        title="Morphs every 6s automatically — click to trigger Pixel Character now"
        className={`pointer-events-auto absolute top-[21%] left-1/2 -translate-x-1/2 sm:left-[57%] sm:translate-x-0 z-30 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-all duration-300 cursor-pointer backdrop-blur-md ${
          isPixelMode
            ? "scale-100 opacity-100 bg-[#111318]/90 border border-[#455CE9] text-white shadow-[0_0_24px_rgba(69,92,233,0.55)]"
            : "scale-95 opacity-0 sm:opacity-65 hover:opacity-100 bg-[#1C1D20]/65 border border-white/15 text-white/80"
        }`}
      >
        <span
          className={`h-2 w-2 rounded-full ${
            isPixelMode
              ? "bg-[#455CE9] animate-ping"
              : "bg-emerald-400"
          }`}
        />
        <Sparkles className="h-3 w-3 text-[#6E85FF]" />
        <span className="tabular-nums">
          {isPixelMode
            ? "16-BIT MODE // LVL 99 CS ENG"
            : "4K DoF // 6S PIXEL LOOP"}
        </span>
      </button>
    </div>
  );
}
