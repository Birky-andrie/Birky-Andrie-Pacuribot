"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Check,
  Copy,
  Maximize2,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";
import type { ProofTab } from "@/data/portfolio";

type HusaiMediaTab = "video" | "hero" | "solution" | "practice";

const HUSAI_TRANSCRIPT = [
  {
    speaker: "CLIENT",
    time: "2:14 PM",
    text: "Hey, just checking in — are we still on track for the Friday deadline?",
  },
  {
    speaker: "YOU (VA)",
    time: "2:14 PM",
    text: "Hi! So I checked the file, and there were some things…",
  },
  {
    speaker: "CLIENT",
    time: "2:15 PM",
    text: "Sorry — so is it done, or not?",
  },
] as const;

const HUSAI_LIFELINE_BULLETS = [
  "Just to confirm, you would like this done by Friday, correct?",
  "Shall I walk you through the next steps now?",
  "To summarize: I will send the report and follow up tomorrow.",
] as const;

const HUSAI_SCORES = [
  { label: "Confidence", value: 62 },
  { label: "Clarity", value: 70 },
  { label: "Conciseness", value: 66 },
  { label: "Professionalism", value: 78 },
] as const;

const HUSAI_OVERALL_SCORE = 69;

const HUSAI_INSIGHTS = [
  {
    pattern: "Excessive apologizing",
    evidence: "Sorry po, sorry, I will check again, so sorry for that.",
    explanation: "One clear apology plus a fix is stronger than repeating it.",
  },
  {
    pattern: "Burying the main point",
    evidence:
      "So I checked the file, and there were some things… anyway the report is actually done.",
    explanation: "Lead with the headline, then add detail.",
  },
] as const;

const HUSAI_MEDIA_ITEMS: {
  id: HusaiMediaTab;
  label: string;
  caption: string;
  src: string;
}[] = [
  {
    id: "video",
    label: "60S REMOTION DEMO",
    caption:
      "Code-driven 60s Remotion product reveal rendered for USTP CET Startup Incubation Demo Day.",
    src: "/husai/husai-demo.mp4",
  },
  {
    id: "hero",
    label: "LOCALHOST // HERO",
    caption:
      "Live capture from http://localhost:5173 — Listen, Coach, and Train architecture overview.",
    src: "/husai/screen-hero.png",
  },
  {
    id: "solution",
    label: "LOCALHOST // LIFELINE",
    caption:
      "Live capture from http://localhost:5173 — Floating coach card detecting hesitation in real time.",
    src: "/husai/screen-solution.png",
  },
  {
    id: "practice",
    label: "LOCALHOST // PRACTICE",
    caption:
      "Live capture from http://localhost:5173 — Targeted AI roleplay generated from post-call weaknesses.",
    src: "/husai/screen-practice.png",
  },
];

interface HipSurferReel {
  id: string;
  code: string;
  title: string;
  angle: string;
  duration: string;
  platform: string;
  videoSrc: string;
  posterSrc: string;
  hookText: string;
  editBreakdown: string;
}

const HIPSURFER_REELS: HipSurferReel[] = [
  {
    id: "reel-01",
    code: "REEL-01",
    title: "Skeptic UGC — Cart Conversion",
    angle: "Social Proof / Impulse Hook",
    duration: "0:20",
    platform: "Meta & TikTok Paid",
    videoSrc: "/videos/hipsurfer-01.mp4",
    posterSrc: "/videos/hipsurfer-01-poster.jpg",
    hookText: '"Woke up with one in my cart. Zero regrets."',
    editBreakdown:
      "Minimalist centered stroke typography optimized for sound-off mobile scrollers, transitioning from mirror-selfie hook into rapid hands-free toddler carry proof.",
  },
  {
    id: "reel-02",
    code: "REEL-02",
    title: "Competitor Switcher — Travel Cut",
    angle: "Contrarian Hook / Ergonomic Proof",
    duration: "0:20",
    platform: "IG Reels & Meta",
    videoSrc: "/videos/hipsurfer-02.mp4",
    posterSrc: "/videos/hipsurfer-02-poster.jpg",
    hookText: '"Sure, get the cheap one."',
    editBreakdown:
      "High-contrast pattern-interrupt hook set in a busy travel arcade, contrasting flimsy knockoffs against HipSurfer's weight-distributing waistband.",
  },
  {
    id: "reel-03",
    code: "REEL-03",
    title: "Minimalist Aesthetic — Lifestyle Cut",
    angle: "Visual-First / Zero-Clutter Pacing",
    duration: "0:18",
    platform: "Pinterest & IG Organic/Paid",
    videoSrc: "/videos/hipsurfer-03.mp4",
    posterSrc: "/videos/hipsurfer-03-poster.jpg",
    hookText: "Clean visual-first café & daily carry showcase",
    editBreakdown:
      "Beat-synced lifestyle edit highlighting colorway texture, buckle hardware, and effortless bottle-feeding posture without heavy text clutter.",
  },
];

const AUDIT_ROWS = [
  {
    txId: "TX-9041",
    item: "Portland Cement (40kg)",
    site: "Zone B Foundation",
    role: "Staff -> Auditor",
    delta: "-140 bags",
    status: "VERIFIED",
  },
  {
    txId: "TX-9042",
    item: "Deformed Steel Bar 16mm",
    site: "Pier 04 Rebar",
    role: "Admin Override",
    delta: "+320 pcs",
    status: "VERIFIED",
  },
  {
    txId: "TX-9043",
    item: 'Marine Plywood 3/4"',
    site: "Formwork North",
    role: "Staff Entry",
    delta: "-45 sheets",
    status: "FLAGGED: COUNT MISMATCH",
  },
  {
    txId: "TX-9044",
    item: "Ready-Mix Concrete 3000psi",
    site: "Slab Pour L2",
    role: "Auditor Signed",
    delta: "+24 cu.m",
    status: "VERIFIED",
  },
];

const STAGE_CARDS: {
  id: ProofTab;
  number: string;
  title: string;
  subtitle: string;
  metric: string;
}[] = [
  {
    id: "husai",
    number: "01",
    title: "HusAI — Live AI Call Coach",
    subtitle: "60s Remotion Demo + Localhost :5173 Captures",
    metric: "4.0s VAD // 69/100 REVIEW",
  },
  {
    id: "hackerlily",
    number: "02",
    title: "Hackerlily HipSurfer — 9:16 Ad Reels",
    subtitle: "3 Autoplaying Direct-Response & Minimalist Cuts",
    metric: "3 LIVE MP4 CUTS",
  },
  {
    id: "pacs",
    number: "03",
    title: "Pacs Builders — Material Audit Engine",
    subtitle: "Manual Excel (~20m) vs. Role-Based Web App",
    metric: "< 5.0S AUDIT SLA",
  },
];

interface InteractiveProofsProps {
  activeTab: ProofTab;
  onChangeTab: (tab: ProofTab) => void;
}

export function InteractiveProofs({
  activeTab,
  onChangeTab,
}: InteractiveProofsProps) {
  // HusAI state
  const [husaiMedia, setHusaiMedia] = useState<HusaiMediaTab>("video");
  const [simState, setSimState] = useState<"listening" | "ready">("ready");
  const [elapsedMs, setElapsedMs] = useState(4000);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  // Pacs Builders state
  const [auditMode, setAuditMode] = useState<"excel" | "web">("web");
  const [runningAudit, setRunningAudit] = useState(false);
  const [auditLatency, setAuditLatency] = useState("1.84s");

  // HipSurfer video reel playback state
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const [playingMap, setPlayingMap] = useState<Record<string, boolean>>({
    "reel-01": true,
    "reel-02": true,
    "reel-03": true,
  });
  const [unmutedReelId, setUnmutedReelId] = useState<string | null>(null);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({
    "reel-01": 0,
    "reel-02": 0,
    "reel-03": 0,
  });

  useEffect(() => {
    if (activeTab !== "hackerlily") return;
    HIPSURFER_REELS.forEach((reel) => {
      const el = videoRefs.current[reel.id];
      if (el) {
        el.muted = unmutedReelId !== reel.id;
        el.play()
          .then(() => {
            setPlayingMap((prev) => ({ ...prev, [reel.id]: true }));
          })
          .catch(() => {
            setPlayingMap((prev) => ({ ...prev, [reel.id]: false }));
          });
      }
    });
  }, [activeTab, unmutedReelId]);

  useEffect(() => {
    if (simState !== "listening") return;
    const start = Date.now();
    const interval = setInterval(() => {
      const diff = Date.now() - start;
      if (diff >= 1600) {
        setElapsedMs(4000);
        setSimState("ready");
        clearInterval(interval);
      } else {
        setElapsedMs(Math.min(4000, Math.round((diff / 1600) * 4000)));
      }
    }, 50);
    return () => clearInterval(interval);
  }, [simState]);

  const triggerLifeline = () => {
    setElapsedMs(0);
    setSimState("listening");
  };

  const triggerAuditBenchmark = () => {
    setRunningAudit(true);
    setTimeout(() => {
      const simulated = (1.4 + Math.random() * 1.8).toFixed(2);
      setAuditLatency(`${simulated}s`);
      setRunningAudit(false);
    }, 350);
  };

  const togglePlayReel = (id: string) => {
    const target = videoRefs.current[id];
    if (!target) return;

    if (!target.paused) {
      target.pause();
      setPlayingMap((prev) => ({ ...prev, [id]: false }));
    } else {
      target
        .play()
        .then(() => setPlayingMap((prev) => ({ ...prev, [id]: true })))
        .catch(() => setPlayingMap((prev) => ({ ...prev, [id]: false })));
    }
  };

  const toggleAudioReel = (id: string) => {
    const nextUnmuted = unmutedReelId === id ? null : id;
    setUnmutedReelId(nextUnmuted);

    Object.entries(videoRefs.current).forEach(([reelId, el]) => {
      if (!el) return;
      const shouldMute = reelId !== nextUnmuted;
      el.muted = shouldMute;
      if (!shouldMute && el.paused) {
        el.play().catch(() => {});
      }
    });
  };

  const handleSeekReel = (
    id: string,
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const target = videoRefs.current[id];
    if (!target || !target.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    target.currentTime = ratio * target.duration;
    setProgressMap((prev) => ({ ...prev, [id]: ratio * 100 }));
  };

  const handleFullscreen = (id: string) => {
    const target = videoRefs.current[id];
    if (!target) return;
    if (target.requestFullscreen) {
      target.requestFullscreen().catch(() => {});
    }
  };

  const currentHusaiMedia =
    HUSAI_MEDIA_ITEMS.find((m) => m.id === husaiMedia) || HUSAI_MEDIA_ITEMS[0];

  return (
    <section
      id="proof-lab"
      className="border-b border-[var(--color-ink)] bg-[var(--color-cinema)] text-[var(--color-cinema-text)]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[var(--color-cinema-border)]">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-signal)]">
              02 // Dark Cinema Proof Stage
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-[var(--color-cinema-text)]">
              Live systems, localhost captures, and 9:16 reels.
            </h2>
          </div>
          <p className="max-w-md text-sm text-[var(--color-cinema-muted)]">
            Select any of the three proof systems below—inspect HusAI&apos;s live 60s Remotion reveal and localhost UI, watch the 3 HipSurfer 9:16 reels, or benchmark the Pacs Builders audit engine.
          </p>
        </div>

        {/* 3-Card Prominent System Selector Bar — Both HusAI and HipSurfer are always visible */}
        <div
          className="mt-8 grid grid-cols-1 md:grid-cols-3 border-t border-l border-[var(--color-cinema-border)]"
          role="tablist"
          aria-label="Select interactive proof stage"
        >
          {STAGE_CARDS.map((card) => {
            const active = activeTab === card.id;
            return (
              <button
                key={card.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onChangeTab(card.id)}
                className={`border-r border-b border-[var(--color-cinema-border)] p-5 text-left transition-colors cursor-pointer flex flex-col justify-between gap-3 ${
                  active
                    ? "bg-[var(--color-cinema-text)] text-[var(--color-cinema)]"
                    : "bg-[var(--color-cinema-alt)] text-[var(--color-cinema-text)] hover:bg-[#1E1E1C]"
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider">
                  <span
                    className={
                      active
                        ? "text-[var(--color-signal)] font-semibold"
                        : "text-[var(--color-signal)]"
                    }
                  >
                    STAGE {card.number} {active ? "// ACTIVE" : ""}
                  </span>
                  <span
                    className={`tabular-nums px-1.5 py-0.5 border ${
                      active
                        ? "border-[var(--color-cinema)]/30 text-[var(--color-cinema)]"
                        : "border-[var(--color-cinema-border)] text-[var(--color-cinema-muted)]"
                    }`}
                  >
                    {card.metric}
                  </span>
                </div>

                <div>
                  <div className="font-[family-name:var(--font-display)] text-lg sm:text-xl font-semibold">
                    {card.title}
                  </div>
                  <div
                    className={`mt-1 text-xs ${
                      active
                        ? "text-[var(--color-cinema)]/75"
                        : "text-[var(--color-cinema-muted)]"
                    }`}
                  >
                    {card.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* STAGE 01: HusAI Localhost UI Captures + Autoplaying 60s Remotion Demo + Verbatim Repo Data */}
        {activeTab === "husai" && (
          <div className="mt-6 border border-[var(--color-cinema-border)] bg-[var(--color-cinema-alt)]">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-cinema-border)] bg-[var(--color-cinema)] px-4 sm:px-6 py-3 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 bg-[var(--color-signal)]" />
                <span className="font-medium text-[var(--color-cinema-text)]">
                  HUSAI // LIVE CALL COACH FOR FILIPINO VAs
                </span>
                <span className="hidden sm:inline text-[var(--color-cinema-muted)]">
                  (60s Remotion Video Playback + Localhost :5173 Captures)
                </span>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com/Birky-andrie/HusAI"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[var(--color-cinema-muted)] hover:text-[var(--color-cinema-text)]"
                >
                  GitHub Repo
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
                <a
                  href="https://hus-ai-five.vercel.app"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[var(--color-cinema-text)] hover:text-[var(--color-signal)] underline underline-offset-4"
                >
                  Live Vercel App
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left Column: Autoplaying 60s Product Demo Video & Live Localhost Screenshots */}
              <div className="lg:col-span-7 p-6 border-b lg:border-b-0 lg:border-r border-[var(--color-cinema-border)] flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap border-t border-l border-[var(--color-cinema-border)]">
                    {HUSAI_MEDIA_ITEMS.map((item) => {
                      const active = husaiMedia === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setHusaiMedia(item.id)}
                          className={`border-r border-b border-[var(--color-cinema-border)] px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors cursor-pointer ${
                            active
                              ? "bg-[var(--color-cinema-text)] text-[var(--color-cinema)] font-semibold"
                              : "bg-[var(--color-cinema)] text-[var(--color-cinema-muted)] hover:text-[var(--color-cinema-text)]"
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* 16:9 Media Viewport — Autoplaying 60s Demo Video */}
                  <div className="border border-[var(--color-cinema-border)] bg-[var(--color-cinema)] overflow-hidden">
                    {currentHusaiMedia.id === "video" ? (
                      <video
                        key="husai-demo-video"
                        src={currentHusaiMedia.src}
                        poster="/husai/husai-poster.jpg"
                        autoPlay
                        muted
                        loop
                        controls
                        playsInline
                        preload="auto"
                        className="aspect-video w-full object-contain bg-[var(--color-cinema)]"
                      />
                    ) : (
                      <img
                        src={currentHusaiMedia.src}
                        alt={currentHusaiMedia.caption}
                        className="aspect-video w-full object-cover object-top"
                      />
                    )}
                    <div className="border-t border-[var(--color-cinema-border)] bg-[var(--color-cinema)] px-3.5 py-2 font-mono text-[11px] text-[var(--color-cinema-muted)]">
                      {currentHusaiMedia.caption}
                    </div>
                  </div>
                </div>

                {/* Verbatim Dual-Channel Live Transcript & 4.0s Web Audio VAD Trigger */}
                <div className="space-y-3 pt-4 border-t border-[var(--color-cinema-border)]">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="uppercase tracking-wider text-[var(--color-cinema-text)] font-medium">
                      Live Dual-Channel Transcript (TranscriptPanel.jsx)
                    </span>
                    <span className="tabular-nums text-[var(--color-signal)]">
                      VAD SILENCE: {(elapsedMs / 1000).toFixed(1)}s / 4.0s
                    </span>
                  </div>

                  <div className="space-y-2 border border-[var(--color-cinema-border)] bg-[var(--color-cinema)] p-3.5">
                    {HUSAI_TRANSCRIPT.map((turn, idx) => (
                      <div
                        key={idx}
                        className="font-mono text-xs flex items-baseline gap-2"
                      >
                        <span
                          className={`shrink-0 px-1.5 py-0.5 text-[10px] ${
                            turn.speaker === "CLIENT"
                              ? "bg-[var(--color-cinema-text)] text-[var(--color-cinema)]"
                              : "border border-[var(--color-cinema-border)] text-[var(--color-cinema-text)]"
                          }`}
                        >
                          {turn.speaker}
                        </span>
                        <span className="font-sans text-xs sm:text-sm text-[var(--color-cinema-text)]">
                          &ldquo;{turn.text}&rdquo;
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={triggerLifeline}
                    className="w-full inline-flex items-center justify-center gap-2 border border-[var(--color-cinema-text)] bg-[var(--color-cinema-text)] px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-[var(--color-cinema)] hover:bg-[var(--color-signal)] hover:border-[var(--color-signal)] hover:text-[var(--color-cinema-text)] transition-colors cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Trigger 4.0s Silence Detector (Web Audio VAD)
                  </button>
                </div>
              </div>

              {/* Right Column: Verbatim Lifeline Smart Replies & Post-Call Review Scores */}
              <div className="lg:col-span-5 p-6 flex flex-col justify-between gap-6">
                {/* Surface 1: LifelineCard.jsx */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="uppercase tracking-wider text-[var(--color-cinema-text)] font-medium">
                      01 // Smart Replies (LifelineCard.jsx)
                    </span>
                    <span className="text-[var(--color-signal)] tabular-nums">
                      {simState === "listening"
                        ? "LISTENING..."
                        : "llama-3.1-8b-instant"}
                    </span>
                  </div>

                  {simState === "listening" ? (
                    <div className="h-36 flex items-center justify-center border border-dashed border-[var(--color-cinema-border)] font-mono text-xs text-[var(--color-cinema-muted)]">
                      Measuring raw mic amplitude VAD (
                      {(elapsedMs / 1000).toFixed(1)}s / 4.0s)...
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {HUSAI_LIFELINE_BULLETS.map((line, i) => (
                        <div
                          key={line}
                          className="border border-[var(--color-cinema-border)] bg-[var(--color-cinema)] p-3 flex items-start justify-between gap-3"
                        >
                          <div className="space-y-1">
                            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-signal)]">
                              OPTION 0{i + 1}
                            </span>
                            <p className="text-xs sm:text-sm leading-relaxed text-[var(--color-cinema-text)]">
                              &ldquo;{line}&rdquo;
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                await navigator.clipboard.writeText(line);
                                setCopiedIdx(i);
                                setTimeout(() => setCopiedIdx(null), 1500);
                              } catch {
                                // ignore
                              }
                            }}
                            className="shrink-0 border border-[var(--color-cinema-border)] bg-[var(--color-cinema-alt)] px-2 py-1 font-mono text-[10px] text-[var(--color-cinema-muted)] hover:border-[var(--color-cinema-text)] hover:text-[var(--color-cinema-text)] cursor-pointer"
                          >
                            {copiedIdx === i ? (
                              <Check className="h-3 w-3 text-[var(--color-signal)]" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Surface 2: ReviewDashboard.jsx Verbatim Scores & Insights */}
                <div className="space-y-3 pt-4 border-t border-[var(--color-cinema-border)]">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="uppercase tracking-wider text-[var(--color-cinema-text)] font-medium">
                      02 // Call Review (ReviewDashboard.jsx)
                    </span>
                    <span className="bg-[var(--color-signal)] text-[var(--color-cinema-text)] px-2 py-0.5 tabular-nums">
                      OVERALL: {HUSAI_OVERALL_SCORE}/100
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-l border-[var(--color-cinema-border)]">
                    {HUSAI_SCORES.map((s) => (
                      <div
                        key={s.label}
                        className="border-r border-b border-[var(--color-cinema-border)] bg-[var(--color-cinema)] p-2.5"
                      >
                        <div className="font-mono text-lg font-semibold tabular-nums text-[var(--color-cinema-text)]">
                          {s.value}
                        </div>
                        <div className="font-mono text-[10px] uppercase tracking-tight text-[var(--color-cinema-muted)] truncate">
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    {HUSAI_INSIGHTS.map((insight) => (
                      <div
                        key={insight.pattern}
                        className="border border-[var(--color-cinema-border)] bg-[var(--color-cinema)] p-3 space-y-1"
                      >
                        <div className="font-mono text-[11px] font-semibold text-[var(--color-signal)] uppercase">
                          Pattern: {insight.pattern}
                        </div>
                        <p className="font-mono text-[11px] text-[var(--color-cinema-muted)]">
                          Evidence: &ldquo;{insight.evidence}&rdquo;
                        </p>
                        <p className="text-xs text-[var(--color-cinema-text)]">
                          Fix: {insight.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STAGE 02: Hackerlily HipSurfer 9:16 Real Autoplaying Video Reels */}
        {activeTab === "hackerlily" && (
          <div className="mt-6 border border-[var(--color-cinema-border)] bg-[var(--color-cinema-alt)]">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-cinema-border)] bg-[var(--color-cinema)] px-4 sm:px-6 py-3 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 bg-[var(--color-signal)]" />
                <span className="font-medium text-[var(--color-cinema-text)]">
                  HACKERLILY HIPSURFER // LIVE 9:16 VIDEO PLAYBACK (AUTOPLAYING)
                </span>
              </div>
              <span className="text-[var(--color-cinema-muted)]">
                CLICK &ldquo;SOUND ON&rdquo; TO HEAR FOLEY &amp; BEAT SYNC · SCRUB BAR TO SEEK
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-[var(--color-cinema-border)]">
              {HIPSURFER_REELS.map((reel) => {
                const isPlaying = playingMap[reel.id] ?? true;
                const isAudioOn = unmutedReelId === reel.id;
                const progress = progressMap[reel.id] ?? 0;

                return (
                  <article
                    key={reel.id}
                    className="p-5 sm:p-6 flex flex-col justify-between gap-5 bg-[var(--color-cinema-alt)]"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between font-mono text-xs">
                        <span className="text-[var(--color-signal)] font-semibold">
                          {reel.code} // {reel.duration}
                        </span>
                        <span className="border border-[var(--color-cinema-border)] bg-[var(--color-cinema)] px-2 py-0.5 text-[11px] text-[var(--color-cinema-muted)]">
                          {reel.platform}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--color-cinema-text)]">
                          {reel.title}
                        </h3>
                        <p className="mt-0.5 font-mono text-xs text-[var(--color-cinema-muted)]">
                          Angle: {reel.angle}
                        </p>
                      </div>

                      <div className="relative mx-auto w-full max-w-[285px] aspect-[9/16] border border-[var(--color-cinema-border)] bg-[var(--color-cinema)] overflow-hidden">
                        <video
                          ref={(el) => {
                            videoRefs.current[reel.id] = el;
                          }}
                          src={reel.videoSrc}
                          poster={reel.posterSrc}
                          autoPlay
                          playsInline
                          loop
                          muted={!isAudioOn}
                          preload="auto"
                          onClick={() => togglePlayReel(reel.id)}
                          onPlay={() =>
                            setPlayingMap((prev) => ({ ...prev, [reel.id]: true }))
                          }
                          onPause={() =>
                            setPlayingMap((prev) => ({ ...prev, [reel.id]: false }))
                          }
                          onTimeUpdate={(e) => {
                            const el = e.currentTarget;
                            if (el.duration) {
                              setProgressMap((prev) => ({
                                ...prev,
                                [reel.id]: (el.currentTime / el.duration) * 100,
                              }));
                            }
                          }}
                          className="h-full w-full object-cover cursor-pointer"
                        />

                        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider">
                          <span className="border border-[var(--color-cinema-text)]/30 bg-[var(--color-cinema)]/85 px-2 py-1 text-[var(--color-cinema-text)] flex items-center gap-1.5">
                            <span
                              className={`h-1.5 w-1.5 ${
                                isPlaying
                                  ? "bg-[var(--color-signal)]"
                                  : "bg-[var(--color-cinema-text)]/50"
                              }`}
                            />
                            {isPlaying ? "LIVE 9:16" : "PAUSED"}
                          </span>

                          <button
                            type="button"
                            onClick={() => toggleAudioReel(reel.id)}
                            className={`inline-flex items-center gap-1 border px-2.5 py-1 transition-colors cursor-pointer ${
                              isAudioOn
                                ? "border-[var(--color-signal)] bg-[var(--color-signal)] text-[var(--color-cinema-text)]"
                                : "border-[var(--color-cinema-text)]/40 bg-[var(--color-cinema)]/85 text-[var(--color-cinema-text)] hover:border-[var(--color-cinema-text)]"
                            }`}
                          >
                            {isAudioOn ? (
                              <>
                                <Volume2 className="h-3 w-3" />
                                <span>AUDIO ON</span>
                              </>
                            ) : (
                              <>
                                <VolumeX className="h-3 w-3" />
                                <span>SOUND ON</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div className="absolute bottom-0 inset-x-0 bg-[var(--color-cinema)]/90 border-t border-[var(--color-cinema-text)]/20">
                          <div
                            onClick={(e) => handleSeekReel(reel.id, e)}
                            className="h-2 w-full bg-[var(--color-cinema-text)]/20 cursor-pointer relative"
                            title="Click to seek video"
                          >
                            <div
                              className="h-full bg-[var(--color-signal)] transition-all duration-75"
                              style={{ width: `${progress}%` }}
                            />
                          </div>

                          <div className="flex items-center justify-between px-3 py-2 font-mono text-[11px] text-[var(--color-cinema-text)]">
                            <button
                              type="button"
                              onClick={() => togglePlayReel(reel.id)}
                              className="inline-flex items-center gap-1.5 hover:text-[var(--color-signal)] cursor-pointer"
                            >
                              {isPlaying ? (
                                <>
                                  <Pause className="h-3.5 w-3.5" />
                                  <span>PAUSE</span>
                                </>
                              ) : (
                                <>
                                  <Play className="h-3.5 w-3.5" />
                                  <span>PLAY</span>
                                </>
                              )}
                            </button>

                            <div className="flex items-center gap-3">
                              <span className="tabular-nums text-[10px] text-[var(--color-cinema-muted)]">
                                {reel.duration}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleFullscreen(reel.id)}
                                className="hover:text-[var(--color-signal)] cursor-pointer"
                                title="Fullscreen video"
                                aria-label="Fullscreen video"
                              >
                                <Maximize2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 pt-4 border-t border-[var(--color-cinema-border)]">
                      <div className="font-mono text-xs font-medium text-[var(--color-cinema-text)]">
                        Hook: {reel.hookText}
                      </div>
                      <p className="text-xs leading-relaxed text-[var(--color-cinema-muted)]">
                        {reel.editBreakdown}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* STAGE 03: Pacs Builders Audit Benchmark */}
        {activeTab === "pacs" && (
          <div className="mt-6 border border-[var(--color-cinema-border)] bg-[var(--color-cinema-alt)]">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-cinema-border)] bg-[var(--color-cinema)] px-4 sm:px-6 py-3 font-mono text-xs">
              <div>
                <span className="font-medium text-[var(--color-cinema-text)]">
                  PACS BUILDERS // MATERIAL TRACKING &amp; AUDIT ENGINE
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAuditMode("excel")}
                  className={`px-3 py-1 border font-mono text-[11px] uppercase cursor-pointer ${
                    auditMode === "excel"
                      ? "border-[var(--color-cinema-text)] bg-[var(--color-cinema-text)] text-[var(--color-cinema)]"
                      : "border-[var(--color-cinema-border)] bg-[var(--color-cinema)] text-[var(--color-cinema-muted)]"
                  }`}
                >
                  Before: Manual Excel
                </button>
                <button
                  type="button"
                  onClick={() => setAuditMode("web")}
                  className={`px-3 py-1 border font-mono text-[11px] uppercase cursor-pointer ${
                    auditMode === "web"
                      ? "border-[var(--color-signal)] bg-[var(--color-signal)] text-[var(--color-cinema-text)]"
                      : "border-[var(--color-cinema-border)] bg-[var(--color-cinema)] text-[var(--color-cinema-muted)]"
                  }`}
                >
                  After: Centralized Web App
                </button>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-4 space-y-4 border-b lg:border-b-0 lg:border-r border-[var(--color-cinema-border)] pb-6 lg:pb-0 lg:pr-6">
                <div className="font-mono text-xs uppercase tracking-wider text-[var(--color-cinema-muted)]">
                  {auditMode === "excel"
                    ? "Legacy Spreadsheet Bottleneck"
                    : "Engineered Role-Based System"}
                </div>

                <div className="font-mono text-3xl sm:text-4xl font-semibold tabular-nums text-[var(--color-cinema-text)]">
                  {auditMode === "excel"
                    ? "~20 min"
                    : runningAudit
                      ? "Running..."
                      : auditLatency}
                </div>
                <p className="text-xs font-mono uppercase tracking-wider text-[var(--color-signal)]">
                  {auditMode === "excel"
                    ? "Manual Cross-Sheet Reconciliation"
                    : "Automated Audit Report Generation (< 5s SLA)"}
                </p>

                <ul className="space-y-2 text-sm text-[var(--color-cinema-muted)] pt-2">
                  {auditMode === "excel" ? (
                    <>
                      <li>• Unlinked `.xlsx` files across warehouse &amp; site clerks</li>
                      <li>• No role boundaries—accidental formula overwrites</li>
                      <li>• Delayed discrepancy detection during monthly audits</li>
                    </>
                  ) : (
                    <>
                      <li>• Strict RBAC: Admin, Auditor, and Staff permissions</li>
                      <li>• Immutable receipt, usage, and movement logs</li>
                      <li>• Instant discrepancy flagging for non-technical staff</li>
                    </>
                  )}
                </ul>

                {auditMode === "web" && (
                  <button
                    type="button"
                    onClick={triggerAuditBenchmark}
                    className="w-full inline-flex items-center justify-center gap-2 border border-[var(--color-cinema-text)] bg-[var(--color-cinema-text)] px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-[var(--color-cinema)] hover:bg-[var(--color-signal)] hover:border-[var(--color-signal)] hover:text-[var(--color-cinema-text)] transition-colors cursor-pointer"
                  >
                    <Play className="h-3.5 w-3.5" />
                    Re-Run Audit Query Benchmark
                  </button>
                )}
              </div>

              <div className="lg:col-span-8 overflow-x-auto">
                <div className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-cinema-muted)] mb-3">
                  Sample Generated Audit Ledger (Role-Verified)
                </div>
                <table className="w-full border-collapse border border-[var(--color-cinema-border)] font-mono text-xs">
                  <thead>
                    <tr className="bg-[var(--color-cinema)] text-left text-[var(--color-cinema-muted)]">
                      <th className="border border-[var(--color-cinema-border)] px-3 py-2">
                        TX ID
                      </th>
                      <th className="border border-[var(--color-cinema-border)] px-3 py-2">
                        MATERIAL
                      </th>
                      <th className="border border-[var(--color-cinema-border)] px-3 py-2">
                        DESTINATION
                      </th>
                      <th className="border border-[var(--color-cinema-border)] px-3 py-2">
                        RBAC TRAIL
                      </th>
                      <th className="border border-[var(--color-cinema-border)] px-3 py-2">
                        DELTA
                      </th>
                      <th className="border border-[var(--color-cinema-border)] px-3 py-2">
                        AUDIT STATUS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {AUDIT_ROWS.map((row) => (
                      <tr key={row.txId} className="bg-[var(--color-cinema-alt)]">
                        <td className="border border-[var(--color-cinema-border)] px-3 py-2 tabular-nums">
                          {row.txId}
                        </td>
                        <td className="border border-[var(--color-cinema-border)] px-3 py-2 font-sans font-medium text-[var(--color-cinema-text)]">
                          {row.item}
                        </td>
                        <td className="border border-[var(--color-cinema-border)] px-3 py-2 text-[var(--color-cinema-muted)]">
                          {row.site}
                        </td>
                        <td className="border border-[var(--color-cinema-border)] px-3 py-2">
                          {row.role}
                        </td>
                        <td className="border border-[var(--color-cinema-border)] px-3 py-2 tabular-nums">
                          {row.delta}
                        </td>
                        <td
                          className={`border border-[var(--color-cinema-border)] px-3 py-2 font-medium ${
                            row.status.includes("FLAGGED")
                              ? "text-[var(--color-signal)]"
                              : "text-[var(--color-cinema-text)]"
                          }`}
                        >
                          {row.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
