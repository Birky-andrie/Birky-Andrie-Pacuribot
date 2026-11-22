"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDownRight, Download, Globe, MessageCircle, Play } from "lucide-react";
import {
  FOCUS_COPY,
  HERO_METRICS,
  PROFILE,
  REMOTE_READINESS_SPECS,
  type FocusMode,
  type ProofTab,
} from "@/data/portfolio";
import { MagneticButton } from "./MagneticButton";

interface HeroProps {
  focusMode: FocusMode;
  onJumpToProof: (tab: ProofTab) => void;
}

export function Hero({ focusMode, onJumpToProof }: HeroProps) {
  const copy = FOCUS_COPY[focusMode];

  const marqueeTrackRef = useRef<HTMLDivElement | null>(null);
  const portraitRef = useRef<HTMLDivElement | null>(null);
  const roleBlockRef = useRef<HTMLDivElement | null>(null);
  const arrowRef = useRef<SVGSVGElement | null>(null);

  const aboutRef = useRef<HTMLElement | null>(null);
  const [aboutVisible, setAboutVisible] = useState(false);

  useEffect(() => {
    const el = aboutRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAboutVisible(true);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let xPercent = 0;
    let direction = -1;
    let velocityBoost = 0;
    let lastScrollY = window.scrollY;
    let rafId: number;

    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY;
      lastScrollY = currentY;

      if (Math.abs(delta) > 0.5) {
        direction = delta > 0 ? -1 : 1;
        velocityBoost = Math.min(0.32, Math.abs(delta) * 0.006);
      }

      if (arrowRef.current) {
        arrowRef.current.style.transform =
          direction === 1 ? "rotate(-45deg)" : "rotate(0deg)";
      }

      if (currentY < 1100) {
        if (portraitRef.current) {
          portraitRef.current.style.transform = `translate3d(0, ${currentY * 0.14}px, 0)`;
        }
        if (roleBlockRef.current) {
          roleBlockRef.current.style.transform = `translate3d(0, ${currentY * 0.07}px, 0)`;
        }
      }
    };

    const tick = () => {
      const baseSpeed = 0.045;
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

      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const words = copy.headline.split(" ");

  return (
    <>
      {/* PART 1: Iconic Dennis Snellenberg 100vh Full-Screen Hero (Theme-Reactive) */}
      <section className="theme-surface relative h-screen min-h-[680px] max-h-[1080px] w-full overflow-hidden bg-[var(--color-hero-bg)] text-white select-none">
        {/* Studio radial lighting behind the cutout subject */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 48% 45%, var(--color-hero-glow) 0%, transparent 58%)",
          }}
          aria-hidden="true"
        />

        {/* Center Background-Removed Cutout Portrait standing directly against hero backdrop */}
        <div
          ref={portraitRef}
          className="pointer-events-none absolute inset-x-0 bottom-0 top-12 flex items-end justify-center will-change-transform"
        >
          <div className="relative h-[86%] sm:h-[90%] w-full max-w-[540px] flex items-end justify-center">
            <img
              src="/portrait-cutout.png"
              alt="Birky Andrie L. Pacuribot"
              className="h-full w-full object-contain object-bottom grayscale-[14%] contrast-[1.06] drop-shadow-[0_24px_48px_rgba(0,0,0,0.28)]"
            />
            {/* Subtle lower-third gradient so the white marquee glides with crisp contrast */}
            <div
              className="absolute inset-x-0 bottom-0 h-32"
              style={{
                background:
                  "linear-gradient(to top, var(--color-hero-fade) 0%, transparent 100%)",
              }}
            />
          </div>
        </div>

        {/* Left-Docked Location Pill ("Located in the Philippines" + Spinning Globe Circle) */}
        <div className="hidden sm:flex absolute left-0 top-[36%] z-20 items-center gap-6 rounded-r-full bg-[var(--color-hero-pill)] border border-l-0 border-white/10 text-white pl-8 lg:pl-12 pr-3.5 py-3.5">
          <div className="text-sm lg:text-base leading-[1.2] font-normal tracking-tight">
            <div>Located</div>
            <div>in the</div>
            <div>Philippines</div>
          </div>
          <div className="h-12 w-12 lg:h-14 lg:w-14 rounded-full bg-[#999D9E] flex items-center justify-center text-white">
            <Globe className="h-6 w-6 lg:h-7 lg:w-7 stroke-[1.5] animate-globe-spin" />
          </div>
        </div>

        {/* Right-Aligned Diagonal Arrow & Dynamic Hybrid Role Title */}
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

          {/* Magnetic Quick-Launch Pills to 6-Reel Showcase & HusAI */}
          <div className="mt-5 flex flex-wrap gap-2">
            <MagneticButton
              onClick={() => onJumpToProof("hackerlily")}
              strength={0.22}
              textStrength={0.1}
              className="rounded-full bg-[#1C1D20]/85 border border-white/20 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-white"
            >
              <span className="inline-flex items-center gap-1.5">
                <Play className="h-3 w-3 fill-current" />
                <span>6 Ad Reels (9:16)</span>
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
                <span>HusAI Demo</span>
              </span>
            </MagneticButton>
          </div>
        </div>

        {/* Giant Bottom-Bleeding Velocity-Driven Infinite Marquee ("Birky Andrie Pacuribot —") */}
        <div className="pointer-events-none absolute bottom-3 sm:bottom-5 inset-x-0 z-20 overflow-hidden">
          <div
            ref={marqueeTrackRef}
            className="flex w-max will-change-transform"
          >
            <span className="font-[family-name:var(--font-display)] text-[14vw] sm:text-[12.5vw] font-normal leading-none tracking-[-0.03em] text-white pr-12 whitespace-nowrap">
              Birky Andrie Pacuribot &mdash;
            </span>
            <span className="font-[family-name:var(--font-display)] text-[14vw] sm:text-[12.5vw] font-normal leading-none tracking-[-0.03em] text-white pr-12 whitespace-nowrap">
              Birky Andrie Pacuribot &mdash;
            </span>
          </div>
        </div>
      </section>

      {/* PART 2: Remote Readiness Bar + Dennis Snellenberg Split Statement + Liquid Magnetic Button */}
      <section
        id="about"
        ref={aboutRef}
        className="theme-surface bg-[var(--color-paper)] text-[var(--color-ink)] pt-12 pb-36 sm:pt-16 sm:pb-48"
      >
        <div className="mx-auto max-w-6xl px-6 sm:px-12">
          {/* Remote Readiness & Global Shift Overlap Spec Bar (For Hiring Managers & Recruiters) */}
          <div className="theme-surface mb-14 sm:mb-20 border border-[var(--color-hairline)] bg-[var(--color-paper-alt)] p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 mb-4 border-b border-[var(--color-hairline)]">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[var(--color-ink)]">
                <span className="h-2 w-2 rounded-full bg-[#455CE9]" />
                <span className="font-semibold">
                  REMOTE HIRING &amp; SHIFT READINESS
                </span>
                <span className="hidden sm:inline text-[var(--color-ink-muted)]">
                  // CAGAYAN DE ORO, PH (UTC+8)
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <a
                  href="/Birky_Andrie_Pacuribot_CV.pdf"
                  download
                  className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-ink)] text-[var(--color-paper)] hover:bg-[#455CE9] hover:text-white px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors"
                >
                  <Download className="h-3 w-3" />
                  <span>Download CV (PDF)</span>
                </a>
                <a
                  href="/Birky_Andrie_Pacuribot_Harvard_CV.docx"
                  download
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-hairline)] bg-[var(--color-paper)] hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)] px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink)] transition-colors"
                >
                  <Download className="h-3 w-3" />
                  <span>Harvard Word (.docx)</span>
                </a>
                <a
                  href={PROFILE.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#455CE9] hover:bg-[#334BD3] px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-white transition-colors"
                >
                  <MessageCircle className="h-3 w-3" />
                  <span>WhatsApp Direct</span>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {REMOTE_READINESS_SPECS.map((spec) => (
                <div key={spec.label} className="space-y-0.5">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-muted)]">
                    {spec.label}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-[var(--color-ink)]">
                    {spec.value}
                  </div>
                  <div className="font-mono text-[11px] text-[var(--color-ink-muted)]">
                    {spec.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Left 7 Cols: Word-by-Word Staggered Scroll-Reveal Statement */}
            <div className="lg:col-span-7 space-y-4">
              <div className="font-mono text-xs uppercase tracking-widest text-[var(--color-ink-muted)]">
                {copy.badge}
              </div>
              <h2 className="text-2xl sm:text-4xl lg:text-[2.45rem] font-normal leading-[1.3] tracking-[-0.015em] text-[var(--color-ink)] flex flex-wrap gap-x-[0.28em] gap-y-1">
                {words.map((word, idx) => (
                  <span
                    key={`${word}-${idx}`}
                    className="inline-block overflow-hidden pb-1"
                  >
                    <span
                      style={{ transitionDelay: `${idx * 24}ms` }}
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

            {/* Right 5 Cols: Supporting Bio + Dual Positioning */}
            <div
              className={`lg:col-span-5 space-y-6 transition-all duration-700 delay-200 ease-out-expo ${
                aboutVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              <p className="text-base sm:text-lg leading-relaxed text-[var(--color-ink-muted)]">
                {copy.subheadline}
              </p>

              {/* Verified Metrics Row */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[var(--color-hairline)]">
                {HERO_METRICS.map((m) => (
                  <div key={m.label}>
                    <div className="font-mono text-xl sm:text-2xl font-semibold tabular-nums text-[var(--color-ink)]">
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
                  6 Reels &amp; HusAI
                </span>
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
