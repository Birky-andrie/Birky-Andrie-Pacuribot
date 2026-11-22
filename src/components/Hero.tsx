"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDownRight, Download, MessageCircle, Play } from "lucide-react";
import {
  FOCUS_COPY,
  HERO_METRICS,
  PROFILE,
  type FocusMode,
  type ProofTab,
} from "@/data/portfolio";
import { MagneticButton } from "./MagneticButton";
import { HeroPixelCanvas } from "./HeroPixelCanvas";

interface HeroProps {
  focusMode: FocusMode;
  onJumpToProof: (tab: ProofTab) => void;
}

function GlobeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-5 w-5 animate-[spin_14s_linear_infinite]"
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
  const marqueeTrackRef = useRef<HTMLDivElement | null>(null);
  const arrowRef = useRef<SVGSVGElement | null>(null);
  const portraitRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const roleBlockRef = useRef<HTMLDivElement | null>(null);
  const aboutRef = useRef<HTMLElement | null>(null);
  const [aboutVisible, setAboutVisible] = useState(false);

  // Subtle 3D Depth-of-Field Mouse Parallax state
  const targetTiltRef = useRef({ x: 0, y: 0 });
  const currentTiltRef = useRef({ x: 0, y: 0 });
  const scrollYRef = useRef(0);

  useEffect(() => {
    const el = aboutRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAboutVisible(true);
        }
      },
      { threshold: 0.18 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let xPercent = 0;
    let direction = -1;
    let lastScrollY = window.scrollY;
    let velocityBoost = 0;
    let rafId: number;

    const onScroll = () => {
      const currentY = window.scrollY;
      scrollYRef.current = currentY;
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

      if (currentY < 1100 && roleBlockRef.current) {
        roleBlockRef.current.style.transform = `translate3d(0, ${currentY * 0.07}px, 0)`;
      }
    };

    const tick = () => {
      const baseSpeed = 0.011;
      xPercent += (baseSpeed + velocityBoost) * direction;
      velocityBoost *= 0.92;

      if (xPercent <= -50) {
        xPercent += 50;
      } else if (xPercent > 0) {
        xPercent -= 50;
      }

      if (marqueeTrackRef.current) {
        marqueeTrackRef.current.style.transform = `translate3d(${xPercent}%, 0, 0)`;
      }

      // Smooth 3D Optical Depth-of-Field Parallax Lerp
      currentTiltRef.current.x +=
        (targetTiltRef.current.x - currentTiltRef.current.x) * 0.08;
      currentTiltRef.current.y +=
        (targetTiltRef.current.y - currentTiltRef.current.y) * 0.08;

      if (scrollYRef.current < 1100) {
        if (portraitRef.current) {
          const px = currentTiltRef.current.x * 16;
          const py =
            scrollYRef.current * 0.14 + currentTiltRef.current.y * 10;
          portraitRef.current.style.transform = `translate3d(${px}px, ${py}px, 0)`;
        }
        if (glowRef.current) {
          const gx = currentTiltRef.current.x * -24;
          const gy = currentTiltRef.current.y * -18;
          glowRef.current.style.transform = `translate3d(${gx}px, ${gy}px, 0)`;
        }
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

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const nx = (e.clientX / window.innerWidth - 0.5) * 2;
    const ny = (e.clientY / window.innerHeight - 0.5) * 2;
    targetTiltRef.current = { x: nx, y: ny };
  };

  const handleHeroMouseLeave = () => {
    targetTiltRef.current = { x: 0, y: 0 };
  };

  const words = copy.headline.split(" ");

  return (
    <>
      {/* PART 1: 4K Optical Depth-of-Field Hero with 6-Second 16-Bit Pixel Game Character Morph */}
      <section
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        className="theme-surface relative h-screen min-h-[680px] max-h-[1080px] w-full overflow-hidden bg-[var(--color-hero-bg)] text-white select-none"
      >
        {/* Depth-of-Field Studio Backlight (moves opposite to foreground portrait for 3D parallax) */}
        <div
          ref={glowRef}
          className="pointer-events-none absolute inset-0 will-change-transform"
          style={{
            background:
              "radial-gradient(circle at 48% 45%, var(--color-hero-glow) 0%, transparent 58%)",
          }}
          aria-hidden="true"
        />

        {/* Center 4K Optical Depth-of-Field Portrait + 6-Second 16-Bit Pixel Game Character Canvas */}
        <div
          ref={portraitRef}
          className="pointer-events-none absolute inset-x-0 bottom-0 top-0 flex items-end justify-center will-change-transform"
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
            <HeroPixelCanvas />

            {/* Theme-matched elliptical studio vignette */}
            <div
              className="pointer-events-none absolute inset-0 z-20"
              style={{ background: "var(--hero-portrait-vignette)" }}
            />
            {/* Top & bottom atmospheric fades for crisp navbar & marquee legibility */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 z-20 h-40"
              style={{ background: "var(--hero-top-fade)" }}
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-48"
              style={{ background: "var(--hero-bottom-fade)" }}
            />
          </div>
        </div>

        {/* Left-Docked Location Badge */}
        <div className="hidden md:flex absolute left-0 top-[44%] -translate-y-1/2 z-20 items-center gap-5 bg-[var(--color-hero-pill)] text-white pl-7 pr-3.5 py-3.5 rounded-r-full shadow-lg border-r border-y border-white/10">
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
        <div className="pointer-events-none absolute bottom-4 sm:bottom-6 inset-x-0 z-20 overflow-hidden">
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
      </section>

      {/* PART 2: Apple Ultra-Minimal Status Pill Bar + Staggered Statement + Magnetic Orb */}
      <section
        id="about"
        ref={aboutRef}
        className="theme-surface bg-[var(--color-paper)] text-[var(--color-ink)] pt-14 pb-32 sm:pt-20 sm:pb-44"
      >
        <div className="mx-auto max-w-6xl px-6 sm:px-12">
          {/* Sleek 1-Line Apple Frosted Status Pill Bar (Replaces bulky 4-column text box) */}
          <div className="theme-surface mb-16 sm:mb-24 rounded-3xl sm:rounded-full border border-[var(--color-hairline)] bg-[var(--color-paper-alt)] px-5 py-3 flex flex-wrap items-center justify-between gap-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
            <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs text-[var(--color-ink)]">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold uppercase tracking-wider">
                UTC+8 Global Remote
              </span>
              <span className="text-[var(--color-ink-muted)]">&middot;</span>
              <span className="text-[var(--color-ink-muted)]">
                AU / EU / UK / US Overlap
              </span>
              <span className="hidden md:inline text-[var(--color-ink-muted)]">
                &middot; Alpha VA Certified &middot; 1.00 Lab Lead
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href="/Birky_Andrie_Pacuribot_CV.pdf"
                download
                className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-ink)] text-[var(--color-paper)] hover:bg-[#455CE9] hover:text-white px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors"
              >
                <Download className="h-3 w-3" />
                <span>CV (PDF)</span>
              </a>
              <a
                href="/Birky_Andrie_Pacuribot_Harvard_CV.docx"
                download
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-hairline)] bg-[var(--color-paper)] hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)] px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink)] transition-colors"
              >
                <Download className="h-3 w-3" />
                <span>Harvard .docx</span>
              </a>
              <a
                href={PROFILE.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#455CE9] hover:bg-[#334BD3] px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-white transition-colors"
              >
                <MessageCircle className="h-3 w-3" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Left 7 Cols: Concise 12-Word Apple Display Statement */}
            <div className="lg:col-span-7 space-y-3">
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#455CE9]">
                {copy.badge}
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-normal leading-[1.22] tracking-[-0.025em] text-[var(--color-ink)] flex flex-wrap gap-x-[0.26em] gap-y-1">
                {words.map((word, idx) => (
                  <span
                    key={`${word}-${idx}`}
                    className="inline-block overflow-hidden pb-1"
                  >
                    <span
                      style={{ transitionDelay: `${idx * 28}ms` }}
                      className={`inline-block transition-transform duration-700 ease-out-expo ${
                        aboutVisible ? "translate-y-0" : "translate-y-[110%]"
                      }`}
                    >
                      {word}
                    </span>
                  </span>
                ))}
              </h2>
            </div>

            {/* Right 5 Cols: 1-Sentence Supporting Line + 3 Oversized Apple Metrics */}
            <div
              className={`lg:col-span-5 space-y-6 transition-all duration-700 delay-150 ease-out-expo ${
                aboutVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              <p className="text-base sm:text-lg leading-relaxed text-[var(--color-ink-muted)]">
                {copy.subheadline}
              </p>

              <div className="grid grid-cols-3 gap-4 pt-5 border-t border-[var(--color-hairline)]">
                {HERO_METRICS.map((m) => (
                  <div key={m.label}>
                    <div className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-semibold tabular-nums tracking-tight text-[var(--color-ink)]">
                      {m.value}
                    </div>
                    <div className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-[var(--color-ink-muted)]">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Horizontal Divider Line with Overlapping Dual-Layer Liquid Magnetic Button */}
          <div className="relative mt-20 sm:mt-28">
            <div className="h-[1px] w-full bg-[var(--color-hairline)]" />
            <div className="absolute right-6 sm:right-20 -top-20 sm:-top-24">
              <MagneticButton
                onClick={() => onJumpToProof("hackerlily")}
                className="h-40 w-40 sm:h-48 sm:w-48 rounded-full bg-[#1C1D20] border border-white/15 text-white flex items-center justify-center shadow-md"
              >
                <span className="text-base sm:text-lg font-medium tracking-tight">
                  Proof Stage
                </span>
                <span className="mt-1 font-mono text-[10px] uppercase tracking-widest text-white/75">
                  4 Live Demos
                </span>
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
