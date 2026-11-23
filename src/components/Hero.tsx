"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowDownRight,
  Download,
  MessageCircle,
  Play,
  Sparkles,
} from "lucide-react";
import {
  FOCUS_COPY,
  HERO_METRICS,
  PROFILE,
  type FocusMode,
  type ProofTab,
} from "@/data/portfolio";
import { MagneticButton } from "./MagneticButton";
import {
  HeroPointCloud,
  type PointCloudCameraState,
} from "./HeroPointCloud";

interface HeroProps {
  focusMode: FocusMode;
  onJumpToProof: (tab: ProofTab) => void;
}

const IDLE_CYCLE_MS = 6000;
const SPARK_BARS = [28, 52, 40, 82, 64, 96, 74, 88, 100];

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function GlobeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-5 w-5 animate-globe-spin"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9.5" />
      <ellipse cx="12" cy="12" rx="4.2" ry="9.5" />
      <path d="M2.8 9h18.4M2.8 15h18.4M12 2.5v19" />
    </svg>
  );
}

export function Hero({ focusMode, onJumpToProof }: HeroProps) {
  const copy = FOCUS_COPY[focusMode];

  const runwayRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const obsidianBgRef = useRef<HTMLDivElement | null>(null);
  const photoLayerRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);

  const locationPillRef = useRef<HTMLDivElement | null>(null);
  const roleBlockRef = useRef<HTMLDivElement | null>(null);
  const arrowRef = useRef<SVGSVGElement | null>(null);
  const marqueeWrapRef = useRef<HTMLDivElement | null>(null);
  const marqueeTrackRef = useRef<HTMLDivElement | null>(null);

  const beat1Ref = useRef<HTMLDivElement | null>(null);
  const beat2Ref = useRef<HTMLDivElement | null>(null);
  const beat3Ref = useRef<HTMLDivElement | null>(null);
  const pixelToggleRef = useRef<HTMLButtonElement | null>(null);

  const [isPointCloudHud, setIsPointCloudHud] = useState(false);
  const [lockedPointCloud, setLockedPointCloud] = useState(false);
  const lockedRef = useRef(false);
  const cycleOffsetRef = useRef(0);

  useEffect(() => {
    lockedRef.current = lockedPointCloud;
  }, [lockedPointCloud]);

  const cameraRef = useRef<PointCloudCameraState>({
    morph: 0,
    zoom: 1,
    panX: 0,
    panY: 0,
    rotY: 0,
    rotX: 0,
    mouseX: 0,
    mouseY: 0,
    swirlPulse: 0,
  });

  const targetMouseRef = useRef({ x: 0, y: 0 });
  const currentMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let xPercent = 0;
    let direction = -1;
    let lastScrollY = window.scrollY;
    let velocityBoost = 0;
    let smoothP = 0;
    let hudFlag = false;
    let rafId = 0;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY;
      if (Math.abs(delta) > 1) {
        direction = delta > 0 ? -1 : 1;
        velocityBoost = Math.min(Math.abs(delta) * 0.0025, 0.06);
      }
      lastScrollY = currentY;
      if (arrowRef.current) {
        arrowRef.current.style.transform =
          direction === 1 ? "rotate(-45deg)" : "rotate(0deg)";
      }
    };

    const tick = (now: number) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const isMobile = vw < 768;

      // Smooth 2D marquee motion
      const baseSpeed = prefersReduced ? 0 : 0.011;
      xPercent += (baseSpeed + velocityBoost) * direction;
      velocityBoost *= 0.92;
      if (xPercent <= -50) xPercent += 50;
      else if (xPercent > 0) xPercent -= 50;

      if (marqueeTrackRef.current) {
        marqueeTrackRef.current.style.transform = `translate3d(${xPercent}%, 0, 0)`;
      }

      // Compute normalized scroll progress across the 320vh sticky runway [0..1]
      let rawP = 0;
      const runway = runwayRef.current;
      if (runway) {
        const rect = runway.getBoundingClientRect();
        const maxScroll = Math.max(1, rect.height - vh);
        rawP = clamp01(-rect.top / maxScroll);
      }
      smoothP += (rawP - smoothP) * 0.13;
      if (Math.abs(rawP - smoothP) < 0.0004) smoothP = rawP;

      // Pointer inertia for cursor parallax & particle repulsion
      currentMouseRef.current.x +=
        (targetMouseRef.current.x - currentMouseRef.current.x) * 0.09;
      currentMouseRef.current.y +=
        (targetMouseRef.current.y - currentMouseRef.current.y) * 0.09;
      const mx = currentMouseRef.current.x;
      const my = currentMouseRef.current.y;

      // Top 6-second hybrid auto-dissolve cycle (when smoothP < 0.03)
      const idleElapsed = (now + cycleOffsetRef.current) % IDLE_CYCLE_MS;
      let idleDissolve = 0;
      let idleSwirl = 0;

      if (lockedRef.current) {
        idleDissolve = 1;
        idleSwirl = 0.08;
      } else if (!prefersReduced && smoothP < 0.03) {
        if (idleElapsed >= 3700 && idleElapsed < 4300) {
          idleDissolve = smoothstep(3700, 4300, idleElapsed);
          idleSwirl = Math.sin(idleDissolve * Math.PI) * 0.55;
        } else if (idleElapsed >= 4300 && idleElapsed < 5450) {
          idleDissolve = 1;
          idleSwirl = 0.1;
        } else if (idleElapsed >= 5450) {
          idleDissolve = 1 - smoothstep(5450, 6000, idleElapsed);
          idleSwirl = Math.sin(idleDissolve * Math.PI) * 0.55;
        }
      }

      // Scroll morph dominates smoothly as soon as visitor scrolls past 1.5%
      const scrollMorph = smoothstep(0.01, 0.11, smoothP);
      const totalMorph = Math.max(idleDissolve, scrollMorph);

      // Update floating HUD badge state only when boolean flips (no per-frame re-renders)
      const showParticleBadge = totalMorph > 0.45 && smoothP < 0.08;
      if (showParticleBadge !== hudFlag) {
        hudFlag = showParticleBadge;
        setIsPointCloudHud(showParticleBadge);
      }

      // Transition photo visibility -> disappears cleanly on scroll or during idle particle reveal
      const photoOpacity = clamp01(1 - Math.max(idleDissolve * 0.94, scrollMorph));
      if (photoLayerRef.current) {
        photoLayerRef.current.style.opacity = String(photoOpacity);
        const tiltPx = mx * 14 * (1 - scrollMorph);
        const tiltPy = my * 9 * (1 - scrollMorph);
        photoLayerRef.current.style.transform = `translate3d(${tiltPx}px, ${tiltPy}px, 0)`;
      }

      // Obsidian backdrop (#07080B) blends smoothly under point-cloud during dissolve & Beats 1-3
      const obsidianOpacity = clamp01(
        Math.max(idleDissolve * 0.88, smoothstep(0.015, 0.14, smoothP))
      );
      if (obsidianBgRef.current) {
        obsidianBgRef.current.style.opacity = String(obsidianOpacity);
      }

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${mx * -22}px, ${my * -16}px, 0)`;
      }

      // Hero chrome (location pill, role title, bottom marquee) fades out at Beat 1 start
      const heroChromeOpacity = clamp01(1 - smoothstep(0.01, 0.13, smoothP));
      if (locationPillRef.current) {
        locationPillRef.current.style.opacity = String(heroChromeOpacity);
        locationPillRef.current.style.transform = `translate3d(${-smoothstep(0.01, 0.14, smoothP) * 48}px, -50%, 0)`;
        locationPillRef.current.style.pointerEvents =
          heroChromeOpacity > 0.25 ? "auto" : "none";
      }
      if (roleBlockRef.current) {
        roleBlockRef.current.style.opacity = String(heroChromeOpacity);
        roleBlockRef.current.style.transform = `translate3d(0, ${smoothstep(0.01, 0.14, smoothP) * -36}px, 0)`;
        roleBlockRef.current.style.pointerEvents =
          heroChromeOpacity > 0.25 ? "auto" : "none";
      }
      if (marqueeWrapRef.current) {
        marqueeWrapRef.current.style.opacity = String(heroChromeOpacity);
        marqueeWrapRef.current.style.transform = `translate3d(0, ${smoothstep(0.01, 0.14, smoothP) * 44}px, 0)`;
      }
      if (pixelToggleRef.current) {
        pixelToggleRef.current.style.opacity = String(heroChromeOpacity);
        pixelToggleRef.current.style.pointerEvents =
          heroChromeOpacity > 0.25 ? "auto" : "none";
      }

      // Beat 1 rounded cinema frame contraction (0 -> inset 24px / radius 32px -> back to full bleed)
      const frameIn = smoothstep(0.04, 0.19, smoothP);
      const frameOut = smoothstep(0.32, 0.44, smoothP);
      const frameAmount = clamp01(frameIn * (1 - frameOut));
      if (frameRef.current) {
        const insetPx = frameAmount * (isMobile ? 10 : 24);
        const radiusPx = frameAmount * (isMobile ? 22 : 34);
        frameRef.current.style.top = `${insetPx}px`;
        frameRef.current.style.bottom = `${insetPx}px`;
        frameRef.current.style.left = `${insetPx}px`;
        frameRef.current.style.right = `${insetPx}px`;
        frameRef.current.style.borderRadius = `${radiusPx}px`;
      }

      // Keyframed 3D Camera Path across Hero -> Beat 1 -> Beat 2 -> Beat 3:
      const b2T = smoothstep(0.32, 0.50, smoothP); // enter macro left pan
      const b3T = smoothstep(0.66, 0.86, smoothP); // glide macro right pan
      const b1T = frameAmount;

      const panScale = isMobile ? 0.24 : 1.0;
      const targetZoomB2 = isMobile ? 1.85 : 2.55;
      const targetZoomB3 = isMobile ? 1.78 : 2.45;

      const camZoom =
        lerp(1.0, 0.90, b1T * (1 - b2T)) * (1 - b2T) +
        lerp(targetZoomB2, targetZoomB3, b3T) * b2T;

      const camPanX =
        b2T < 0.001
          ? 0
          : lerp(-0.42 * panScale, 0.46 * panScale, b3T) * b2T;
      const camPanY = lerp(0, isMobile ? -0.10 : -0.22, b2T);

      const camRotY =
        Math.sin(now * 0.0007) * 0.045 +
        lerp(0, 0.24, b2T * (1 - b3T)) +
        lerp(0, -0.24, b3T) +
        mx * 0.09;
      const camRotX = -my * 0.055;

      const transitionPulse =
        Math.sin(smoothstep(0.33, 0.48, smoothP) * Math.PI) * 0.22 +
        Math.sin(smoothstep(0.67, 0.84, smoothP) * Math.PI) * 0.35;

      cameraRef.current.morph = totalMorph;
      cameraRef.current.zoom = camZoom;
      cameraRef.current.panX = camPanX;
      cameraRef.current.panY = camPanY;
      cameraRef.current.rotY = camRotY;
      cameraRef.current.rotX = camRotX;
      cameraRef.current.mouseX = mx;
      cameraRef.current.mouseY = -my;
      cameraRef.current.swirlPulse = Math.max(idleSwirl, transitionPulse);

      // BEAT 1 overlay opacity & transform (centered orbiting proof pills)
      const beat1Opacity = clamp01(
        smoothstep(0.08, 0.18, smoothP) * (1 - smoothstep(0.29, 0.38, smoothP))
      );
      if (beat1Ref.current) {
        beat1Ref.current.style.opacity = String(beat1Opacity);
        const sc = lerp(0.95, 1.0, beat1Opacity);
        beat1Ref.current.style.transform = `scale(${sc})`;
        beat1Ref.current.style.pointerEvents =
          beat1Opacity > 0.35 ? "auto" : "none";
      }

      // BEAT 2 overlay opacity & transform (right-hand statement + CV glass card)
      const beat2In = smoothstep(0.38, 0.49, smoothP);
      const beat2Out = smoothstep(0.63, 0.72, smoothP);
      const beat2Opacity = clamp01(beat2In * (1 - beat2Out));
      if (beat2Ref.current) {
        beat2Ref.current.style.opacity = String(beat2Opacity);
        const dy = (1 - beat2In) * 38 - beat2Out * 34;
        beat2Ref.current.style.transform = `translate3d(0, ${dy}px, 0)`;
        beat2Ref.current.style.pointerEvents =
          beat2Opacity > 0.35 ? "auto" : "none";
      }

      // BEAT 3 overlay opacity & transform (left-hand telemetry spark-bars + CTA)
      const beat3In = smoothstep(0.71, 0.83, smoothP);
      const beat3Opacity = clamp01(beat3In);
      if (beat3Ref.current) {
        beat3Ref.current.style.opacity = String(beat3Opacity);
        const dy = (1 - beat3In) * 42;
        beat3Ref.current.style.transform = `translate3d(0, ${dy}px, 0)`;
        beat3Ref.current.style.pointerEvents =
          beat3Opacity > 0.35 ? "auto" : "none";
      }

      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    rafId = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    targetMouseRef.current = {
      x: (e.clientX / window.innerWidth - 0.5) * 2,
      y: (e.clientY / window.innerHeight - 0.5) * 2,
    };
  };

  const handleMouseLeave = () => {
    targetMouseRef.current = { x: 0, y: 0 };
  };

  const handleTriggerPointCloud = () => {
    if (lockedPointCloud) {
      setLockedPointCloud(false);
      cycleOffsetRef.current = 0;
    } else {
      // Shift cycle directly into the 3D Point-Cloud dissolve peak (4350ms)
      const now = performance.now();
      cycleOffsetRef.current = 4350 - (now % IDLE_CYCLE_MS) + IDLE_CYCLE_MS;
    }
  };

  return (
    <section
      ref={runwayRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative h-[320vh] min-h-[2400px] w-full bg-[var(--color-hero-bg)] select-none"
    >
      {/* Semantic #about anchor positioned right at Beat 2 */}
      <div
        id="about"
        className="pointer-events-none absolute top-[148vh] h-px w-px"
        aria-hidden="true"
      />

      {/* Sticky 100vh Stage Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-[var(--color-hero-bg)]">
        {/* Contracting / Expanding Frame Shell (Kin OS Beat 1 Rounded Obsidian Card) */}
        <div
          ref={frameRef}
          className="absolute inset-0 overflow-hidden bg-[var(--color-hero-bg)] shadow-[0_30px_90px_rgba(0,0,0,0.45)] will-change-[top,left,right,bottom,border-radius]"
        >
          {/* Deep Obsidian Void Layer for Point-Cloud & Macro Scroll Beats */}
          <div
            ref={obsidianBgRef}
            style={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 bg-[#07080B]"
            aria-hidden="true"
          />

          {/* Subtle Radial Optical Glow behind Subject */}
          <div
            ref={glowRef}
            className="pointer-events-none absolute inset-0 will-change-transform"
            style={{
              background:
                "radial-gradient(circle at 48% 45%, var(--color-hero-glow) 0%, transparent 58%)",
            }}
            aria-hidden="true"
          />

          {/* 4K Optical Depth-of-Field Portrait Layer (Dissolves smoothly into Point Cloud) */}
          <div
            ref={photoLayerRef}
            className="pointer-events-none absolute inset-0 flex items-end justify-center will-change-transform"
          >
            <div
              className="relative h-full w-full max-w-[920px] flex items-end justify-center overflow-hidden"
              style={{
                WebkitMaskImage:
                  "radial-gradient(ellipse 64% 92% at 50% 58%, black 42%, rgba(0,0,0,0.58) 70%, transparent 98%)",
                maskImage:
                  "radial-gradient(ellipse 64% 92% at 50% 58%, black 42%, rgba(0,0,0,0.58) 70%, transparent 98%)",
              }}
            >
              <img
                src="/hero-portrait-4k.jpg"
                alt="Birky Andrie L. Pacuribot — 4K Depth of Field Studio Portrait"
                className="h-full w-full object-cover object-center transition-[filter] duration-500 ease-dennis"
                style={{ filter: "var(--hero-portrait-filter)" }}
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: "var(--hero-portrait-vignette)" }}
              />
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-40"
                style={{ background: "var(--hero-top-fade)" }}
              />
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-48"
                style={{ background: "var(--hero-bottom-fade)" }}
              />
            </div>
          </div>

          {/* LIVE WEBGL 3D KIN OS VOLUMETRIC POINT-CLOUD CANVAS */}
          <HeroPointCloud cameraRef={cameraRef} />

          {/* Floating Interactive 6s Dissolve Status / Manual Trigger Pill */}
          <button
            ref={pixelToggleRef}
            type="button"
            onClick={handleTriggerPointCloud}
            onDoubleClick={() => setLockedPointCloud((prev) => !prev)}
            title="Dissolves into 3D point-cloud every 6s or as you scroll — click to morph now, double-click to lock"
            className={`absolute top-[20%] left-1/2 -translate-x-1/2 sm:left-[56%] sm:translate-x-0 z-30 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-all duration-300 cursor-pointer backdrop-blur-md ${
              isPointCloudHud || lockedPointCloud
                ? "bg-[#07080B]/90 border border-[#455CE9] text-white shadow-[0_0_24px_rgba(69,92,233,0.55)]"
                : "bg-[#1C1D20]/65 border border-white/15 text-white/85 hover:bg-[#1C1D20]/90"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isPointCloudHud || lockedPointCloud
                  ? "bg-[#455CE9] animate-ping"
                  : "bg-emerald-400"
              }`}
            />
            <Sparkles className="h-3 w-3 text-[#6E85FF]" />
            <span className="tabular-nums">
              {lockedPointCloud
                ? "3D POINT-CLOUD // LOCKED"
                : isPointCloudHud
                  ? "3D POINT-CLOUD // LVL 99 CS ENG"
                  : "4K DoF // 6S POINT-CLOUD"}
            </span>
          </button>

          {/* Left-Docked Location Badge */}
          <div
            ref={locationPillRef}
            className="hidden md:flex absolute left-0 top-[44%] z-20 items-center gap-5 bg-[var(--color-hero-pill)] text-white pl-7 pr-3.5 py-3.5 rounded-r-full shadow-lg border-r border-y border-white/10 will-change-transform"
          >
            <div className="text-sm leading-[1.25] font-normal tracking-tight">
              <div>Located</div>
              <div>in the</div>
              <div>Philippines</div>
            </div>
            <div className="h-13 w-13 rounded-full bg-[#999D9E] text-[#1C1D20] flex items-center justify-center">
              <GlobeIcon />
            </div>
          </div>

          {/* Right-Side Role Title + Quick-Launch Pills */}
          <div
            ref={roleBlockRef}
            className="absolute right-6 sm:right-10 lg:right-14 top-[22%] sm:top-[30%] z-20 max-w-[250px] sm:max-w-[300px] lg:max-w-[330px] text-left will-change-transform"
          >
            <ArrowDownRight
              ref={arrowRef}
              className="h-7 w-7 sm:h-8 sm:w-8 mb-4 sm:mb-5 text-white stroke-[1.75] transition-transform duration-500 ease-out-expo"
              aria-hidden="true"
            />
            <h1 className="text-2xl sm:text-3xl lg:text-[2.15rem] font-normal leading-[1.16] tracking-[-0.02em] text-white drop-shadow-xs">
              <span className="block">{copy.heroRoleLines[0]}</span>
              <span className="block">{copy.heroRoleLines[1]}</span>
              <span className="block">{copy.heroRoleLines[2]}</span>
            </h1>

            <div className="mt-5 flex flex-wrap gap-2">
              <MagneticButton
                onClick={() => onJumpToProof("hackerlily")}
                strength={0.22}
                textStrength={0.1}
                className="rounded-full bg-[#1C1D20]/85 border border-white/20 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-white"
              >
                <span className="inline-flex items-center gap-1.5">
                  <Play className="h-3 w-3 fill-current" />
                  <span>6 Ad Reels</span>
                </span>
              </MagneticButton>

              <MagneticButton
                onClick={() => onJumpToProof("husai")}
                strength={0.22}
                textStrength={0.1}
                className="rounded-full bg-[#1C1D20]/85 border border-white/20 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-white"
              >
                <span className="inline-flex items-center gap-1.5">
                  <Play className="h-3 w-3 fill-current" />
                  <span>HusAI</span>
                </span>
              </MagneticButton>
            </div>
          </div>

          {/* Giant Bottom-Bleeding Slow-Pace Infinite Marquee */}
          <div
            ref={marqueeWrapRef}
            className="pointer-events-none absolute bottom-4 sm:bottom-6 inset-x-0 z-20 overflow-hidden will-change-transform"
          >
            <div
              ref={marqueeTrackRef}
              className="flex w-max will-change-transform"
            >
              <span className="font-[family-name:var(--font-display)] text-[8.5vw] sm:text-[6.8vw] lg:text-[5.8vw] font-medium uppercase leading-none tracking-[-0.025em] text-white pr-14 whitespace-nowrap drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
                Full Stack CS Engineer &mdash; Tech VA &middot; Operations &middot; SMM Strategist &mdash;
              </span>
              <span className="font-[family-name:var(--font-display)] text-[8.5vw] sm:text-[6.8vw] lg:text-[5.8vw] font-medium uppercase leading-none tracking-[-0.025em] text-white pr-14 whitespace-nowrap drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
                Full Stack CS Engineer &mdash; Tech VA &middot; Operations &middot; SMM Strategist &mdash;
              </span>
            </div>
          </div>

          {/* ================================================================
              BEAT 1 OVERLAY: Rounded Obsidian Stage + Floating Orbiting Pills
             ================================================================ */}
          <div
            ref={beat1Ref}
            style={{ opacity: 0, pointerEvents: "none" }}
            className="absolute inset-0 z-20 flex flex-col justify-between p-6 sm:p-12 text-white will-change-transform"
          >
            <div className="mx-auto mt-10 sm:mt-8 text-center max-w-xl space-y-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[#8FA2FF] backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-[#455CE9]" />
                BIRKY OS // VOLUMETRIC STACK
              </span>
              <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-4xl font-medium tracking-[-0.025em] text-white">
                Creative, VA Ops &amp; CS Systems in one unit.
              </h2>
            </div>

            {/* Orbiting Glass Pills around Centered Point-Cloud Bust */}
            <div className="hidden sm:block pointer-events-none">
              <div className="absolute left-8 lg:left-14 top-[36%] rounded-2xl border border-white/12 bg-[#0E1016]/75 px-4 py-3 backdrop-blur-md shadow-xl">
                <div className="font-mono text-[10px] uppercase tracking-widest text-[#8FA2FF]">
                  CREATIVE // HACKERLILY DE
                </div>
                <div className="mt-1 font-mono text-sm font-semibold text-white tabular-nums">
                  45+ Paid 9:16 Cuts
                </div>
              </div>

              <div className="absolute left-8 lg:left-14 bottom-[16%] rounded-2xl border border-white/12 bg-[#0E1016]/75 px-4 py-3 backdrop-blur-md shadow-xl">
                <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-400">
                  OPS // ALPHA VA CERTIFIED
                </div>
                <div className="mt-1 font-mono text-sm font-semibold text-white">
                  UTC+8 Global Overlap
                </div>
              </div>

              <div className="absolute right-8 lg:right-14 top-[36%] rounded-2xl border border-white/12 bg-[#0E1016]/75 px-4 py-3 backdrop-blur-md shadow-xl text-right">
                <div className="font-mono text-[10px] uppercase tracking-widest text-[#8FA2FF]">
                  AI // STARTUP LAB
                </div>
                <div className="mt-1 font-mono text-sm font-semibold text-white tabular-nums">
                  4.0s VAD · HusAI
                </div>
              </div>

              <div className="absolute right-8 lg:right-14 bottom-[16%] rounded-2xl border border-white/12 bg-[#0E1016]/75 px-4 py-3 backdrop-blur-md shadow-xl text-right">
                <div className="font-mono text-[10px] uppercase tracking-widest text-[#8FA2FF]">
                  AUTOMATION // PACS
                </div>
                <div className="mt-1 font-mono text-sm font-semibold text-white tabular-nums">
                  &lt; 5s Audit Engine
                </div>
              </div>
            </div>

            <div className="mx-auto mb-2 rounded-full border border-white/10 bg-[#07080B]/75 px-3.5 py-1 backdrop-blur-md font-mono text-[10px] uppercase tracking-[0.22em] text-white/65">
              KEEP SCROLLING TO ZOOM &darr;
            </div>
          </div>

          {/* ================================================================
              BEAT 2 OVERLAY: 2.55x Macro Left-Panned + Statement Card on RIGHT
             ================================================================ */}
          <div
            ref={beat2Ref}
            style={{ opacity: 0, pointerEvents: "none" }}
            className="absolute inset-0 z-20 flex items-center justify-end px-5 sm:px-10 lg:px-16 will-change-transform"
          >
            <div className="w-full md:w-[52%] lg:w-[46%] rounded-[28px] border border-white/12 bg-[#090B11]/88 backdrop-blur-xl p-6 sm:p-9 space-y-6 shadow-[0_24px_80px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.12)]">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#7D92FF]">
                  {copy.badge}
                </span>
                <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-emerald-300">
                  UTC+8 READY
                </span>
              </div>

              <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-4xl font-normal leading-[1.2] tracking-[-0.025em] text-white">
                {copy.headline}
              </h2>

              <p className="text-sm sm:text-base leading-relaxed text-white/70">
                {copy.subheadline}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
                <a
                  href="/Birky_Andrie_Pacuribot_CV.pdf"
                  download
                  className="inline-flex items-center gap-1.5 rounded-full bg-white text-[#1C1D20] hover:bg-[#455CE9] hover:text-white px-4 py-2 font-mono text-[11px] uppercase tracking-wider font-medium transition-colors"
                >
                  <Download className="h-3 w-3" />
                  <span>CV (PDF)</span>
                </a>
                <a
                  href="/Birky_Andrie_Pacuribot_Harvard_CV.docx"
                  download
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 hover:bg-white hover:text-[#1C1D20] px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-white transition-colors"
                >
                  <Download className="h-3 w-3" />
                  <span>Harvard .docx</span>
                </a>
                <a
                  href={PROFILE.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#455CE9] hover:bg-[#334BD3] px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-white transition-colors"
                >
                  <MessageCircle className="h-3 w-3" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* ================================================================
              BEAT 3 OVERLAY: 2.45x Macro Right-Panned + Telemetry Spark Cards on LEFT
             ================================================================ */}
          <div
            ref={beat3Ref}
            style={{ opacity: 0, pointerEvents: "none" }}
            className="absolute inset-0 z-20 flex items-center justify-start px-5 sm:px-10 lg:px-16 will-change-transform"
          >
            <div className="w-full md:w-[52%] lg:w-[46%] space-y-4">
              {/* Telemetry Spark-Bar Card (Kin OS Inspired) */}
              <div className="rounded-[26px] border border-white/12 bg-[#090B11]/88 backdrop-blur-xl p-6 sm:p-7 shadow-[0_24px_80px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.12)] space-y-5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/60">
                    VERIFIED TELEMETRY
                  </span>
                  <span className="font-mono text-xs tabular-nums text-[#8FA2FF]">
                    AU · EU · UK · US
                  </span>
                </div>

                <div className="flex items-end gap-2 h-14">
                  {SPARK_BARS.map((barH, idx) => (
                    <div
                      key={idx}
                      style={{ height: `${barH}%` }}
                      className="flex-1 rounded-t-md bg-gradient-to-t from-[#455CE9]/55 to-[#889EFF]"
                    />
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-4 pt-3 border-t border-white/10">
                  {HERO_METRICS.map((m) => (
                    <div key={m.label}>
                      <div className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-semibold tabular-nums tracking-tight text-white">
                        {m.value}
                      </div>
                      <div className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-white/60">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shift Readiness & Primary CTA Card */}
              <div className="rounded-[26px] border border-white/12 bg-[#090B11]/88 backdrop-blur-xl p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4 shadow-[0_24px_80px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.12)]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-mono text-xs text-emerald-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>IMMEDIATE REMOTE AVAILABILITY</span>
                  </div>
                  <div className="font-mono text-[11px] text-white/60">
                    Alpha VA Certified &middot; 1.00 Startup Lab Project Lead
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <MagneticButton
                    onClick={() => onJumpToProof("hackerlily")}
                    fillColor="#334BD3"
                    className="rounded-full bg-[#455CE9] px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-white"
                  >
                    <span>Explore Proof Stage</span>
                  </MagneticButton>
                  <a
                    href="#work"
                    className="rounded-full border border-white/20 bg-white/5 hover:bg-white hover:text-[#1C1D20] px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-white transition-colors"
                  >
                    Work &darr;
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
