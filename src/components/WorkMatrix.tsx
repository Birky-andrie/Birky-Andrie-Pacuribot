"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, ChevronUp, Play } from "lucide-react";
import {
  CASE_STUDIES,
  type CaseStudy,
  type ProofTab,
  type WorkCategory,
} from "@/data/portfolio";

const FILTERS: { id: WorkCategory; label: string }[] = [
  { id: "all", label: "ALL" },
  { id: "engineering", label: "ENGINEERING" },
  { id: "creative", label: "CREATIVE" },
  { id: "leadership", label: "LEADERSHIP" },
  { id: "github", label: "GITHUB REPOS" },
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
  const [hoveredStudy, setHoveredStudy] = useState<CaseStudy | null>(null);

  // Hardware-accelerated floating preview position (zero React state re-renders on mousemove)
  const previewRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (externalFilter) {
      setActiveFilter(externalFilter);
    }
  }, [externalFilter]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!previewRef.current) return;
    const clientX = e.clientX;
    const clientY = e.clientY;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (!previewRef.current) return;
      const x = Math.min(window.innerWidth - 340, clientX + 28);
      const y = Math.max(72, Math.min(window.innerHeight - 280, clientY - 110));
      previewRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
  };

  const filtered =
    activeFilter === "all"
      ? CASE_STUDIES
      : CASE_STUDIES.filter((item) => item.categories.includes(activeFilter));

  return (
    <section
      id="work"
      className="border-b border-[var(--color-hairline)] relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoveredStudy(null)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[var(--color-ink)]">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-signal)]">
              03 // Selected Work Index
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-[var(--color-ink)]">
              Proof of execution, indexed by impact.
            </h2>
          </div>

          {/* Filter Bar */}
          <div
            className="flex flex-wrap border-t border-l border-[var(--color-hairline)]"
            role="tablist"
            aria-label="Filter case studies by category"
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
                  onClick={() => setActiveFilter(filter.id)}
                  className={`border-r border-b border-[var(--color-hairline)] px-3.5 py-2 font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                    isActive
                      ? "bg-[var(--color-ink)] text-[var(--color-paper)]"
                      : "bg-[var(--color-paper)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-paper-alt)]"
                  }`}
                >
                  {filter.label}{" "}
                  <span className="tabular-nums opacity-70">
                    ({String(count).padStart(2, "0")})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Column Header Bar (Dennis Snellenberg Editorial Index Table) */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-6 py-3 border-b border-[var(--color-hairline)] font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink-muted)]">
          <div className="lg:col-span-1">INDEX</div>
          <div className="lg:col-span-5">PROJECT // ROLE</div>
          <div className="lg:col-span-3">CLIENT &amp; LOCATION</div>
          <div className="lg:col-span-3 text-right">VERIFIED METRIC</div>
        </div>

        {/* Editorial Index Rows */}
        <div className="divide-y divide-[var(--color-hairline)] border-b border-[var(--color-ink)]">
          {filtered.map((study) => {
            const isExpanded = expandedId === study.id;

            return (
              <article
                key={study.id}
                onMouseEnter={() => setHoveredStudy(study)}
                className="group transition-colors hover:bg-[var(--color-paper-alt)]/75"
              >
                {/* Clickable Dennis Snellenberg Index Row */}
                <div
                  onClick={() =>
                    setExpandedId(isExpanded ? null : study.id)
                  }
                  className="py-6 sm:py-8 px-2 sm:px-3 cursor-pointer grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center"
                >
                  {/* 01: Index Number */}
                  <div className="lg:col-span-1 flex items-center justify-between lg:justify-start">
                    <span className="font-mono text-sm sm:text-base font-medium tabular-nums text-[var(--color-ink-muted)] group-hover:text-[var(--color-signal)] transition-colors">
                      {study.index}
                    </span>
                    <span className="lg:hidden font-mono text-xs text-[var(--color-signal)]">
                      {study.code} // {study.period}
                    </span>
                  </div>

                  {/* 02: Oversized Neo-Grotesque Title (shifts right on hover) */}
                  <div className="lg:col-span-5">
                    <h3 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-[var(--color-ink)] transition-transform duration-300 ease-out-expo group-hover:translate-x-2">
                      {study.title}
                    </h3>
                    <p className="mt-1 font-mono text-xs text-[var(--color-ink-muted)]">
                      {study.role}
                    </p>
                  </div>

                  {/* 03: Client & Location */}
                  <div className="lg:col-span-3 font-mono text-xs space-y-1">
                    <div className="text-[var(--color-ink)]">
                      {study.clientOrContext}
                    </div>
                    <div className="text-[11px] text-[var(--color-ink-muted)]">
                      {study.locationTag}
                    </div>
                  </div>

                  {/* 04: Primary Metric & Expand Action */}
                  <div className="lg:col-span-3 flex items-center justify-between lg:justify-end gap-4">
                    <div className="lg:text-right">
                      <div className="font-mono text-2xl sm:text-3xl font-semibold tabular-nums text-[var(--color-ink)] group-hover:text-[var(--color-signal)] transition-colors">
                        {study.primaryMetric}
                      </div>
                      <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-ink-muted)]">
                        {study.primaryMetricLabel}
                      </div>
                    </div>

                    <span className="inline-flex items-center justify-center border border-[var(--color-hairline)] bg-[var(--color-paper)] p-2 text-[var(--color-ink)] group-hover:border-[var(--color-ink)]">
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </span>
                  </div>
                </div>

                {/* Expanded Case Study Breakdown Drawer */}
                {isExpanded && (
                  <div className="px-2 sm:px-4 pb-8 pt-2 space-y-5 border-t border-[var(--color-hairline)] bg-[var(--color-paper-alt)]/50">
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <p className="max-w-3xl text-sm sm:text-base leading-relaxed text-[var(--color-ink)] font-medium">
                        {study.impact}
                      </p>

                      <div className="flex flex-wrap items-center gap-2">
                        {study.id === "husai" && (
                          <button
                            type="button"
                            onClick={() => onJumpToProof("husai")}
                            className="inline-flex items-center gap-1.5 border border-[var(--color-signal)] bg-[var(--color-signal)] px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-[var(--color-paper)] hover:bg-[var(--color-ink)] hover:border-[var(--color-ink)] transition-colors cursor-pointer"
                          >
                            <Play className="h-3 w-3 fill-current" />
                            Open in Dark Cinema Stage
                          </button>
                        )}
                        {study.id === "hackerlily-hipsurfer" && (
                          <button
                            type="button"
                            onClick={() => onJumpToProof("hackerlily")}
                            className="inline-flex items-center gap-1.5 border border-[var(--color-signal)] bg-[var(--color-signal)] px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-[var(--color-paper)] hover:bg-[var(--color-ink)] hover:border-[var(--color-ink)] transition-colors cursor-pointer"
                          >
                            <Play className="h-3 w-3 fill-current" />
                            Open in Dark Cinema Stage
                          </button>
                        )}
                        {study.id === "pacs-builders" && (
                          <button
                            type="button"
                            onClick={() => onJumpToProof("pacs")}
                            className="inline-flex items-center gap-1.5 border border-[var(--color-ink)] bg-[var(--color-ink)] px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-[var(--color-paper)] hover:bg-[var(--color-signal)] hover:border-[var(--color-signal)] transition-colors cursor-pointer"
                          >
                            <Play className="h-3 w-3 fill-current" />
                            Run Audit Benchmark
                          </button>
                        )}
                        {study.links?.live && (
                          <a
                            href={study.links.live}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 border border-[var(--color-ink)] bg-[var(--color-ink)] px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-[var(--color-paper)] hover:bg-[var(--color-signal)] hover:border-[var(--color-signal)] transition-colors"
                          >
                            Live App
                            <ArrowUpRight className="h-3 w-3" />
                          </a>
                        )}
                        {study.links?.repo && (
                          <a
                            href={study.links.repo}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 border border-[var(--color-ink)] bg-[var(--color-paper)] px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)] transition-colors"
                          >
                            GitHub Repo
                            <ArrowUpRight className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-[var(--color-paper)] p-4 border border-[var(--color-hairline)]">
                        <div className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink-muted)] mb-1.5">
                          Problem
                        </div>
                        <p className="text-sm leading-relaxed text-[var(--color-ink)]">
                          {study.problem}
                        </p>
                      </div>
                      <div className="bg-[var(--color-paper)] p-4 border border-[var(--color-hairline)]">
                        <div className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink-muted)] mb-1.5">
                          Execution
                        </div>
                        <p className="text-sm leading-relaxed text-[var(--color-ink)]">
                          {study.execution}
                        </p>
                      </div>
                    </div>

                    {/* Inline 9:16 Video Playback Strip for Hackerlily HipSurfer */}
                    {study.id === "hackerlily-hipsurfer" && (
                      <div className="border border-[var(--color-ink)] bg-[var(--color-cinema)] p-4 text-[var(--color-cinema-text)]">
                        <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider mb-3">
                          <span>INLINE 9:16 AD PLAYBACK (3 FEATURED CUTS)</span>
                          <span className="text-[var(--color-cinema-muted)]">
                            UNMUTE OR EXPAND IN PLAYER CONTROLS
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {[
                            {
                              src: "/videos/hipsurfer-01.mp4",
                              poster: "/videos/hipsurfer-01-poster.jpg",
                              label: "01 // Skeptic UGC (0:20)",
                            },
                            {
                              src: "/videos/hipsurfer-02.mp4",
                              poster: "/videos/hipsurfer-02-poster.jpg",
                              label: "02 // Competitor Switcher (0:20)",
                            },
                            {
                              src: "/videos/hipsurfer-03.mp4",
                              poster: "/videos/hipsurfer-03-poster.jpg",
                              label: "03 // Minimalist Aesthetic (0:18)",
                            },
                          ].map((vid) => (
                            <div
                              key={vid.src}
                              className="border border-[var(--color-cinema-border)] bg-[var(--color-cinema-alt)]"
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
                              <div className="border-t border-[var(--color-cinema-border)] px-2.5 py-1.5 font-mono text-[10px]">
                                {vid.label}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Inline 16:9 Demo Video Playback for HusAI */}
                    {study.id === "husai" && (
                      <div className="border border-[var(--color-ink)] bg-[var(--color-cinema)] p-4 text-[var(--color-cinema-text)]">
                        <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider mb-3">
                          <span>HUSAI 60-SECOND PRODUCT REVEAL (REMOTION BUILD)</span>
                          <span className="text-[var(--color-cinema-muted)]">
                            1920×1080 · H.264
                          </span>
                        </div>
                        <video
                          src="/husai/husai-demo.mp4"
                          poster="/husai/husai-poster.jpg"
                          controls
                          playsInline
                          preload="metadata"
                          className="aspect-video w-full border border-[var(--color-cinema-border)] bg-[var(--color-cinema)]"
                        />
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1.5">
                      {study.stack.map((tag) => (
                        <span
                          key={tag}
                          className="border border-[var(--color-hairline)] bg-[var(--color-paper)] px-2.5 py-1 font-mono text-[11px] text-[var(--color-ink-muted)]"
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
      </div>

      {/* Dennis Snellenberg Floating Cursor-Tracked Media Preview Window (Desktop lg+) */}
      <div
        ref={previewRef}
        aria-hidden="true"
        className={`hidden lg:block pointer-events-none fixed top-0 left-0 z-40 w-[300px] border border-[var(--color-ink)] bg-[var(--color-cinema)] text-[var(--color-cinema-text)] transition-opacity duration-200 ${
          hoveredStudy && !expandedId ? "opacity-100" : "opacity-0"
        }`}
      >
        {hoveredStudy && (
          <div>
            <div className="flex items-center justify-between border-b border-[var(--color-cinema-border)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider">
              <span className="text-[var(--color-signal)]">
                {hoveredStudy.previewMedia.badge}
              </span>
              <span className="tabular-nums text-[var(--color-cinema-muted)]">
                INDEX {hoveredStudy.index}
              </span>
            </div>

            {hoveredStudy.previewMedia.type === "video" &&
              hoveredStudy.previewMedia.src && (
                <div className="aspect-[16/10] w-full overflow-hidden bg-[var(--color-cinema-alt)]">
                  <video
                    key={hoveredStudy.previewMedia.src}
                    src={hoveredStudy.previewMedia.src}
                    poster={hoveredStudy.previewMedia.poster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

            {hoveredStudy.previewMedia.type === "image" &&
              hoveredStudy.previewMedia.src && (
                <div className="aspect-[16/10] w-full overflow-hidden bg-[var(--color-cinema-alt)]">
                  <img
                    src={hoveredStudy.previewMedia.src}
                    alt={hoveredStudy.title}
                    className="h-full w-full object-cover object-top"
                  />
                </div>
              )}

            {hoveredStudy.previewMedia.type === "telemetry" && (
              <div className="p-4 bg-[var(--color-cinema-alt)] space-y-2">
                <div className="font-mono text-2xl font-semibold tabular-nums text-[var(--color-cinema-text)]">
                  {hoveredStudy.primaryMetric}
                </div>
                <div className="font-mono text-xs text-[var(--color-signal)]">
                  {hoveredStudy.previewMedia.highlight}
                </div>
              </div>
            )}

            <div className="border-t border-[var(--color-cinema-border)] px-3 py-2 font-mono text-[10px] text-[var(--color-cinema-muted)] flex items-center justify-between">
              <span className="truncate">{hoveredStudy.previewMedia.sublabel}</span>
              <span className="text-[var(--color-cinema-text)] shrink-0 ml-2">
                CLICK ROW →
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
