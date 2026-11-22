"use client";

import { useEffect, useRef } from "react";
import type { ProofTab } from "@/data/portfolio";

interface SlidingGalleryProps {
  onJumpToProof: (tab: ProofTab) => void;
}

const ROW_ONE = [
  {
    id: "g1",
    bg: "#21242B",
    type: "image" as const,
    src: "/husai/screen-hero.png",
    tag: "HUSAI // HERO (:5173)",
    tab: "husai" as ProofTab,
  },
  {
    id: "g2",
    bg: "#D6D7DC",
    type: "video" as const,
    src: "/videos/hipsurfer-01.mp4",
    poster: "/videos/hipsurfer-01-poster.jpg",
    tag: "HIPSURFER // SKEPTIC UGC (9:16)",
    tab: "hackerlily" as ProofTab,
  },
  {
    id: "g3",
    bg: "#16181D",
    type: "image" as const,
    src: "/husai/screen-solution.png",
    tag: "HUSAI // THE LIFELINE",
    tab: "husai" as ProofTab,
  },
  {
    id: "g4",
    bg: "#E2DCD5",
    type: "video" as const,
    src: "/videos/hipsurfer-02.mp4",
    poster: "/videos/hipsurfer-02-poster.jpg",
    tag: "HIPSURFER // SWITCHER CUT (9:16)",
    tab: "hackerlily" as ProofTab,
  },
];

const ROW_TWO = [
  {
    id: "g5",
    bg: "#DFDFDF",
    type: "video" as const,
    src: "/videos/hipsurfer-03.mp4",
    poster: "/videos/hipsurfer-03-poster.jpg",
    tag: "HIPSURFER // MINIMALIST CUT (9:16)",
    tab: "hackerlily" as ProofTab,
  },
  {
    id: "g6",
    bg: "#1A1C22",
    type: "image" as const,
    src: "/husai/screen-practice.png",
    tag: "HUSAI // AI ROLEPLAY PRACTICE",
    tab: "husai" as ProofTab,
  },
  {
    id: "g7",
    bg: "#26282E",
    type: "image" as const,
    src: "/husai/husai-poster.jpg",
    tag: "HUSAI // 60S REMOTION REVEAL",
    tab: "husai" as ProofTab,
  },
  {
    id: "g8",
    bg: "#14161C",
    type: "image" as const,
    src: "/financify/financify-preview.png",
    tag: "FINANCIFY // FLUTTER LIVE TEST RUN",
    tab: "financify" as ProofTab,
  },
];

export function SlidingGallery({ onJumpToProof }: SlidingGalleryProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const row1Ref = useRef<HTMLDivElement | null>(null);
  const row2Ref = useRef<HTMLDivElement | null>(null);
  const curveRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let rafId: number | null = null;

    const updateParallax = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || 900;

      // Normalized progress as section passes through viewport (-1 to +1)
      const progress = (vh - rect.top) / (vh + rect.height);
      const clamped = Math.max(-0.5, Math.min(1.5, progress));

      if (row1Ref.current) {
        const x1 = (clamped - 0.5) * -180;
        row1Ref.current.style.transform = `translate3d(${x1}px, 0, 0)`;
      }
      if (row2Ref.current) {
        const x2 = (clamped - 0.5) * 180;
        row2Ref.current.style.transform = `translate3d(${x2}px, 0, 0)`;
      }
      if (curveRef.current) {
        // Morph the white arch height from 96px down to 0px as it reaches bottom
        const curveScale = Math.max(0, 1 - Math.max(0, clamped - 0.35) * 1.4);
        curveRef.current.style.transform = `scaleY(${curveScale})`;
      }
    };

    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateParallax);
    };

    updateParallax();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="theme-surface relative bg-[var(--color-paper)] pt-14 pb-20 overflow-hidden z-10"
      aria-label="Visual motion gallery"
    >
      <div className="space-y-6 sm:space-y-8">
        {/* Row 1: Slides Left on Scroll */}
        <div
          ref={row1Ref}
          className="flex items-center gap-6 sm:gap-8 px-4 sm:px-12 will-change-transform transition-transform duration-75 ease-out"
        >
          {ROW_ONE.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onJumpToProof(item.tab)}
              style={{ backgroundColor: item.bg }}
              className="group relative shrink-0 w-[290px] sm:w-[380px] aspect-[16/10] p-5 sm:p-7 flex items-center justify-center overflow-hidden cursor-pointer"
            >
              {item.type === "video" ? (
                <video
                  src={item.src}
                  poster={item.poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-auto max-w-full object-cover shadow-md transition-transform duration-500 ease-out-expo group-hover:scale-105"
                />
              ) : (
                <img
                  src={item.src}
                  alt={item.tag}
                  className="h-full w-full object-cover object-top shadow-md transition-transform duration-500 ease-out-expo group-hover:scale-105"
                />
              )}
              <span className="absolute bottom-2.5 left-3 bg-[#1C1D20]/85 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-white">
                {item.tag}
              </span>
            </button>
          ))}
        </div>

        {/* Row 2: Slides Right on Scroll */}
        <div
          ref={row2Ref}
          className="flex items-center gap-6 sm:gap-8 px-4 sm:px-12 will-change-transform transition-transform duration-75 ease-out"
        >
          {ROW_TWO.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onJumpToProof(item.tab)}
              style={{ backgroundColor: item.bg }}
              className="group relative shrink-0 w-[290px] sm:w-[380px] aspect-[16/10] p-5 sm:p-7 flex items-center justify-center overflow-hidden cursor-pointer"
            >
              {item.type === "video" ? (
                <video
                  src={item.src}
                  poster={item.poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-auto max-w-full object-cover shadow-md transition-transform duration-500 ease-out-expo group-hover:scale-105"
                />
              ) : (
                <img
                  src={item.src}
                  alt={item.tag}
                  className="h-full w-full object-cover object-top shadow-md transition-transform duration-500 ease-out-expo group-hover:scale-105"
                />
              )}
              <span className="absolute bottom-2.5 left-3 bg-[#1C1D20]/85 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-white">
                {item.tag}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Dennis Snellenberg Morphing Curved Arch Overhang above #1C1D20 Footer */}
      <div
        ref={curveRef}
        aria-hidden="true"
        className="theme-surface pointer-events-none absolute -bottom-12 left-[-10%] w-[120%] h-24 bg-[var(--color-paper)] rounded-b-[50%] shadow-[0_24px_40px_rgba(0,0,0,0.35)] origin-top will-change-transform"
      />
    </section>
  );
}
