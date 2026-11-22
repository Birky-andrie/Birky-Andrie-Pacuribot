"use client";

import { useEffect, useRef, useState } from "react";

export type ThemeMode = "light" | "dark";

interface ThemeToggleProps {
  theme: ThemeMode;
  onToggle: () => void;
  size?: "sm" | "md";
}

interface PixelPoint {
  x: number;
  y: number;
  alpha: number;
}

interface Particle {
  sx: number;
  sy: number;
  sAlpha: number;
  tx: number;
  ty: number;
  tAlpha: number;
  jx: number;
  jy: number;
  phase: number;
}

// 13x13 Pixel-art Moon (crescent + subtle dithered shadow + 4px cross star + tiny stars)
const MOON_MAP = [
  ".............",
  ".........o...",
  "........ooo..",
  "...##....o...",
  "..####.......",
  ".####.o...o..",
  ".####..o.....",
  ".####.o.o....",
  ".#####.o.....",
  "..######o....",
  "...#####.....",
  ".............",
  ".............",
];

// 13x13 Pixel-art Sun (dense central core + 4 cardinal + 4 diagonal pixel rays)
const SUN_MAP = [
  ".............",
  "......#......",
  "..#...#...#..",
  "...#.....#...",
  ".....###.....",
  "....#####....",
  ".##.#####.##.",
  "....#####....",
  ".....###.....",
  "...#.....#...",
  "..#...#...#..",
  "......#......",
  ".............",
];

function parsePixelMap(map: string[]): PixelPoint[] {
  const pts: PixelPoint[] = [];
  for (let y = 0; y < map.length; y++) {
    const row = map[y];
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch === "#") {
        pts.push({ x, y, alpha: 1 });
      } else if (ch === "o") {
        pts.push({ x, y, alpha: 0.42 });
      }
    }
  }
  return pts;
}

const MOON_PIXELS = parsePixelMap(MOON_MAP);
const SUN_PIXELS = parsePixelMap(SUN_MAP);

function buildParticles(): Particle[] {
  const count = Math.max(MOON_PIXELS.length, SUN_PIXELS.length);
  const particles: Particle[] = [];

  // Deterministic pseudo-random scatter so transitions look organic and crisp
  const seeded = (i: number, salt: number) => {
    const v = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
    return v - Math.floor(v);
  };

  for (let i = 0; i < count; i++) {
    const m = MOON_PIXELS[i % MOON_PIXELS.length];
    const s = SUN_PIXELS[i % SUN_PIXELS.length];
    const angle = seeded(i, 1) * Math.PI * 2;
    const radius = 1.6 + seeded(i, 2) * 3.8;
    particles.push({
      sx: m.x,
      sy: m.y,
      sAlpha: i < MOON_PIXELS.length ? m.alpha : 0,
      tx: s.x,
      ty: s.y,
      tAlpha: i < SUN_PIXELS.length ? s.alpha : 0,
      jx: Math.cos(angle) * radius,
      jy: Math.sin(angle) * radius,
      phase: seeded(i, 3),
    });
  }
  return particles;
}

const PARTICLES = buildParticles();

function easeInOutQuart(t: number): number {
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
}

export function ThemeToggle({
  theme,
  onToggle,
  size = "sm",
}: ThemeToggleProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // progress: 0 = dark (moon on left), 1 = light (sun on right)
  const progressRef = useRef<number>(theme === "light" ? 1 : 0);
  const [rimAngle, setRimAngle] = useState<number>(theme === "light" ? 42 : 212);
  const [midFlash, setMidFlash] = useState<number>(0);

  const isLight = theme === "light";
  const dims =
    size === "md"
      ? { trackW: 88, trackH: 46, thumb: 38, pad: 4, travel: 42, radius: 13, thumbRadius: 10 }
      : { trackW: 66, trackH: 34, thumb: 28, pad: 3, travel: 32, radius: 10, thumbRadius: 8 };

  useEffect(() => {
    const target = theme === "light" ? 1 : 0;
    const startVal = progressRef.current;
    const duration = 560;
    const startTime = performance.now();
    let rafId: number;

    const drawCanvas = (p: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssSize = dims.thumb;
      if (canvas.width !== cssSize * dpr || canvas.height !== cssSize * dpr) {
        canvas.width = cssSize * dpr;
        canvas.height = cssSize * dpr;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssSize, cssSize);

      const grid = 13;
      const padding = cssSize * 0.16;
      const cell = (cssSize - padding * 2) / grid;
      const pxSize = Math.max(1.15, cell * 0.86);

      // Scatter envelope peaks at p = 0.5 (dissolve -> scatter cloud -> reform)
      const scatter = Math.sin(p * Math.PI);
      const scatterCurve = Math.pow(scatter, 0.85);

      // Particle color smoothly interpolates from bright white (#FFFFFF in dark) to charcoal (#1C1D20 in light)
      const shade = Math.round(255 - p * 227);
      const r = shade;
      const g = shade;
      const b = Math.min(255, shade + Math.round((1 - p) * 12));

      for (let i = 0; i < PARTICLES.length; i++) {
        const pt = PARTICLES[i];
        const baseX = pt.sx + (pt.tx - pt.sx) * p;
        const baseY = pt.sy + (pt.ty - pt.sy) * p;

        // Individual pixel burst & slight swirl mid-flight
        const swirl = scatterCurve * (0.75 + pt.phase * 0.55);
        const cx = padding + (baseX + pt.jx * swirl) * cell;
        const cy = padding + (baseY + pt.jy * swirl) * cell;

        const alpha =
          pt.sAlpha * (1 - p) + pt.tAlpha * p + scatterCurve * 0.25;
        if (alpha <= 0.03) continue;

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.min(1, alpha)})`;
        ctx.fillRect(
          Math.round(cx * 2) / 2,
          Math.round(cy * 2) / 2,
          pxSize,
          pxSize
        );
      }
    };

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const raw = Math.min(1, elapsed / duration);
      const eased = easeInOutQuart(raw);
      const current = startVal + (target - startVal) * eased;
      progressRef.current = current;

      // Traveling rim light sweeps around the top arc: 212deg (bottom-left blue) -> 360/0deg (top flash) -> 42deg (top-right amber)
      const angle = 212 + current * 190;
      setRimAngle(angle % 360);
      setMidFlash(Math.sin(current * Math.PI));

      drawCanvas(current);

      if (raw < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    if (Math.abs(target - startVal) < 0.001) {
      drawCanvas(target);
      setRimAngle(target === 1 ? 42 : 212);
      setMidFlash(0);
    } else {
      rafId = requestAnimationFrame(tick);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [theme, dims.thumb]);

  // Dynamic ambient rim colors: Dark (periwinkle/ice blue) <-> Mid (bright white flash) <-> Light (warm golden amber)
  const rimGlowColor = isLight
    ? "rgba(255, 174, 52, 0.95)"
    : "rgba(130, 160, 255, 0.95)";
  const rimHaloShadow = isLight
    ? `3px -3px ${14 + midFlash * 6}px rgba(255, 162, 36, ${0.5 + midFlash * 0.25}), 0 2px 6px rgba(0,0,0,0.12)`
    : `-2px 3px ${14 + midFlash * 6}px rgba(105, 138, 255, ${0.55 + midFlash * 0.25}), 0 2px 8px rgba(0,0,0,0.65)`;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isLight}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
      onClick={onToggle}
      style={{
        width: `${dims.trackW}px`,
        height: `${dims.trackH}px`,
        borderRadius: `${dims.radius}px`,
        background: isLight
          ? "linear-gradient(145deg, #D5D7DC 0%, #ECEEF1 100%)"
          : "linear-gradient(145deg, #090B0E 0%, #171A21 100%)",
        boxShadow: isLight
          ? "inset 0 2px 5px rgba(0,0,0,0.16), inset 0 -1px 2px rgba(255,255,255,0.85), 0 1px 2px rgba(0,0,0,0.08)"
          : "inset 0 2px 6px rgba(0,0,0,0.9), inset 0 -1px 2px rgba(255,255,255,0.08), 0 1px 4px rgba(0,0,0,0.45)",
      }}
      className="relative inline-flex items-center shrink-0 transition-[background,box-shadow] duration-500 ease-dennis cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#455CE9]"
    >
      {/* 3D Frosted-Glass Squircle Thumb with Sweeping Perimeter Rim Light */}
      <span
        style={{
          width: `${dims.thumb}px`,
          height: `${dims.thumb}px`,
          borderRadius: `${dims.thumbRadius}px`,
          transform: `translate3d(${isLight ? dims.pad + dims.travel : dims.pad}px, 0, 0)`,
          boxShadow: rimHaloShadow,
        }}
        className="relative flex items-center justify-center transition-[transform,box-shadow] duration-[560ms] ease-dennis will-change-transform"
      >
        {/* Sweeping Conic Perimeter Rim Light Border */}
        <span
          aria-hidden="true"
          style={{
            borderRadius: `${dims.thumbRadius}px`,
            background: `conic-gradient(from ${rimAngle}deg, transparent 0deg, ${rimGlowColor} 42deg, rgba(255,255,255,0.98) 68deg, ${rimGlowColor} 96deg, transparent 155deg, transparent 360deg)`,
          }}
          className="pointer-events-none absolute -inset-[1.25px]"
        />

        {/* Frosted-Glass Inner Squircle Surface */}
        <span
          style={{
            borderRadius: `${Math.max(5, dims.thumbRadius - 1)}px`,
            background: isLight
              ? "linear-gradient(135deg, #FFFFFF 0%, #E7E8EC 100%)"
              : "linear-gradient(135deg, #272B36 0%, #151820 100%)",
            boxShadow: isLight
              ? "inset 0 1px 2px rgba(255,255,255,0.95), inset 0 -1px 3px rgba(0,0,0,0.08)"
              : "inset 0 1px 2px rgba(255,255,255,0.16), inset 0 -2px 4px rgba(0,0,0,0.65)",
          }}
          className="relative z-10 flex h-full w-full items-center justify-center overflow-hidden"
        >
          {/* Real-Time Pixel-Particle Moon <-> Sun Morph Canvas */}
          <canvas
            ref={canvasRef}
            style={{ width: `${dims.thumb}px`, height: `${dims.thumb}px` }}
            className="block"
          />
        </span>
      </span>
    </button>
  );
}
