"use client";

import { useRef } from "react";
import { ArrowDownRight, Globe, Play } from "lucide-react";
import {
  FOCUS_COPY,
  HERO_METRICS,
  PROFILE,
  type FocusMode,
  type ProofTab,
} from "@/data/portfolio";

interface HeroProps {
  focusMode: FocusMode;
  onJumpToProof: (tab: ProofTab) => void;
}

export function Hero({ focusMode, onJumpToProof }: HeroProps) {
  const copy = FOCUS_COPY[focusMode];
  const magneticBtnRef = useRef<HTMLButtonElement | null>(null);

  const handleMagneticMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = magneticBtnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.28;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.28;
    btn.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const handleMagneticLeave = () => {
    const btn = magneticBtnRef.current;
    if (!btn) return;
    btn.style.transform = "translate3d(0px, 0px, 0)";
  };

  return (
    <>
      {/* PART 1: Iconic Dennis Snellenberg 100vh #999D9E Full-Screen Hero */}
      <section className="relative h-screen min-h-[680px] max-h-[1080px] w-full overflow-hidden bg-[#999D9E] text-white select-none">
        {/* Subtle studio radial backdrop glow behind subject */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 42%, rgba(255,255,255,0.16) 0%, rgba(153,157,158,0) 62%)",
          }}
          aria-hidden="true"
        />

        {/* Center Portrait Subject rising from bottom-center */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 top-16 flex items-end justify-center">
          <div className="relative h-[82%] sm:h-[86%] w-full max-w-[460px] flex items-end justify-center overflow-hidden rounded-t-[220px]">
            <img
              src="/portrait.jpg"
              alt="Birky Andrie L. Pacuribot"
              className="h-full w-full object-cover object-top grayscale-[18%] contrast-[1.06]"
            />
            {/* Soft studio edge vignette blending into #999D9E + bottom contrast for white marquee */}
            <div
              className="absolute inset-0"
              style={{
                boxShadow: "inset 0 0 48px 18px #999D9E",
                background:
                  "linear-gradient(to top, rgba(110,114,115,0.6) 0%, rgba(153,157,158,0) 35%)",
              }}
            />
          </div>
        </div>

        {/* Left-Docked Location Pill ("Located in the Philippines" + Spinning Globe Circle) */}
        <div className="hidden sm:flex absolute left-0 top-[36%] z-20 items-center gap-6 rounded-r-full bg-[#1C1D20] text-white pl-8 lg:pl-12 pr-3.5 py-3.5">
          <div className="text-sm lg:text-base leading-[1.2] font-normal tracking-tight">
            <div>Located</div>
            <div>in the</div>
            <div>Philippines</div>
          </div>
          <div className="h-12 w-12 lg:h-14 lg:w-14 rounded-full bg-[#999D9E] flex items-center justify-center text-white">
            <Globe className="h-6 w-6 lg:h-7 lg:w-7 stroke-[1.5] animate-globe-spin" />
          </div>
        </div>

        {/* Right-Aligned Diagonal Arrow & Role Title (Positioned cleanly in right margin) */}
        <div className="absolute right-6 sm:right-10 lg:right-14 top-[24%] sm:top-[32%] z-20 max-w-[240px] sm:max-w-[285px] lg:max-w-[310px] text-left">
          <ArrowDownRight
            className="h-7 w-7 sm:h-8 sm:w-8 mb-4 sm:mb-6 text-white stroke-[1.75]"
            aria-hidden="true"
          />
          <h1 className="text-2xl sm:text-3xl lg:text-[2.15rem] font-normal leading-[1.18] tracking-[-0.02em] text-white drop-shadow-xs">
            <span className="block">Freelance</span>
            <span className="block">CS Engineer &amp;</span>
            <span className="block">Creative Technologist</span>
          </h1>

          {/* Quick-Launch Pills to HusAI & HipSurfer 9:16 Reels */}
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onJumpToProof("husai")}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#1C1D20]/85 hover:bg-[#455CE9] border border-white/20 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-white transition-colors cursor-pointer"
            >
              <Play className="h-3 w-3 fill-current" />
              <span>HusAI Demo</span>
            </button>
            <button
              type="button"
              onClick={() => onJumpToProof("hackerlily")}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#1C1D20]/85 hover:bg-[#455CE9] border border-white/20 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-white transition-colors cursor-pointer"
            >
              <Play className="h-3 w-3 fill-current" />
              <span>9:16 Ad Reels</span>
            </button>
          </div>
        </div>

        {/* Giant Bottom-Bleeding Infinite Marquee ("Birky Andrie Pacuribot —") */}
        <div className="pointer-events-none absolute bottom-3 sm:bottom-5 inset-x-0 z-20 overflow-hidden">
          <div className="animate-dennis-marquee">
            <span className="font-[family-name:var(--font-display)] text-[14vw] sm:text-[12.5vw] font-normal leading-none tracking-[-0.03em] text-white pr-10">
              Birky Andrie Pacuribot &mdash;
            </span>
            <span className="font-[family-name:var(--font-display)] text-[14vw] sm:text-[12.5vw] font-normal leading-none tracking-[-0.03em] text-white pr-10">
              Birky Andrie Pacuribot &mdash;
            </span>
          </div>
        </div>
      </section>

      {/* PART 2: Iconic Dennis Snellenberg Split Statement Section + Circular Magnetic Button */}
      <section
        id="about"
        className="bg-white text-[#1C1D20] pt-20 pb-36 sm:pt-32 sm:pb-48"
      >
        <div className="mx-auto max-w-6xl px-6 sm:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Left 7 Cols: Large Editorial Statement */}
            <div className="lg:col-span-7 space-y-4">
              <div className="font-mono text-xs uppercase tracking-widest text-[#999D9E]">
                {copy.badge}
              </div>
              <h2 className="text-2xl sm:text-4xl lg:text-[2.45rem] font-normal leading-[1.3] tracking-[-0.015em] text-[#1C1D20]">
                {copy.headline}
              </h2>
            </div>

            {/* Right 5 Cols: Supporting Bio + Dual Positioning */}
            <div className="lg:col-span-5 space-y-6">
              <p className="text-base sm:text-lg leading-relaxed text-[#1C1D20]/75">
                {copy.subheadline}
              </p>

              {/* Verified Metrics Row */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#E2E3E7]">
                {HERO_METRICS.map((m) => (
                  <div key={m.label}>
                    <div className="font-mono text-xl sm:text-2xl font-semibold tabular-nums text-[#1C1D20]">
                      {m.value}
                    </div>
                    <div className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-[#999D9E]">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Horizontal Divider Line with Overlapping Circular Magnetic Button */}
          <div className="relative mt-20 sm:mt-28">
            <div className="h-[1px] w-full bg-[#E2E3E7]" />
            <div className="absolute right-6 sm:right-20 -top-20 sm:-top-24">
              <button
                ref={magneticBtnRef}
                type="button"
                onMouseMove={handleMagneticMove}
                onMouseLeave={handleMagneticLeave}
                onClick={() => onJumpToProof("husai")}
                className="h-40 w-40 sm:h-48 sm:w-48 rounded-full bg-[#1C1D20] hover:bg-[#455CE9] text-white flex flex-col items-center justify-center gap-1 transition-colors duration-300 ease-out-expo cursor-pointer shadow-md"
              >
                <span className="text-base sm:text-lg font-medium tracking-tight">
                  Proof Stage
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-white/75">
                  HusAI &amp; 9:16 Reels
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
