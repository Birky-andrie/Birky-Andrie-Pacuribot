"use client";

import { useEffect, useRef } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Download,
  MessageCircle,
  Play,
} from "lucide-react";
import {
  FOCUS_COPY,
  PROFILE,
  type FocusMode,
  type ProofTab,
} from "@/data/portfolio";
import { MagneticButton } from "./MagneticButton";
import {
  HeroPointCloud,
  type PointCloudCameraState,
} from "./HeroPointCloud";
import type { ThemeMode } from "./ThemeToggle";

interface HeroProps {
  theme: ThemeMode;
  focusMode: FocusMode;
  onJumpToProof: (tab: ProofTab) => void;
}

const IDLE_CYCLE_MS = 6000;

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

export function Hero({ theme, focusMode, onJumpToProof }: HeroProps) {
  const copy = FOCUS_COPY[focusMode];
  const isLight = theme === "light";

  const runwayRef = useRef<HTMLElement | null>(null);
  const photoLayerRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);

  const locationPillRef = useRef<HTMLDivElement | null>(null);
  const roleBlockRef = useRef<HTMLDivElement | null>(null);
  const arrowRef = useRef<SVGSVGElement | null>(null);
  const marqueeWrapRef = useRef<HTMLDivElement | null>(null);
  const marqueeTrackRef = useRef<HTMLDivElement | null>(null);

  const postcard1Ref = useRef<HTMLDivElement | null>(null);
  const postcard2Ref = useRef<HTMLDivElement | null>(null);
  const postcard3Ref = useRef<HTMLDivElement | null>(null);

  const targetThemeRef = useRef(theme === "dark" ? 1 : 0);
  useEffect(() => {
    targetThemeRef.current = theme === "dark" ? 1 : 0;
  }, [theme]);

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
    themeMix: theme === "dark" ? 1 : 0,
    dofStrength: 0,
    focusDepth: 0.13,
    exitFade: 1,
  });

  const targetMouseRef = useRef({ x: 0, y: 0 });
  const currentMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let xPercent = 0;
    let direction = -1;
    let lastScrollY = window.scrollY;
    let velocityBoost = 0;
    let smoothP = 0;
    let smoothThemeMix = targetThemeRef.current;
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

      // Compute normalized scroll progress across unbroken 300vh sticky runway [0..1]
      let rawP = 0;
      const runway = runwayRef.current;
      if (runway) {
        const rect = runway.getBoundingClientRect();
        const maxScroll = Math.max(1, rect.height - vh);
        rawP = clamp01(-rect.top / maxScroll);
      }
      smoothP += (rawP - smoothP) * 0.12;
      if (Math.abs(rawP - smoothP) < 0.0004) smoothP = rawP;

      // Smoothly crossfade Light Yellow <-> Dark Neon point-cloud colors
      smoothThemeMix += (targetThemeRef.current - smoothThemeMix) * 0.09;

      // Pointer inertia for cursor parallax & particle repulsion
      currentMouseRef.current.x +=
        (targetMouseRef.current.x - currentMouseRef.current.x) * 0.09;
      currentMouseRef.current.y +=
        (targetMouseRef.current.y - currentMouseRef.current.y) * 0.09;
      const mx = currentMouseRef.current.x;
      const my = currentMouseRef.current.y;

      // Top 6-second hybrid auto-dissolve cycle (when near scroll top)
      const idleElapsed = now % IDLE_CYCLE_MS;
      let idleDissolve = 0;
      let idleSwirl = 0;

      if (!prefersReduced && smoothP < 0.025) {
        if (idleElapsed >= 3800 && idleElapsed < 4350) {
          idleDissolve = smoothstep(3800, 4350, idleElapsed);
          idleSwirl = Math.sin(idleDissolve * Math.PI) * 0.48;
        } else if (idleElapsed >= 4350 && idleElapsed < 5450) {
          idleDissolve = 1;
          idleSwirl = 0.08;
        } else if (idleElapsed >= 5450) {
          idleDissolve = 1 - smoothstep(5450, 6000, idleElapsed);
          idleSwirl = Math.sin(idleDissolve * Math.PI) * 0.48;
        }
      }

      // Scroll morph dominates smoothly as soon as visitor scrolls down
      const scrollMorph = smoothstep(0.01, 0.12, smoothP);
      const totalMorph = Math.max(idleDissolve, scrollMorph);

      // Transparent 4K Studio Cutout fades smoothly into the 3D point-cloud
      const photoOpacity = clamp01(1 - Math.max(idleDissolve * 0.94, scrollMorph));
      if (photoLayerRef.current) {
        photoLayerRef.current.style.opacity = String(photoOpacity);
        const tiltPx = mx * 14 * (1 - scrollMorph);
        const tiltPy = my * 9 * (1 - scrollMorph);
        photoLayerRef.current.style.transform = `translate3d(${tiltPx}px, ${tiltPy}px, 0)`;
      }

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${mx * -22}px, ${my * -16}px, 0)`;
        glowRef.current.style.opacity = String(clamp01(1 - smoothstep(0.84, 0.96, smoothP)));
      }

      // Top Hero chrome (location pill, role block, bottom marquee) glides out as zoom begins
      const heroChromeOpacity = clamp01(1 - smoothstep(0.01, 0.13, smoothP));
      if (locationPillRef.current) {
        locationPillRef.current.style.opacity = String(heroChromeOpacity);
        locationPillRef.current.style.transform = `translate3d(${-smoothstep(0.01, 0.13, smoothP) * 44}px, -50%, 0)`;
        locationPillRef.current.style.pointerEvents =
          heroChromeOpacity > 0.25 ? "auto" : "none";
      }
      if (roleBlockRef.current) {
        roleBlockRef.current.style.opacity = String(heroChromeOpacity);
        roleBlockRef.current.style.transform = `translate3d(0, ${smoothstep(0.01, 0.13, smoothP) * -32}px, 0)`;
        roleBlockRef.current.style.pointerEvents =
          heroChromeOpacity > 0.25 ? "auto" : "none";
      }
      if (marqueeWrapRef.current) {
        marqueeWrapRef.current.style.opacity = String(heroChromeOpacity);
        marqueeWrapRef.current.style.transform = `translate3d(0, ${smoothstep(0.01, 0.13, smoothP) * 40}px, 0)`;
      }

      // Unbroken Seamless Face-Zoom & Left-Right Pan Choreography (3 Postcard Beats)
      const p1 = smoothstep(0.04, 0.25, smoothP); // zoom 1 -> 2.15, pan Left (-0.36) for Postcard 1 Right
      const p2 = smoothstep(0.36, 0.56, smoothP); // zoom 2.15 -> 2.65, glide Right (+0.38) for Postcard 2 Left
      const p3 = smoothstep(0.66, 0.84, smoothP); // zoom 2.65 -> 2.38, glide Left (-0.34) for Postcard 3 Right

      const panScale = isMobile ? 0.22 : 1.0;

      const camZoom =
        lerp(1.0, isMobile ? 1.65 : 2.15, p1) * (1 - p2) +
        (lerp(isMobile ? 1.65 : 2.15, isMobile ? 1.92 : 2.65, p2) * (1 - p3) +
          lerp(isMobile ? 1.92 : 2.65, isMobile ? 1.80 : 2.38, p3) * p3) *
          p2;

      const camPanX =
        p1 < 0.001
          ? 0
          : lerp(0, -0.36 * panScale, p1) * (1 - p2) +
            lerp(-0.36 * panScale, 0.38 * panScale, p2) * (1 - p3) +
            lerp(0.38 * panScale, -0.34 * panScale, p3) * p3;

      const camPanY = lerp(0, isMobile ? -0.11 : -0.21, smoothstep(0.06, 0.38, smoothP));

      const camRotY =
        Math.sin(now * 0.0007) * 0.045 +
        lerp(0, 0.20, p1) * (1 - p2) +
        lerp(0.20, -0.22, p2) * (1 - p3) +
        lerp(-0.22, 0.18, p3) * p3 +
        mx * 0.09;
      const camRotX = -my * 0.055;

      // Optical Depth-of-Field bokeh strength intensifies smoothly as macro face zoom deepens
      const dofStrength = clamp01(smoothstep(0.14, 0.52, smoothP) * 0.96);

      // Smooth exit scatter/fade into Recent Work before unsticking (zero ghostly overlap)
      const exitFade = clamp01(1 - smoothstep(0.83, 0.95, smoothP));

      const transitionPulse =
        Math.sin(smoothstep(0.34, 0.56, smoothP) * Math.PI) * 0.28 +
        Math.sin(smoothstep(0.64, 0.84, smoothP) * Math.PI) * 0.28;

      cameraRef.current.morph = totalMorph;
      cameraRef.current.zoom = camZoom;
      cameraRef.current.panX = camPanX;
      cameraRef.current.panY = camPanY;
      cameraRef.current.rotY = camRotY;
      cameraRef.current.rotX = camRotX;
      cameraRef.current.mouseX = mx;
      cameraRef.current.mouseY = -my;
      cameraRef.current.swirlPulse = Math.max(idleSwirl, transitionPulse);
      cameraRef.current.themeMix = smoothThemeMix;
      cameraRef.current.dofStrength = dofStrength;
      cameraRef.current.focusDepth = 0.13;
      cameraRef.current.exitFade = exitFade;

      // Postcard 1 (Right side): "I build web apps & AI tools."
      const card1In = smoothstep(0.12, 0.23, smoothP);
      const card1Out = smoothstep(0.36, 0.44, smoothP);
      const card1Opacity = clamp01(card1In * (1 - card1Out));
      if (postcard1Ref.current) {
        postcard1Ref.current.style.opacity = String(card1Opacity);
        const dy = (1 - card1In) * 34 - card1Out * 28;
        postcard1Ref.current.style.transform = `translate3d(0, ${dy}px, 0)`;
        postcard1Ref.current.style.pointerEvents =
          card1Opacity > 0.35 ? "auto" : "none";
      }

      // Postcard 2 (Left side, Macro Face DoF on Right): "I edit ads that convert."
      const card2In = smoothstep(0.41, 0.52, smoothP);
      const card2Out = smoothstep(0.64, 0.72, smoothP);
      const card2Opacity = clamp01(card2In * (1 - card2Out));
      if (postcard2Ref.current) {
        postcard2Ref.current.style.opacity = String(card2Opacity);
        const dy = (1 - card2In) * 34 - card2Out * 28;
        postcard2Ref.current.style.transform = `translate3d(0, ${dy}px, 0)`;
        postcard2Ref.current.style.pointerEvents =
          card2Opacity > 0.35 ? "auto" : "none";
      }

      // Postcard 3 (Right side, resolves completely before runway unsticks into Recent Work)
      const card3In = smoothstep(0.68, 0.78, smoothP);
      const card3Out = smoothstep(0.84, 0.93, smoothP);
      const card3Opacity = clamp01(card3In * (1 - card3Out));
      if (postcard3Ref.current) {
        postcard3Ref.current.style.opacity = String(card3Opacity);
        const dy = (1 - card3In) * 34 - card3Out * 28;
        postcard3Ref.current.style.transform = `translate3d(0, ${dy}px, 0)`;
        postcard3Ref.current.style.pointerEvents =
          card3Opacity > 0.35 ? "auto" : "none";
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

  const postcardSurfaceClass = isLight
    ? "bg-white/78 border-black/10 text-[#16171B] shadow-[0_24px_70px_rgba(22,23,27,0.10),inset_0_1px_0_rgba(255,255,255,0.9)]"
    : "bg-[#0B0E16]/78 border-white/12 text-white shadow-[0_24px_80px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.12)]";

  return (
    <section
      ref={runwayRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="theme-surface relative h-[300vh] min-h-[2250px] w-full bg-[var(--color-hero-bg)] select-none"
    >
      {/* Semantic #about anchor positioned cleanly in Beat 2/3 */}
      <div
        id="about"
        className="pointer-events-none absolute top-[185vh] h-px w-px"
        aria-hidden="true"
      />

      {/* Seamless Borderless Sticky 100vh Viewport */}
      <div className="theme-surface sticky top-0 h-screen w-full overflow-hidden bg-[var(--color-hero-bg)]">
        {/* Subtle Radial Optical Glow behind Cutout & Point-Cloud */}
        <div
          ref={glowRef}
          className="pointer-events-none absolute inset-0 will-change-transform"
          style={{
            background:
              "radial-gradient(circle at 48% 48%, var(--color-hero-glow) 0%, transparent 56%)",
          }}
          aria-hidden="true"
        />

        {/* True Transparent 4K Studio Cutout Layer (Zero wall or margin borders!) */}
        <div
          ref={photoLayerRef}
          className="pointer-events-none absolute inset-0 flex items-end justify-center will-change-transform"
        >
          <div className="relative h-full w-full max-w-[920px] flex items-end justify-center overflow-visible">
            <img
              src="/hero-cutout-4k.png"
              alt="Birky Andrie L. Pacuribot"
              className="h-full w-full object-cover object-center transition-[filter] duration-500 ease-dennis"
              style={{ filter: "var(--hero-cutout-filter)" }}
            />
          </div>
        </div>

        {/* LIVE WEBGL 3D POINT-CLOUD CANVAS (Pristine Light Yellow <-> Dark Neon + True Z-DoF Bokeh) */}
        <HeroPointCloud cameraRef={cameraRef} />

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
          <div className="h-13 w-13 rounded-full bg-white/15 text-white flex items-center justify-center">
            <GlobeIcon />
          </div>
        </div>

        {/* Right-Side Role Title + Quick-Launch Pills */}
        <div
          ref={roleBlockRef}
          className={`absolute right-6 sm:right-10 lg:right-14 top-[22%] sm:top-[30%] z-20 max-w-[250px] sm:max-w-[300px] lg:max-w-[330px] text-left will-change-transform ${
            isLight ? "text-[#16171B]" : "text-white"
          }`}
        >
          <ArrowDownRight
            ref={arrowRef}
            className="h-7 w-7 sm:h-8 sm:w-8 mb-4 sm:mb-5 stroke-[1.75] transition-transform duration-500 ease-out-expo"
            aria-hidden="true"
          />
          <h1 className="text-2xl sm:text-3xl lg:text-[2.15rem] font-normal leading-[1.16] tracking-[-0.02em]">
            <span className="block">{copy.heroRoleLines[0]}</span>
            <span className="block">{copy.heroRoleLines[1]}</span>
            <span className="block">{copy.heroRoleLines[2]}</span>
          </h1>

          <div className="mt-5 flex flex-wrap gap-2">
            <MagneticButton
              onClick={() => onJumpToProof("hackerlily")}
              strength={0.22}
              textStrength={0.1}
              className={`rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider ${
                isLight
                  ? "bg-[#16171B] border-[#16171B] text-white"
                  : "bg-white/10 border-white/20 text-white"
              }`}
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
              className={`rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider ${
                isLight
                  ? "bg-white/80 border-black/15 text-[#16171B]"
                  : "bg-white/10 border-white/20 text-white"
              }`}
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
            <span
              className={`font-[family-name:var(--font-display)] text-[8.5vw] sm:text-[6.8vw] lg:text-[5.8vw] font-medium uppercase leading-none tracking-[-0.025em] pr-14 whitespace-nowrap ${
                isLight ? "text-[#16171B]" : "text-white"
              }`}
            >
              Full Stack CS Engineer &mdash; Tech VA &middot; Operations &middot; SMM Strategist &mdash;
            </span>
            <span
              className={`font-[family-name:var(--font-display)] text-[8.5vw] sm:text-[6.8vw] lg:text-[5.8vw] font-medium uppercase leading-none tracking-[-0.025em] pr-14 whitespace-nowrap ${
                isLight ? "text-[#16171B]" : "text-white"
              }`}
            >
              Full Stack CS Engineer &mdash; Tech VA &middot; Operations &middot; SMM Strategist &mdash;
            </span>
          </div>
        </div>

        {/* ================================================================
            POSTCARD 1 (Right): 01 · WHAT I BUILD
           ================================================================ */}
        <div
          ref={postcard1Ref}
          style={{ opacity: 0, pointerEvents: "none" }}
          className="absolute inset-0 z-20 flex items-center justify-end px-5 sm:px-10 lg:px-16 will-change-transform"
        >
          <div
            className={`w-full md:w-[50%] lg:w-[44%] rounded-[28px] border backdrop-blur-2xl p-6 sm:p-9 space-y-5 ${postcardSurfaceClass}`}
          >
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#455CE9]">
              01 &middot; WHAT I BUILD
            </div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-[2.6rem] font-medium leading-[1.14] tracking-[-0.025em]">
              I build web apps &amp; AI tools.
            </h2>
            <p
              className={`text-sm sm:text-base leading-relaxed ${
                isLight ? "text-[#16171B]/72" : "text-white/72"
              }`}
            >
              Cut Pacs Builders audits from 20 min to under 5 sec. Built HusAI
              (real-time AI call coach) &amp; Financify (6-OS Flutter app).
            </p>
            <button
              type="button"
              onClick={() => onJumpToProof("husai")}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#455CE9] hover:bg-[#334BD3] px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-white transition-colors cursor-pointer"
            >
              <span>See live demos</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* ================================================================
            POSTCARD 2 (Left): 02 · WHAT I EDIT (Macro Face DoF on Right)
           ================================================================ */}
        <div
          ref={postcard2Ref}
          style={{ opacity: 0, pointerEvents: "none" }}
          className="absolute inset-0 z-20 flex items-center justify-start px-5 sm:px-10 lg:px-16 will-change-transform"
        >
          <div
            className={`w-full md:w-[50%] lg:w-[44%] rounded-[28px] border backdrop-blur-2xl p-6 sm:p-9 space-y-5 ${postcardSurfaceClass}`}
          >
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#455CE9]">
              02 &middot; WHAT I EDIT
            </div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-[2.6rem] font-medium leading-[1.14] tracking-[-0.025em]">
              I edit ads that convert.
            </h2>
            <p
              className={`text-sm sm:text-base leading-relaxed ${
                isLight ? "text-[#16171B]/72" : "text-white/72"
              }`}
            >
              45+ paid 9:16 Meta, TikTok &amp; Pinterest video ads shipped for
              Hackerlily Germany&mdash;engineered for sound-off mobile retention.
            </p>
            <button
              type="button"
              onClick={() => onJumpToProof("hackerlily")}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#455CE9] hover:bg-[#334BD3] px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-white transition-colors cursor-pointer"
            >
              <span>Watch 6 live reels</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* ================================================================
            POSTCARD 3 (Right): 03 · HOW I OPERATE (With CV & WhatsApp Actions)
           ================================================================ */}
        <div
          ref={postcard3Ref}
          style={{ opacity: 0, pointerEvents: "none" }}
          className="absolute inset-0 z-20 flex items-center justify-end px-5 sm:px-10 lg:px-16 will-change-transform"
        >
          <div
            className={`w-full md:w-[50%] lg:w-[44%] rounded-[28px] border backdrop-blur-2xl p-6 sm:p-9 space-y-5 ${postcardSurfaceClass}`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#455CE9]">
                03 &middot; HOW I OPERATE
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                UTC+8 READY
              </span>
            </div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-[2.6rem] font-medium leading-[1.14] tracking-[-0.025em]">
              I run remote ops &amp; SMM.
            </h2>
            <p
              className={`text-sm sm:text-base leading-relaxed ${
                isLight ? "text-[#16171B]/72" : "text-white/72"
              }`}
            >
              Alpha VA Certified &middot; ClickUp sprints, multi-platform content
              calendars, and live shift overlap for AU, EU, UK &amp; US teams.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-current/10">
              <a
                href="/Birky_Andrie_Pacuribot_CV.pdf"
                download
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-wider font-medium transition-colors ${
                  isLight
                    ? "bg-[#16171B] text-white hover:bg-[#455CE9]"
                    : "bg-white text-[#16171B] hover:bg-[#455CE9] hover:text-white"
                }`}
              >
                <Download className="h-3 w-3" />
                <span>CV (PDF)</span>
              </a>
              <a
                href="/Birky_Andrie_Pacuribot_Harvard_CV.docx"
                download
                className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                  isLight
                    ? "border-black/15 text-[#16171B] hover:bg-[#16171B] hover:text-white"
                    : "border-white/20 text-white hover:bg-white hover:text-[#16171B]"
                }`}
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
      </div>

      {/* Bottom Ambient Vertical Blend Veil into Recent Work (Eliminates Screenshot 1 seam) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[var(--color-paper)] via-[var(--color-paper)]/65 to-transparent"
      />
    </section>
  );
}
