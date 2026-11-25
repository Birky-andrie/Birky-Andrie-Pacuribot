"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Cpu, Film, Globe, Play } from "lucide-react";
import type { ProofTab } from "@/data/portfolio";

interface AppleBentoSectionProps {
  onJumpToProof: (tab: ProofTab) => void;
  onSelectService: (serviceTitle: string) => void;
}

type PillarId = "build" | "edit" | "ops";

const PIPELINE_NODES = [
  { id: "vad", label: "4.0s VAD", detail: "Web Audio Voice Trigger" },
  { id: "groq", label: "Groq AI", detail: "LLaMA 3.1 + Whisper" },
  { id: "audit", label: "<5s Audit", detail: "Pacs Role Engine (1.84s)" },
  { id: "flutter", label: "6-OS App", detail: "Financify Dart Client" },
] as const;

const AD_CUTS = [
  {
    id: "reel-01",
    label: "Skeptic UGC",
    src: "/videos/hipsurfer-01.mp4",
    poster: "/videos/hipsurfer-01-poster.jpg",
    proofTab: "hackerlily" as ProofTab,
  },
  {
    id: "reel-02",
    label: "Switcher",
    src: "/videos/hipsurfer-02.mp4",
    poster: "/videos/hipsurfer-02-poster.jpg",
    proofTab: "hackerlily" as ProofTab,
  },
  {
    id: "reel-04",
    label: "EOFY Launch",
    src: "/videos/hipsurfer-04.mp4",
    poster: "/videos/hipsurfer-04-poster.jpg",
    proofTab: "hackerlily" as ProofTab,
  },
] as const;

const SHIFT_ZONES = [
  {
    id: "au",
    city: "Sydney AU",
    overlap: "8h Full Overlap",
    tz: "Australia/Sydney",
  },
  {
    id: "de",
    city: "Berlin DE",
    overlap: "7h Direct Match",
    tz: "Europe/Berlin",
  },
  {
    id: "uk",
    city: "London UK",
    overlap: "6h Morning Overlap",
    tz: "Europe/London",
  },
  {
    id: "us",
    city: "New York US",
    overlap: "Flexible Night Shift",
    tz: "America/New_York",
  },
] as const;

const WAVE_BARS = [36, 78, 54, 96, 62, 88, 44, 100, 70, 86, 50, 92];

export function AppleBentoSection({
  onJumpToProof,
  onSelectService,
}: AppleBentoSectionProps) {
  const [activePillar, setActivePillar] = useState<PillarId>("build");
  const [activeNodeIdx, setActiveNodeIdx] = useState(0);
  const [fastAuditMode, setFastAuditMode] = useState(true);
  const [activeAdIdx, setActiveAdIdx] = useState(0);
  const [activeBeatIdx, setActiveBeatIdx] = useState(3);
  const [activeZoneIdx, setActiveZoneIdx] = useState(1); // Berlin DE default
  const [zoneTimeStr, setZoneTimeStr] = useState("--:--");
  const [manilaTimeStr, setManilaTimeStr] = useState("--:--");

  // Auto-pulse active pipeline node subtly
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveNodeIdx((i) => (i + 1) % PIPELINE_NODES.length);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  // Update live global clocks
  useEffect(() => {
    const refreshClocks = () => {
      try {
        const now = new Date();
        setManilaTimeStr(
          new Intl.DateTimeFormat("en-US", {
            timeZone: "Asia/Manila",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }).format(now)
        );
        const tz = SHIFT_ZONES[activeZoneIdx].tz;
        setZoneTimeStr(
          new Intl.DateTimeFormat("en-US", {
            timeZone: tz,
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }).format(now)
        );
      } catch {
        // ignore intl errors
      }
    };
    refreshClocks();
    const timer = setInterval(refreshClocks, 15000);
    return () => clearInterval(timer);
  }, [activeZoneIdx]);

  const currentAd = AD_CUTS[activeAdIdx];
  const currentZone = SHIFT_ZONES[activeZoneIdx];

  return (
    <section
      id="services"
      className="theme-surface bg-[var(--color-paper)] text-[var(--color-ink)] pt-16 pb-24 sm:pt-24 sm:pb-32"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-12">
        {/* Clean Minimal Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-10">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-5xl font-semibold tracking-[-0.03em] text-[var(--color-ink)]">
              What I do. What shipped.
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--color-ink-muted)]">
            Hover or tap any panel to interact live
          </p>
        </div>

        {/* 3 Interactive Hover-Expand Vertical Motion Panels */}
        <div className="flex flex-col lg:flex-row gap-4 min-h-[480px]">
          {/* ==============================================================
              PILLAR 01: SOFTWARE & AI
             ============================================================== */}
          <article
            onMouseEnter={() => setActivePillar("build")}
            onClick={() => setActivePillar("build")}
            className={`relative overflow-hidden rounded-[28px] border border-[var(--color-hairline)] bg-[var(--color-paper-alt)] p-6 sm:p-7 flex flex-col justify-between gap-6 cursor-pointer transition-all duration-700 ease-out-expo shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] ${
              activePillar === "build" ? "lg:flex-[2.2]" : "lg:flex-1"
            }`}
          >
            <div className="flex items-center justify-between gap-2 min-w-0">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-hairline)] bg-[var(--color-paper)] px-3 py-1 text-xs font-medium whitespace-nowrap min-w-0 truncate text-[var(--color-ink)]">
                <Cpu className="h-3.5 w-3.5 text-[#455CE9] shrink-0" />
                <span className="truncate">Software &amp; AI</span>
              </span>
              <span className="font-mono text-xs font-semibold tabular-nums whitespace-nowrap shrink-0 text-[#455CE9]">
                &lt; 5s
              </span>
            </div>

            {/* Interactive Pipeline + Speed Comparison Motion Graphic */}
            <div className="space-y-4 my-auto">
              <div
                className={`grid gap-2 ${
                  activePillar === "build"
                    ? "grid-cols-2 sm:grid-cols-4"
                    : "grid-cols-2"
                }`}
              >
                {PIPELINE_NODES.map((node, idx) => {
                  const active = activeNodeIdx === idx;
                  return (
                    <button
                      key={node.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveNodeIdx(idx);
                      }}
                      className={`rounded-2xl border p-2.5 sm:p-3 text-left transition-all duration-300 cursor-pointer ${
                        active
                          ? "border-[#455CE9] bg-[#455CE9] text-white shadow-[0_0_24px_rgba(69,92,233,0.35)] -translate-y-0.5"
                          : "border-[var(--color-hairline)] bg-[var(--color-paper)] text-[var(--color-ink)] hover:border-[#455CE9]/50"
                      }`}
                    >
                      <div className="font-mono text-xs font-semibold tabular-nums whitespace-nowrap">
                        {node.label}
                      </div>
                      <div
                        className={`mt-0.5 text-[10px] leading-tight truncate ${
                          active
                            ? "text-white/85"
                            : "text-[var(--color-ink-muted)]"
                        }`}
                      >
                        {node.detail}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Interactive Latency Toggle */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setFastAuditMode((v) => !v);
                }}
                className="rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-paper)] p-3.5 sm:p-4 space-y-2 hover:border-[#455CE9]/50 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 font-mono text-[10px] sm:text-[11px]">
                  <span className="text-[#455CE9] font-semibold whitespace-nowrap">
                    {fastAuditMode ? "WEB AUDIT" : "EXCEL SHEET"}
                  </span>
                  <span className="tabular-nums font-semibold whitespace-nowrap text-[var(--color-ink)]">
                    {fastAuditMode ? "1.84s (<5s SLA)" : "~20m 00s"}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-[var(--color-paper-alt)] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      fastAuditMode
                        ? "w-[12%] bg-[#455CE9]"
                        : "w-full bg-[var(--color-ink-muted)]/40"
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="font-[family-name:var(--font-display)] text-lg sm:text-xl font-medium leading-snug text-[var(--color-ink)]">
                Built HusAI (real-time AI call coach), Pacs Builders (&lt;5s web
                audit), &amp; Financify (6-OS Flutter).
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onJumpToProof("husai");
                }}
                className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-[#455CE9] hover:underline cursor-pointer"
              >
                <span>Open live demos</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </article>

          {/* ==============================================================
              PILLAR 02: PAID VIDEO ADS
             ============================================================== */}
          <article
            onMouseEnter={() => setActivePillar("edit")}
            onClick={() => setActivePillar("edit")}
            className={`relative overflow-hidden rounded-[28px] border border-[var(--color-hairline)] bg-[var(--color-paper-alt)] p-6 sm:p-7 flex flex-col justify-between gap-6 cursor-pointer transition-all duration-700 ease-out-expo shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] ${
              activePillar === "edit" ? "lg:flex-[2.2]" : "lg:flex-1"
            }`}
          >
            <div className="flex items-center justify-between gap-2 min-w-0">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-hairline)] bg-[var(--color-paper)] px-3 py-1 text-xs font-medium whitespace-nowrap min-w-0 truncate text-[var(--color-ink)]">
                <Film className="h-3.5 w-3.5 text-[#455CE9] shrink-0" />
                <span className="truncate">Paid Video Ads</span>
              </span>
              <span className="font-mono text-xs font-semibold tabular-nums whitespace-nowrap shrink-0 text-[#455CE9]">
                45+ Cuts
              </span>
            </div>

            {/* Interactive 9:16 Mini Reel + Beat-Synced Waveform Scrubber */}
            <div
              className={`my-auto grid gap-3 items-center ${
                activePillar === "edit" ? "grid-cols-12" : "grid-cols-1"
              }`}
            >
              <div
                className={`relative overflow-hidden rounded-2xl border border-[var(--color-hairline)] bg-black ${
                  activePillar === "edit"
                    ? "col-span-5 aspect-[9/14]"
                    : "h-36 w-full"
                }`}
              >
                <video
                  key={currentAd.src}
                  src={currentAd.src}
                  poster={currentAd.poster}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute bottom-2 left-2 rounded-full bg-black/70 px-2 py-0.5 font-mono text-[9px] text-white uppercase">
                  9:16 LIVE
                </div>
              </div>

              <div
                className={`space-y-2.5 ${
                  activePillar === "edit" ? "col-span-7" : ""
                }`}
              >
                <div className="flex flex-wrap gap-1.5">
                  {AD_CUTS.map((cut, i) => {
                    const active = activeAdIdx === i;
                    return (
                      <button
                        key={cut.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveAdIdx(i);
                        }}
                        className={`rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer ${
                          active
                            ? "bg-[#455CE9] text-white"
                            : "border border-[var(--color-hairline)] bg-[var(--color-paper)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                        }`}
                      >
                        {cut.label}
                      </button>
                    );
                  })}
                </div>

                {/* Clickable Beat-Synced Audio Scrubber */}
                <div className="rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-paper)] p-3">
                  <div className="flex items-end gap-1 h-10">
                    {WAVE_BARS.map((h, i) => (
                      <button
                        key={i}
                        type="button"
                        aria-label={`Jump waveform beat ${i + 1}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveBeatIdx(i);
                        }}
                        style={{ height: `${h}%` }}
                        className={`flex-1 rounded-full transition-all duration-200 cursor-pointer ${
                          i <= activeBeatIdx
                            ? "bg-[#455CE9]"
                            : "bg-[var(--color-ink-muted)]/30 hover:bg-[#455CE9]/60"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="font-[family-name:var(--font-display)] text-lg sm:text-xl font-medium leading-snug text-[var(--color-ink)]">
                Edited 45+ paid 9:16 Meta, TikTok &amp; Pinterest video ads for
                Hackerlily Germany.
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onJumpToProof("hackerlily");
                }}
                className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-[#455CE9] hover:underline cursor-pointer"
              >
                <Play className="h-3 w-3 fill-current" />
                <span>Watch 6 reels</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </article>

          {/* ==============================================================
              PILLAR 03: REMOTE OPS & SMM
             ============================================================== */}
          <article
            onMouseEnter={() => setActivePillar("ops")}
            onClick={() => setActivePillar("ops")}
            className={`relative overflow-hidden rounded-[28px] border border-[var(--color-hairline)] bg-[var(--color-paper-alt)] p-6 sm:p-7 flex flex-col justify-between gap-6 cursor-pointer transition-all duration-700 ease-out-expo shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] ${
              activePillar === "ops" ? "lg:flex-[2.2]" : "lg:flex-1"
            }`}
          >
            <div className="flex items-center justify-between gap-2 min-w-0">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-hairline)] bg-[var(--color-paper)] px-3 py-1 text-xs font-medium whitespace-nowrap min-w-0 truncate text-[var(--color-ink)]">
                <Globe className="h-3.5 w-3.5 text-[#455CE9] shrink-0" />
                <span className="truncate">Remote Ops &amp; SMM</span>
              </span>
              <span className="font-mono text-[11px] uppercase tracking-wider whitespace-nowrap shrink-0 text-emerald-500 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                UTC+8
              </span>
            </div>

            {/* Interactive Live Global Clock & Overlap Matrix */}
            <div className="my-auto space-y-3">
              <div className="rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-paper)] p-3.5 sm:p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-mono text-[9.5px] uppercase tracking-wider text-[var(--color-ink-muted)] whitespace-nowrap">
                    MY DESK (UTC+8)
                  </div>
                  <div
                    className={`font-mono font-semibold tabular-nums whitespace-nowrap text-[var(--color-ink)] ${
                      activePillar === "ops"
                        ? "text-base sm:text-lg"
                        : "text-xs sm:text-sm"
                    }`}
                  >
                    {manilaTimeStr}
                  </div>
                </div>
                <div className="text-right min-w-0">
                  <div className="font-mono text-[9.5px] uppercase tracking-wider text-[#455CE9] whitespace-nowrap">
                    {currentZone.city}
                  </div>
                  <div
                    className={`font-mono font-semibold tabular-nums whitespace-nowrap text-[var(--color-ink)] ${
                      activePillar === "ops"
                        ? "text-base sm:text-lg"
                        : "text-xs sm:text-sm"
                    }`}
                  >
                    {zoneTimeStr}
                  </div>
                  <div className="font-mono text-[9.5px] text-emerald-500 whitespace-nowrap truncate">
                    {currentZone.overlap}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {SHIFT_ZONES.map((z, i) => {
                  const active = activeZoneIdx === i;
                  return (
                    <button
                      key={z.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveZoneIdx(i);
                      }}
                      className={`rounded-xl border px-2.5 py-2 text-left font-mono text-[10px] sm:text-[11px] whitespace-nowrap truncate transition-colors cursor-pointer ${
                        active
                          ? "border-[#455CE9] bg-[#455CE9] text-white"
                          : "border-[var(--color-hairline)] bg-[var(--color-paper)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                      }`}
                    >
                      {z.city}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <p className="font-[family-name:var(--font-display)] text-lg sm:text-xl font-medium leading-snug text-[var(--color-ink)]">
                Managed executive ops, ClickUp sprints &amp; multi-platform SMM
                &mdash; Alpha VA Certified.
              </p>
              <a
                href="#contact"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectService("Technical VA & Executive Remote Operations");
                }}
                className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-[#455CE9] hover:underline"
              >
                <span>Start a sprint</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
