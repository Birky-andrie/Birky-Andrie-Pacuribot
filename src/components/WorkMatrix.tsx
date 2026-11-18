"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Play } from "lucide-react";
import {
  CASE_STUDIES,
  type CaseStudy,
  type ProofTab,
  type WorkCategory,
} from "@/data/portfolio";

const FILTERS: { id: WorkCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "engineering", label: "Engineering" },
  { id: "creative", label: "Creative" },
  { id: "leadership", label: "Leadership" },
  { id: "github", label: "GitHub" },
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

  // Dennis Snellenberg 340x340 cursor-centered floating preview + centered #455CE9 "View" circle
  const previewRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (externalFilter) {
      setActiveFilter(externalFilter);
    }
  }, [externalFilter]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!previewRef.current) return;
    const clientX = e.clientX;
    const clientY = e.clientY;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (!previewRef.current) return;
      const x = clientX - 170;
      const y = clientY - 170;
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
      className="bg-white text-[#1C1D20] pb-24 sm:pb-32 relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoveredStudy(null)}
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-12">
        {/* Eyebrow + Filter Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-[#999D9E]">
            Recent Work
          </p>

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
                  onClick={() => setActiveFilter(filter.id)}
                  className={`rounded-full px-4 py-1.5 text-xs font-normal transition-colors cursor-pointer border ${
                    isActive
                      ? "border-[#1C1D20] bg-[#1C1D20] text-white"
                      : "border-[#E2E3E7] bg-white text-[#1C1D20]/70 hover:border-[#1C1D20] hover:text-[#1C1D20]"
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
        <div className="border-t border-[#E2E3E7] divide-y divide-[#E2E3E7] border-b">
          {filtered.map((study) => {
            const isExpanded = expandedId === study.id;

            return (
              <article
                key={study.id}
                onMouseEnter={() => setHoveredStudy(study)}
                className="group transition-colors"
              >
                <div
                  onClick={() =>
                    setExpandedId(isExpanded ? null : study.id)
                  }
                  className="py-9 sm:py-12 px-2 sm:px-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Giant Project Title (slides left/fades slightly on hover like Dennis's rows) */}
                  <h3 className="text-3xl sm:text-5xl lg:text-[3.6rem] font-normal tracking-[-0.025em] text-[#1C1D20] transition-all duration-300 ease-out-expo group-hover:-translate-x-2 group-hover:opacity-45">
                    {study.title.split(" — ")[0]}
                  </h3>

                  {/* Right Side: Role & Metric (slides right slightly on hover) */}
                  <div className="flex items-center justify-between md:justify-end gap-6 transition-all duration-300 ease-out-expo group-hover:translate-x-2">
                    <div className="text-sm sm:text-base font-normal text-[#1C1D20]/80">
                      {study.role.split(" — ")[0]}
                    </div>
                    <div className="font-mono text-xs sm:text-sm px-3 py-1 rounded-full bg-[#F4F4F6] text-[#1C1D20] tabular-nums">
                      {study.primaryMetric} · {study.primaryMetricLabel}
                    </div>
                  </div>
                </div>

                {/* Expanded Case Study Drawer + Live Inline Video Players */}
                {isExpanded && (
                  <div
                    onMouseEnter={() => setHoveredStudy(null)}
                    className="px-4 sm:px-8 pb-10 pt-6 space-y-6 border-t border-[#E2E3E7] bg-[#F4F4F6]/60"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <div className="font-mono text-xs uppercase tracking-wider text-[#455CE9]">
                          {study.code} // {study.clientOrContext} ({study.period})
                        </div>
                        <p className="mt-1 max-w-3xl text-base sm:text-lg leading-relaxed text-[#1C1D20] font-medium">
                          {study.impact}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {study.id === "husai" && (
                          <button
                            type="button"
                            onClick={() => onJumpToProof("husai")}
                            className="inline-flex items-center gap-1.5 rounded-full bg-[#455CE9] hover:bg-[#334BD3] px-4 py-2 font-mono text-xs uppercase tracking-wider text-white transition-colors cursor-pointer"
                          >
                            <Play className="h-3 w-3 fill-current" />
                            Open in Proof Stage
                          </button>
                        )}
                        {study.id === "hackerlily-hipsurfer" && (
                          <button
                            type="button"
                            onClick={() => onJumpToProof("hackerlily")}
                            className="inline-flex items-center gap-1.5 rounded-full bg-[#455CE9] hover:bg-[#334BD3] px-4 py-2 font-mono text-xs uppercase tracking-wider text-white transition-colors cursor-pointer"
                          >
                            <Play className="h-3 w-3 fill-current" />
                            Open 9:16 Reels Stage
                          </button>
                        )}
                        {study.id === "pacs-builders" && (
                          <button
                            type="button"
                            onClick={() => onJumpToProof("pacs")}
                            className="inline-flex items-center gap-1.5 rounded-full bg-[#1C1D20] hover:bg-[#455CE9] px-4 py-2 font-mono text-xs uppercase tracking-wider text-white transition-colors cursor-pointer"
                          >
                            <Play className="h-3 w-3 fill-current" />
                            Run &lt;5s Audit Benchmark
                          </button>
                        )}
                        {study.links?.live && (
                          <a
                            href={study.links.live}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 rounded-full bg-[#1C1D20] hover:bg-[#455CE9] px-4 py-2 font-mono text-xs uppercase tracking-wider text-white transition-colors"
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
                            className="inline-flex items-center gap-1 rounded-full border border-[#1C1D20]/25 bg-white hover:bg-[#1C1D20] hover:text-white px-4 py-2 font-mono text-xs uppercase tracking-wider text-[#1C1D20] transition-colors"
                          >
                            GitHub
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-5 border border-[#E2E3E7]">
                        <div className="font-mono text-[11px] uppercase tracking-wider text-[#999D9E] mb-1.5">
                          The Problem
                        </div>
                        <p className="text-sm leading-relaxed text-[#1C1D20]">
                          {study.problem}
                        </p>
                      </div>
                      <div className="bg-white p-5 border border-[#E2E3E7]">
                        <div className="font-mono text-[11px] uppercase tracking-wider text-[#999D9E] mb-1.5">
                          Architecture &amp; Execution
                        </div>
                        <p className="text-sm leading-relaxed text-[#1C1D20]">
                          {study.execution}
                        </p>
                      </div>
                    </div>

                    {/* Inline 9:16 Video Playback Strip for Hackerlily HipSurfer */}
                    {study.id === "hackerlily-hipsurfer" && (
                      <div className="bg-[#1C1D20] p-5 text-white">
                        <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider mb-4">
                          <span>INLINE 9:16 AD PLAYBACK (3 FEATURED CUTS)</span>
                          <span className="text-[#999D9E]">
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
                              className="border border-white/15 bg-[#141517]"
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
                              <div className="border-t border-white/15 px-3 py-2 font-mono text-[10px]">
                                {vid.label}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Inline 16:9 Demo Video Playback for HusAI */}
                    {study.id === "husai" && (
                      <div className="bg-[#1C1D20] p-5 text-white">
                        <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider mb-3">
                          <span>HUSAI 60-SECOND PRODUCT REVEAL (REMOTION BUILD)</span>
                          <span className="text-[#999D9E]">1920×1080 · H.264</span>
                        </div>
                        <video
                          src="/husai/husai-demo.mp4"
                          poster="/husai/husai-poster.jpg"
                          controls
                          playsInline
                          preload="metadata"
                          className="aspect-video w-full border border-white/15 bg-[#141517]"
                        />
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {study.stack.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-[#E2E3E7] bg-white px-3 py-1 font-mono text-[11px] text-[#1C1D20]/75"
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

        {/* Dennis Snellenberg Centered Rounded Pill CTA Below Recent Work */}
        <div className="mt-14 flex justify-center">
          <a
            href="#proof-lab"
            className="inline-flex items-center gap-2 rounded-full border border-[#1C1D20]/20 bg-white hover:bg-[#455CE9] hover:border-[#455CE9] hover:text-white px-9 py-4 text-sm sm:text-base font-normal text-[#1C1D20] transition-colors duration-300"
          >
            <span>Explore Live Proof Stage</span>
            <sup className="font-mono text-xs opacity-75">
              {CASE_STUDIES.length}
            </sup>
          </a>
        </div>
      </div>

      {/* Dennis Snellenberg 340x340 Square Cursor-Tracked Preview Box + Centered Blue "View" Circle */}
      <div
        ref={previewRef}
        aria-hidden="true"
        className={`hidden lg:flex pointer-events-none fixed top-0 left-0 z-40 h-[340px] w-[340px] bg-[#1C1D20] p-6 items-center justify-center transition-transform duration-150 ease-out ${
          hoveredStudy && !expandedId ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
      >
        {hoveredStudy && (
          <div className="relative h-full w-full overflow-hidden bg-[#141517] flex items-center justify-center">
            {hoveredStudy.previewMedia.type === "video" &&
              hoveredStudy.previewMedia.src && (
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
              )}

            {hoveredStudy.previewMedia.type === "image" &&
              hoveredStudy.previewMedia.src && (
                <img
                  src={hoveredStudy.previewMedia.src}
                  alt={hoveredStudy.title}
                  className="h-full w-full object-cover object-top"
                />
              )}

            {hoveredStudy.previewMedia.type === "telemetry" && (
              <div className="p-6 text-center space-y-2 text-white">
                <div className="font-mono text-[10px] uppercase tracking-widest text-[#999D9E]">
                  {hoveredStudy.previewMedia.badge}
                </div>
                <div className="font-mono text-4xl font-semibold tabular-nums">
                  {hoveredStudy.primaryMetric}
                </div>
                <div className="text-xs text-white/80">
                  {hoveredStudy.previewMedia.highlight}
                </div>
              </div>
            )}

            {/* Signature Centered #455CE9 Blue "View" Cursor Circle */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-20 w-20 rounded-full bg-[#455CE9] text-white flex items-center justify-center text-sm font-medium shadow-md">
                View
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
