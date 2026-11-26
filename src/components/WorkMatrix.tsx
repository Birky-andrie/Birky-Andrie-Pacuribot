"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Play } from "lucide-react";
import {
  CASE_STUDIES,
  type ProofTab,
  type WorkCategory,
} from "@/data/portfolio";
import { MagneticButton } from "./MagneticButton";

const FILTERS: { id: WorkCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "va", label: "VA & Ops" },
  { id: "creative", label: "Creative" },
  { id: "engineering", label: "Engineering" },
  { id: "github", label: "Open Source" },
];

interface WorkMatrixProps {
  externalFilter?: WorkCategory;
  onJumpToProof: (tab: ProofTab) => void;
}

export function WorkMatrix({
  externalFilter,
  onJumpToProof,
}: WorkMatrixProps) {
  const [activeFilter, setActiveFilter] = useState<WorkCategory>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number>(0);
  const [isHoveringList, setIsHoveringList] = useState(false);

  // Two-layer spring lerp refs: Modal Box (0.14 lerp) + Blue "View" Circle (0.26 lerp)
  const modalRef = useRef<HTMLDivElement | null>(null);
  const cursorCircleRef = useRef<HTMLDivElement | null>(null);
  const targetPos = useRef({ x: 0, y: 0 });
  const modalPos = useRef({ x: 0, y: 0 });
  const circlePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (externalFilter) {
      setActiveFilter(externalFilter);
      setHoveredIdx(0);
    }
  }, [externalFilter]);

  useEffect(() => {
    let rafId: number;

    const animateCursorFollower = () => {
      // Layer 1: 350x350 Preview Modal lerps at 0.14
      modalPos.current.x += (targetPos.current.x - modalPos.current.x) * 0.14;
      modalPos.current.y += (targetPos.current.y - modalPos.current.y) * 0.14;

      // Layer 2: 80x80 Blue "View" Circle lerps faster at 0.28 for signature physical separation
      circlePos.current.x += (targetPos.current.x - circlePos.current.x) * 0.28;
      circlePos.current.y += (targetPos.current.y - circlePos.current.y) * 0.28;

      if (modalRef.current) {
        modalRef.current.style.transform = `translate3d(${modalPos.current.x - 175}px, ${modalPos.current.y - 175}px, 0)`;
      }
      if (cursorCircleRef.current) {
        cursorCircleRef.current.style.transform = `translate3d(${circlePos.current.x - 40}px, ${circlePos.current.y - 40}px, 0)`;
      }

      rafId = requestAnimationFrame(animateCursorFollower);
    };

    rafId = requestAnimationFrame(animateCursorFollower);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    targetPos.current.x = e.clientX;
    targetPos.current.y = e.clientY;
  };

  const filtered =
    activeFilter === "all"
      ? CASE_STUDIES
      : CASE_STUDIES.filter((item) => item.categories.includes(activeFilter));

  const showFloatingPreview = isHoveringList && !expandedId;

  return (
    <section
      id="work"
      className="theme-surface bg-[var(--color-paper)] text-[var(--color-ink)] pt-20 sm:pt-28 pb-24 sm:pb-32 relative"
      onMouseMove={handleMouseMove}
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-12">
        {/* Heading + Filter Pills */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-10">
          <h2 className="text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">
            Selected Work
          </h2>

          <div
            className="flex flex-wrap gap-2"
            role="tablist"
            aria-label="Filter recent work"
          >
            {FILTERS.map((filter) => {
              const count =
                filter.id === "all"
                  ? CASE_STUDIES.length
                  : CASE_STUDIES.filter((c) =>
                      c.categories.includes(
                        filter.id as Exclude<WorkCategory, "all">
                      )
                    ).length;
              const isActive = activeFilter === filter.id;

              return (
                <button
                  key={filter.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    setActiveFilter(filter.id);
                    setHoveredIdx(0);
                  }}
                  className={`rounded-full px-4 py-1.5 text-xs font-normal transition-colors cursor-pointer border ${
                    isActive
                      ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)]"
                      : "border-[var(--color-hairline)] bg-[var(--color-paper)] text-[var(--color-ink-muted)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
                  }`}
                >
                  {filter.label}{" "}
                  <sup className="font-mono text-[10px] ml-0.5 opacity-75">
                    {count}
                  </sup>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dennis Snellenberg Oversized Project Rows */}
        <div
          onMouseEnter={(e) => {
            targetPos.current.x = e.clientX;
            targetPos.current.y = e.clientY;
            modalPos.current.x = e.clientX;
            modalPos.current.y = e.clientY;
            circlePos.current.x = e.clientX;
            circlePos.current.y = e.clientY;
            setIsHoveringList(true);
          }}
          onMouseLeave={() => setIsHoveringList(false)}
          className="border-t border-[var(--color-hairline)] divide-y divide-[var(--color-hairline)] border-b"
        >
          {filtered.map((study, idx) => {
            const isExpanded = expandedId === study.id;

            return (
              <article
                key={study.id}
                onMouseEnter={() => setHoveredIdx(idx)}
                className="group transition-colors"
              >
                <div
                  onClick={() =>
                    setExpandedId(isExpanded ? null : study.id)
                  }
                  className="py-9 sm:py-12 px-2 sm:px-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Giant Project Title (slides left/fades slightly on hover like Dennis's rows) */}
                  <h3 className="text-3xl sm:text-5xl lg:text-[3.6rem] font-normal tracking-[-0.025em] text-[var(--color-ink)] transition-all duration-500 ease-out-expo group-hover:-translate-x-3 group-hover:opacity-40">
                    {study.title.split(" — ")[0]}
                  </h3>

                  {/* Right Side: Role & Metric (slides right slightly on hover) */}
                  <div className="flex items-center justify-between md:justify-end gap-6 transition-all duration-500 ease-out-expo group-hover:translate-x-3">
                    <div className="text-sm sm:text-base font-normal text-[var(--color-ink-muted)]">
                      {study.role.split(" — ")[0]}
                    </div>
                    <div className="font-mono text-xs sm:text-sm px-3 py-1 rounded-full bg-[var(--color-paper-alt)] border border-[var(--color-hairline)] text-[var(--color-ink)] tabular-nums">
                      {study.primaryMetric} · {study.primaryMetricLabel}
                    </div>
                  </div>
                </div>

                {/* Expanded Case Study Drawer + Live Inline Video Players */}
                {isExpanded && (
                  <div
                    onMouseEnter={() => setIsHoveringList(false)}
                    className="mx-1 mb-6 rounded-[28px] border border-[var(--color-hairline)] bg-[var(--color-paper-alt)] px-5 py-7 sm:px-8 sm:py-8 space-y-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <div className="text-xs font-medium text-[#455CE9]">
                          {study.clientOrContext} &middot; {study.period}
                        </div>
                        <p className="mt-1 max-w-3xl text-base sm:text-lg leading-relaxed text-[var(--color-ink)] font-medium">
                          {study.impact}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {study.id === "husai" && (
                          <button
                            type="button"
                            onClick={() => onJumpToProof("husai")}
                            className="inline-flex items-center gap-1.5 rounded-full bg-[#455CE9] hover:bg-[#334BD3] px-4 py-2 text-xs font-medium text-white transition-colors cursor-pointer"
                          >
                            <Play className="h-3 w-3 fill-current" />
                            Open in Proof Stage
                          </button>
                        )}
                        {study.id === "hackerlily-hipsurfer" && (
                          <button
                            type="button"
                            onClick={() => onJumpToProof("hackerlily")}
                            className="inline-flex items-center gap-1.5 rounded-full bg-[#455CE9] hover:bg-[#334BD3] px-4 py-2 text-xs font-medium text-white transition-colors cursor-pointer"
                          >
                            <Play className="h-3 w-3 fill-current" />
                            Open 9:16 Reels Stage
                          </button>
                        )}
                        {study.id === "pacs-builders" && (
                          <button
                            type="button"
                            onClick={() => onJumpToProof("pacs")}
                            className="inline-flex items-center gap-1.5 rounded-full bg-[#1C1D20] hover:bg-[#455CE9] px-4 py-2 text-xs font-medium text-white transition-colors cursor-pointer"
                          >
                            <Play className="h-3 w-3 fill-current" />
                            Run &lt;5s Audit Benchmark
                          </button>
                        )}
                        {study.id === "financify" && (
                          <button
                            type="button"
                            onClick={() => onJumpToProof("financify")}
                            className="inline-flex items-center gap-1.5 rounded-full bg-[#455CE9] hover:bg-[#334BD3] px-4 py-2 text-xs font-medium text-white transition-colors cursor-pointer"
                          >
                            <Play className="h-3 w-3 fill-current" />
                            Run Live Mobile Test
                          </button>
                        )}
                        {study.links?.live && (
                          <a
                            href={study.links.live}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 rounded-full bg-[#1C1D20] hover:bg-[#455CE9] px-4 py-2 text-xs font-medium text-white transition-colors"
                          >
                            Live Site
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </a>
                        )}
                        {study.links?.repo && (
                          <a
                            href={study.links.repo}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 rounded-full border border-[var(--color-hairline)] bg-[var(--color-paper)] hover:bg-[#1C1D20] hover:text-white px-4 py-2 text-xs font-medium text-[var(--color-ink)] transition-colors"
                          >
                            GitHub
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="rounded-2xl bg-[var(--color-paper)] p-4 border border-[var(--color-hairline)]">
                        <div className="text-[11px] font-semibold text-[#455CE9] mb-1">
                          Challenge
                        </div>
                        <p className="text-xs sm:text-sm leading-relaxed text-[var(--color-ink)]">
                          {study.problem}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-[var(--color-paper)] p-4 border border-[var(--color-hairline)]">
                        <div className="text-[11px] font-semibold text-[#455CE9] mb-1">
                          System Built
                        </div>
                        <p className="text-xs sm:text-sm leading-relaxed text-[var(--color-ink)]">
                          {study.execution}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-[var(--color-paper)] p-4 border border-[var(--color-hairline)]">
                        <div className="text-[11px] font-semibold text-[#455CE9] mb-1">
                          Verified Outcome
                        </div>
                        <p className="text-xs sm:text-sm leading-relaxed text-[var(--color-ink)]">
                          {study.impact}
                        </p>
                      </div>
                    </div>

                    {study.id === "hackerlily-hipsurfer" && (
                      <div className="rounded-[24px] border border-white/12 bg-[#111318] p-5 text-white">
                        <div className="flex items-center justify-between text-xs text-white/75 mb-4">
                          <span className="font-medium text-white">Featured 9:16 Ad Cuts</span>
                          <span>Unmute or expand in player controls</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {[
                            {
                              src: "/videos/hipsurfer-01.mp4",
                              poster: "/videos/hipsurfer-01-poster.jpg",
                              label: "Skeptic UGC (0:20)",
                            },
                            {
                              src: "/videos/hipsurfer-02.mp4",
                              poster: "/videos/hipsurfer-02-poster.jpg",
                              label: "Competitor Switcher (0:20)",
                            },
                            {
                              src: "/videos/hipsurfer-03.mp4",
                              poster: "/videos/hipsurfer-03-poster.jpg",
                              label: "Minimalist Aesthetic (0:18)",
                            },
                          ].map((vid) => (
                            <div
                              key={vid.src}
                              className="overflow-hidden rounded-2xl border border-white/12 bg-[#141517]"
                            >
                              <video
                                src={vid.src}
                                poster={vid.poster}
                                controls
                                playsInline
                                loop
                                muted
                                preload="metadata"
                                className="aspect-[9/16] w-full object-cover"
                              />
                              <div className="border-t border-white/10 px-3.5 py-2.5 text-xs text-white/85">
                                {vid.label}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {study.id === "husai" && (
                      <div className="rounded-[24px] border border-white/12 bg-[#111318] p-5 text-white">
                        <div className="flex items-center justify-between text-xs text-white/75 mb-3">
                          <span className="font-medium text-white">HusAI 60-Second Product Reveal (Remotion)</span>
                          <span className="font-mono text-[11px]">1920×1080</span>
                        </div>
                        <video
                          src="/husai/husai-demo.mp4"
                          poster="/husai/husai-poster.jpg"
                          controls
                          playsInline
                          preload="metadata"
                          className="aspect-video w-full rounded-2xl border border-white/12 bg-[#141517]"
                        />
                      </div>
                    )}

                    {study.id === "financify" && (
                      <div className="rounded-[24px] border border-white/12 bg-[#111318] p-5 text-white">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-white/75 mb-4">
                          <span className="font-medium text-white">Financify Flutter Captures (lib/main.dart)</span>
                          <span>Budget · Analysis Delta · Settings</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {[
                            {
                              src: "/financify/screen-budget.png",
                              label: "BudgetScreen (Weekly ₱ Tracker)",
                            },
                            {
                              src: "/financify/screen-analysis.png",
                              label: "AnalysisScreen (Spending Delta)",
                            },
                            {
                              src: "/financify/screen-settings.png",
                              label: "SettingsScreen (ImagePicker Profile)",
                            },
                          ].map((shot) => (
                            <div
                              key={shot.src}
                              className="overflow-hidden rounded-2xl border border-white/12 bg-[#0E1014] flex flex-col justify-between"
                            >
                              <div className="p-4 flex items-center justify-center">
                                <img
                                  src={shot.src}
                                  alt={shot.label}
                                  className="max-h-[340px] w-auto object-contain"
                                />
                              </div>
                              <div className="border-t border-white/10 px-3.5 py-2.5 text-xs text-white/85">
                                {shot.label}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {study.stack.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-[var(--color-hairline)] bg-[var(--color-paper)] px-3 py-1 text-xs text-[var(--color-ink-muted)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Dennis Snellenberg Centered Liquid-Fill Magnetic Pill CTA Below Recent Work */}
        <div className="mt-14 flex justify-center">
          <MagneticButton
            href="#proof-lab"
            strength={0.25}
            textStrength={0.12}
            className="rounded-full border border-[var(--color-hairline)] bg-[var(--color-paper)] px-9 py-4 text-sm sm:text-base font-normal text-[var(--color-ink)] hover:text-white"
          >
            <span className="inline-flex items-center gap-2">
              <span>Explore Live Proof Stage</span>
              <sup className="font-mono text-xs opacity-75">
                {CASE_STUDIES.length}
              </sup>
            </span>
          </MagneticButton>
        </div>
      </div>

      {/* LAYER 1: Full-Bleed Edge-to-Edge 350x350 Vertical-Sliding Preview Panel (Zero Margins) */}
      <div
        ref={modalRef}
        aria-hidden="true"
        className="hidden lg:block pointer-events-none fixed top-0 left-0 z-40 h-[350px] w-[350px] will-change-transform"
      >
        <div
          className={`h-full w-full overflow-hidden rounded-[28px] ring-1 ring-inset ring-white/20 shadow-[0_28px_70px_-12px_rgba(0,0,0,0.58)] transition-transform duration-500 ease-dennis ${
            showFloatingPreview ? "scale-100" : "scale-0"
          }`}
        >
          {/* Vertical Filmstrip that slides smoothly (-hoveredIdx * 100%) across all filtered projects */}
          <div
            style={{
              transform: `translate3d(0, -${hoveredIdx * 100}%, 0)`,
            }}
            className="h-full w-full transition-transform duration-500 ease-dennis"
          >
            {filtered.map((study) => (
              <div
                key={study.id}
                className="relative h-[350px] w-[350px] overflow-hidden bg-[#0D1017]"
              >
                {study.previewMedia.type === "video" &&
                  study.previewMedia.src && (
                    <video
                      src={study.previewMedia.src}
                      poster={study.previewMedia.poster}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="h-full w-full object-cover"
                    />
                  )}

                {study.previewMedia.type === "image" &&
                  study.previewMedia.src && (
                    <img
                      src={study.previewMedia.src}
                      alt={study.title}
                      className="h-full w-full object-cover object-center"
                    />
                  )}

                {study.previewMedia.type === "telemetry" && (
                  <div
                    className="flex h-full w-full flex-col justify-between p-5 text-white"
                    style={{
                      background:
                        "radial-gradient(125% 110% at 15% 5%, rgba(69, 92, 233, 0.32) 0%, rgba(11, 14, 22, 0.99) 58%)",
                    }}
                  >
                    {/* Miniature App Top Bar */}
                    <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
                        <span className="truncate text-[11px] font-medium text-white/90">
                          Pacs Builders · Audit Engine
                        </span>
                      </div>
                      <span className="rounded-full border border-white/15 bg-white/10 px-2 py-0.5 font-mono text-[9px] text-[#9EB0FF] shrink-0">
                        ADMIN · AUDITOR
                      </span>
                    </div>

                    {/* Latency Comparison Card */}
                    <div className="rounded-2xl border border-white/12 bg-white/[0.05] p-3.5 space-y-2.5">
                      <div className="flex items-end justify-between gap-2">
                        <div>
                          <div className="font-mono text-[9px] uppercase tracking-wider text-white/55">
                            Automated Query
                          </div>
                          <div className="font-[family-name:var(--font-display)] text-4xl font-semibold leading-none tracking-tight tabular-nums text-white mt-0.5">
                            1.84s
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-[9px] uppercase tracking-wider text-emerald-400">
                            &lt; 5s SLA Pass
                          </div>
                          <div className="font-mono text-[10px] text-white/55 tabular-nums">
                            vs ~20m Excel
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                          <div className="h-full w-[14%] rounded-full bg-[#455CE9]" />
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                          <div className="h-full w-full rounded-full bg-white/25" />
                        </div>
                      </div>
                    </div>

                    {/* Immutable Material Ledger Rows */}
                    <div className="rounded-2xl border border-white/10 bg-black/35 divide-y divide-white/[0.07] font-mono text-[9.5px]">
                      <div className="flex items-center justify-between px-3 py-2 text-white/85">
                        <span className="truncate">TX-9041 · Portland Cement</span>
                        <span className="text-emerald-400 shrink-0 ml-2">VERIFIED</span>
                      </div>
                      <div className="flex items-center justify-between px-3 py-2 text-white/85">
                        <span className="truncate">TX-9042 · Rebar 12mm (180)</span>
                        <span className="text-emerald-400 shrink-0 ml-2">VERIFIED</span>
                      </div>
                      <div className="flex items-center justify-between px-3 py-2 text-white/85">
                        <span className="truncate">TX-9043 · Marine Plywood</span>
                        <span className="text-[#9EB0FF] shrink-0 ml-2">FLAGGED</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LAYER 2: Faster-Lerping Frosted Liquid Glass "View" Cursor Circle (0.28 Spring Lerp) */}
      <div
        ref={cursorCircleRef}
        aria-hidden="true"
        className="hidden lg:block pointer-events-none fixed top-0 left-0 z-50 h-20 w-20 will-change-transform"
      >
        <div
          className={`h-full w-full rounded-full border border-white/30 bg-[#455CE9]/85 backdrop-blur-xl text-white flex items-center justify-center text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_12px_30px_rgba(69,92,233,0.48)] transition-transform duration-300 ease-dennis ${
            showFloatingPreview ? "scale-100" : "scale-0"
          }`}
        >
          View
        </div>
      </div>
      {/* Seamless Bottom Ambient Transition into Proof Rail */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-[#080A0F]/25"
      />
    </section>
  );
}
