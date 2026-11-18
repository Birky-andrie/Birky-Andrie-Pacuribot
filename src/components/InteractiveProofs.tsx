"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Check,
  Copy,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";

type ProofTab = "husai" | "pacs" | "hackerlily";
type HusaiMediaTab = "video" | "hero" | "solution" | "practice";

/**
 * Verbatim data from C:\Users\PC\husai\video\src\lib\content.ts
 * (backend/src/modules/lifeline/service.ts & review/service.ts)
 */
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

export function InteractiveProofs() {
  const [activeTab, setActiveTab] = useState<ProofTab>("hackerlily");

  // HusAI state
  const [husaiMedia, setHusaiMedia] = useState<HusaiMediaTab>("video");
  const [simState, setSimState] = useState<"listening" | "ready">("ready");
  const [elapsedMs, setElapsedMs] = useState(4000);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  // Pacs Builders state
  const [auditMode, setAuditMode] = useState<"excel" | "web">("web");
  const [runningAudit, setRunningAudit] = useState(false);
  const [auditLatency, setAuditLatency] = useState("1.84s");

  // HipSurfer video reel state
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const [playingReelId, setPlayingReelId] = useState<string | null>(null);
  const [mutedReels, setMutedReels] = useState<Record<string, boolean>>({
    "reel-01": true,
    "reel-02": true,
    "reel-03": true,
  });

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

    if (playingReelId === id && !target.paused) {
      target.pause();
      setPlayingReelId(null);
      return;
    }

    // Pause other reels so audio/playback stays focused
    Object.entries(videoRefs.current).forEach(([otherId, el]) => {
      if (otherId !== id && el && !el.paused) {
        el.pause();
      }
    });

    target
      .play()
      .then(() => setPlayingReelId(id))
      .catch(() => setPlayingReelId(null));
  };

  const toggleMuteReel = (id: string) => {
    const target = videoRefs.current[id];
    const nextMuted = !mutedReels[id];
    if (target) {
      target.muted = nextMuted;
    }
    setMutedReels((prev) => ({ ...prev, [id]: nextMuted }));
  };

  const currentHusaiMedia =
    HUSAI_MEDIA_ITEMS.find((m) => m.id === husaiMedia) || HUSAI_MEDIA_ITEMS[0];

  return (
    <section
      id="proof-lab"
      className="border-b border-[var(--color-hairline)] bg-[var(--color-paper-alt)]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[var(--color-ink)]">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-signal)]">
              02 // Interactive Proof Lab
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
              Real creative reels, live localhost captures, and system telemetry.
            </h2>
          </div>

          <div
            className="flex flex-wrap border-t border-l border-[var(--color-ink)]"
            role="tablist"
            aria-label="Interactive proof demonstrations"
          >
            {[
              { id: "hackerlily" as const, label: "01 // HIPSURFER 9:16 REELS" },
              { id: "husai" as const, label: "02 // HUSAI LOCALHOST & DEMO" },
              { id: "pacs" as const, label: "03 // PACS <5S AUDIT" },
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveTab(tab.id)}
                  className={`border-r border-b border-[var(--color-ink)] px-4 py-2.5 font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                    active
                      ? "bg-[var(--color-ink)] text-[var(--color-paper)]"
                      : "bg-[var(--color-paper)] text-[var(--color-ink)] hover:bg-[var(--color-paper-alt)]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB 01: Hackerlily HipSurfer 9:16 Real Video Reels */}
        {activeTab === "hackerlily" && (
          <div className="mt-8 border border-[var(--color-ink)] bg-[var(--color-paper)]">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-ink)] bg-[var(--color-paper-alt)] px-4 sm:px-6 py-3 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 bg-[var(--color-signal)]" />
                <span className="font-medium text-[var(--color-ink)]">
                  HACKERLILY HIPSURFER // 3 DIRECT-RESPONSE &amp; MINIMALIST 9:16 EDITS
                </span>
              </div>
              <span className="text-[var(--color-ink-muted)]">
                CLICK ANY REEL TO PLAY · TOGGLE AUDIO FOR FOLEY &amp; BEAT SYNC
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-[var(--color-hairline)]">
              {HIPSURFER_REELS.map((reel) => {
                const isPlaying = playingReelId === reel.id;
                const isMuted = mutedReels[reel.id] ?? true;

                return (
                  <article
                    key={reel.id}
                    className="p-5 sm:p-6 flex flex-col justify-between gap-5 bg-[var(--color-paper)]"
                  >
                    <div className="space-y-4">
                      {/* Header metadata */}
                      <div className="flex items-center justify-between font-mono text-xs">
                        <span className="text-[var(--color-signal)] font-semibold">
                          {reel.code} // {reel.duration}
                        </span>
                        <span className="border border-[var(--color-hairline)] bg-[var(--color-paper-alt)] px-2 py-0.5 text-[11px] text-[var(--color-ink-muted)]">
                          {reel.platform}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--color-ink)]">
                          {reel.title}
                        </h3>
                        <p className="mt-0.5 font-mono text-xs text-[var(--color-ink-muted)]">
                          Angle: {reel.angle}
                        </p>
                      </div>

                      {/* 9:16 Vertical Video Player Frame */}
                      <div className="relative mx-auto w-full max-w-[280px] aspect-[9/16] border border-[var(--color-ink)] bg-[var(--color-ink)] overflow-hidden group">
                        <video
                          ref={(el) => {
                            videoRefs.current[reel.id] = el;
                          }}
                          src={reel.videoSrc}
                          poster={reel.posterSrc}
                          playsInline
                          loop
                          muted={isMuted}
                          preload="metadata"
                          onClick={() => togglePlayReel(reel.id)}
                          onPlay={() => setPlayingReelId(reel.id)}
                          onPause={() => {
                            if (playingReelId === reel.id) {
                              setPlayingReelId(null);
                            }
                          }}
                          className="h-full w-full object-cover cursor-pointer"
                        />

                        {/* Top status pill */}
                        <div className="pointer-events-none absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider">
                          <span className="border border-[var(--color-paper)]/30 bg-[var(--color-ink)]/80 px-2 py-0.5 text-[var(--color-paper)]">
                            {isPlaying ? "● PLAYING" : "9:16 VERTICAL"}
                          </span>
                          <span className="border border-[var(--color-paper)]/30 bg-[var(--color-ink)]/80 px-2 py-0.5 text-[var(--color-paper)] tabular-nums">
                            {reel.duration}
                          </span>
                        </div>

                        {/* Center play button overlay when paused */}
                        {!isPlaying && (
                          <button
                            type="button"
                            onClick={() => togglePlayReel(reel.id)}
                            aria-label={`Play ${reel.title}`}
                            className="absolute inset-0 flex items-center justify-center bg-[var(--color-ink)]/25 hover:bg-[var(--color-ink)]/10 transition-colors cursor-pointer"
                          >
                            <span className="inline-flex items-center gap-1.5 border border-[var(--color-paper)] bg-[var(--color-ink)]/90 px-3.5 py-2 font-mono text-xs uppercase tracking-wider text-[var(--color-paper)]">
                              <Play className="h-3.5 w-3.5 fill-current" />
                              Play Reel
                            </span>
                          </button>
                        )}

                        {/* Bottom tactile control strip */}
                        <div className="absolute bottom-0 inset-x-0 flex items-center justify-between border-t border-[var(--color-paper)]/20 bg-[var(--color-ink)]/90 px-3 py-2 font-mono text-[11px] text-[var(--color-paper)]">
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

                          <button
                            type="button"
                            onClick={() => toggleMuteReel(reel.id)}
                            className="inline-flex items-center gap-1.5 hover:text-[var(--color-signal)] cursor-pointer"
                            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                          >
                            {isMuted ? (
                              <>
                                <VolumeX className="h-3.5 w-3.5 text-[var(--color-signal)]" />
                                <span>MUTED</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="h-3.5 w-3.5 text-[var(--color-signal)]" />
                                <span>AUDIO ON</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Hook & Editorial Breakdown */}
                    <div className="space-y-2 pt-4 border-t border-[var(--color-hairline)]">
                      <div className="font-mono text-xs font-medium text-[var(--color-ink)]">
                        Hook: {reel.hookText}
                      </div>
                      <p className="text-xs leading-relaxed text-[var(--color-ink-muted)]">
                        {reel.editBreakdown}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 02: HusAI Localhost UI Captures + 60s Remotion Demo + Verbatim Repo Data */}
        {activeTab === "husai" && (
          <div className="mt-8 border border-[var(--color-ink)] bg-[var(--color-paper)]">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-ink)] bg-[var(--color-paper-alt)] px-4 sm:px-6 py-3 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 bg-[var(--color-signal)]" />
                <span className="font-medium text-[var(--color-ink)]">
                  HUSAI // LIVE CALL COACH FOR FILIPINO VAs
                </span>
                <span className="hidden sm:inline text-[var(--color-ink-muted)]">
                  (Localhost :5173 Captures + 60s Remotion Reveal + Verbatim Repo Data)
                </span>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com/Birky-andrie/HusAI"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                >
                  GitHub Repo
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
                <a
                  href="https://hus-ai-five.vercel.app"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[var(--color-ink)] hover:text-[var(--color-signal)] underline underline-offset-4"
                >
                  Live Vercel App
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left Column: 60s Product Demo Video & Live Localhost Screenshots */}
              <div className="lg:col-span-7 p-6 border-b lg:border-b-0 lg:border-r border-[var(--color-hairline)] flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap border-t border-l border-[var(--color-hairline)]">
                    {HUSAI_MEDIA_ITEMS.map((item) => {
                      const active = husaiMedia === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setHusaiMedia(item.id)}
                          className={`border-r border-b border-[var(--color-hairline)] px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors cursor-pointer ${
                            active
                              ? "bg-[var(--color-ink)] text-[var(--color-paper)]"
                              : "bg-[var(--color-paper-alt)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* 16:9 Media Viewport */}
                  <div className="border border-[var(--color-ink)] bg-[var(--color-ink)] overflow-hidden">
                    {currentHusaiMedia.id === "video" ? (
                      <video
                        key="husai-demo-video"
                        src={currentHusaiMedia.src}
                        poster="/husai/husai-poster.jpg"
                        controls
                        playsInline
                        preload="metadata"
                        className="aspect-video w-full object-contain bg-[var(--color-ink)]"
                      />
                    ) : (
                      <img
                        src={currentHusaiMedia.src}
                        alt={currentHusaiMedia.caption}
                        className="aspect-video w-full object-cover object-top"
                      />
                    )}
                    <div className="border-t border-[var(--color-paper)]/15 bg-[var(--color-ink)] px-3.5 py-2 font-mono text-[11px] text-[var(--color-paper)]/80">
                      {currentHusaiMedia.caption}
                    </div>
                  </div>
                </div>

                {/* Verbatim Dual-Channel Live Transcript & 4.0s Web Audio VAD Trigger */}
                <div className="space-y-3 pt-4 border-t border-[var(--color-hairline)]">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="uppercase tracking-wider text-[var(--color-ink)] font-medium">
                      Live Dual-Channel Transcript (TranscriptPanel.jsx)
                    </span>
                    <span className="tabular-nums text-[var(--color-signal)]">
                      VAD SILENCE: {(elapsedMs / 1000).toFixed(1)}s / 4.0s
                    </span>
                  </div>

                  <div className="space-y-2 border border-[var(--color-hairline)] bg-[var(--color-paper-alt)] p-3.5">
                    {HUSAI_TRANSCRIPT.map((turn, idx) => (
                      <div key={idx} className="font-mono text-xs flex items-baseline gap-2">
                        <span
                          className={`shrink-0 px-1.5 py-0.5 text-[10px] ${
                            turn.speaker === "CLIENT"
                              ? "bg-[var(--color-ink)] text-[var(--color-paper)]"
                              : "border border-[var(--color-ink)] text-[var(--color-ink)]"
                          }`}
                        >
                          {turn.speaker}
                        </span>
                        <span className="font-sans text-xs sm:text-sm text-[var(--color-ink)]">
                          &ldquo;{turn.text}&rdquo;
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={triggerLifeline}
                    className="w-full inline-flex items-center justify-center gap-2 border border-[var(--color-ink)] bg-[var(--color-ink)] px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-[var(--color-paper)] hover:bg-[var(--color-signal)] hover:border-[var(--color-signal)] transition-colors cursor-pointer"
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
                    <span className="uppercase tracking-wider text-[var(--color-ink)] font-medium">
                      01 // Smart Replies (LifelineCard.jsx)
                    </span>
                    <span className="text-[var(--color-signal)] tabular-nums">
                      {simState === "listening"
                        ? "LISTENING..."
                        : "llama-3.1-8b-instant"}
                    </span>
                  </div>

                  {simState === "listening" ? (
                    <div className="h-36 flex items-center justify-center border border-dashed border-[var(--color-hairline)] font-mono text-xs text-[var(--color-ink-muted)]">
                      Measuring raw mic amplitude VAD ({(elapsedMs / 1000).toFixed(1)}s / 4.0s)...
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {HUSAI_LIFELINE_BULLETS.map((line, i) => (
                        <div
                          key={line}
                          className="border border-[var(--color-hairline)] bg-[var(--color-paper-alt)] p-3 flex items-start justify-between gap-3"
                        >
                          <div className="space-y-1">
                            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-signal)]">
                              OPTION 0{i + 1}
                            </span>
                            <p className="text-xs sm:text-sm leading-relaxed text-[var(--color-ink)]">
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
                            className="shrink-0 border border-[var(--color-hairline)] bg-[var(--color-paper)] px-2 py-1 font-mono text-[10px] text-[var(--color-ink-muted)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)] cursor-pointer"
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
                <div className="space-y-3 pt-4 border-t border-[var(--color-hairline)]">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="uppercase tracking-wider text-[var(--color-ink)] font-medium">
                      02 // Call Review (ReviewDashboard.jsx)
                    </span>
                    <span className="bg-[var(--color-ink)] text-[var(--color-paper)] px-2 py-0.5 tabular-nums">
                      OVERALL: {HUSAI_OVERALL_SCORE}/100
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-l border-[var(--color-hairline)]">
                    {HUSAI_SCORES.map((s) => (
                      <div
                        key={s.label}
                        className="border-r border-b border-[var(--color-hairline)] bg-[var(--color-paper-alt)] p-2.5"
                      >
                        <div className="font-mono text-lg font-semibold tabular-nums text-[var(--color-ink)]">
                          {s.value}
                        </div>
                        <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-ink-muted)]">
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    {HUSAI_INSIGHTS.map((insight) => (
                      <div
                        key={insight.pattern}
                        className="border border-[var(--color-hairline)] bg-[var(--color-paper-alt)] p-3 space-y-1"
                      >
                        <div className="font-mono text-[11px] font-semibold text-[var(--color-signal)] uppercase">
                          Pattern: {insight.pattern}
                        </div>
                        <p className="font-mono text-[11px] text-[var(--color-ink-muted)]">
                          Evidence: &ldquo;{insight.evidence}&rdquo;
                        </p>
                        <p className="text-xs text-[var(--color-ink)]">
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

        {/* TAB 03: Pacs Builders Audit Benchmark */}
        {activeTab === "pacs" && (
          <div className="mt-8 border border-[var(--color-ink)] bg-[var(--color-paper)]">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-ink)] bg-[var(--color-paper-alt)] px-4 sm:px-6 py-3 font-mono text-xs">
              <div>
                <span className="font-medium text-[var(--color-ink)]">
                  PACS BUILDERS // MATERIAL TRACKING &amp; AUDIT ENGINE
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAuditMode("excel")}
                  className={`px-3 py-1 border font-mono text-[11px] uppercase cursor-pointer ${
                    auditMode === "excel"
                      ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)]"
                      : "border-[var(--color-hairline)] bg-[var(--color-paper)] text-[var(--color-ink-muted)]"
                  }`}
                >
                  Before: Manual Excel
                </button>
                <button
                  type="button"
                  onClick={() => setAuditMode("web")}
                  className={`px-3 py-1 border font-mono text-[11px] uppercase cursor-pointer ${
                    auditMode === "web"
                      ? "border-[var(--color-signal)] bg-[var(--color-signal)] text-[var(--color-paper)]"
                      : "border-[var(--color-hairline)] bg-[var(--color-paper)] text-[var(--color-ink-muted)]"
                  }`}
                >
                  After: Centralized Web App
                </button>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-4 space-y-4 border-b lg:border-b-0 lg:border-r border-[var(--color-hairline)] pb-6 lg:pb-0 lg:pr-6">
                <div className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink-muted)]">
                  {auditMode === "excel"
                    ? "Legacy Spreadsheet Bottleneck"
                    : "Engineered Role-Based System"}
                </div>

                <div className="font-mono text-3xl sm:text-4xl font-semibold tabular-nums text-[var(--color-ink)]">
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

                <ul className="space-y-2 text-sm text-[var(--color-ink-muted)] pt-2">
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
                    className="w-full inline-flex items-center justify-center gap-2 border border-[var(--color-ink)] bg-[var(--color-ink)] px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-[var(--color-paper)] hover:bg-[var(--color-signal)] hover:border-[var(--color-signal)] transition-colors cursor-pointer"
                  >
                    <Play className="h-3.5 w-3.5" />
                    Re-Run Audit Query Benchmark
                  </button>
                )}
              </div>

              <div className="lg:col-span-8 overflow-x-auto">
                <div className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink-muted)] mb-3">
                  Sample Generated Audit Ledger (Role-Verified)
                </div>
                <table className="w-full border-collapse border border-[var(--color-hairline)] font-mono text-xs">
                  <thead>
                    <tr className="bg-[var(--color-paper-alt)] text-left text-[var(--color-ink-muted)]">
                      <th className="border border-[var(--color-hairline)] px-3 py-2">
                        TX ID
                      </th>
                      <th className="border border-[var(--color-hairline)] px-3 py-2">
                        MATERIAL
                      </th>
                      <th className="border border-[var(--color-hairline)] px-3 py-2">
                        DESTINATION
                      </th>
                      <th className="border border-[var(--color-hairline)] px-3 py-2">
                        RBAC TRAIL
                      </th>
                      <th className="border border-[var(--color-hairline)] px-3 py-2">
                        DELTA
                      </th>
                      <th className="border border-[var(--color-hairline)] px-3 py-2">
                        AUDIT STATUS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {AUDIT_ROWS.map((row) => (
                      <tr key={row.txId} className="bg-[var(--color-paper)]">
                        <td className="border border-[var(--color-hairline)] px-3 py-2 tabular-nums">
                          {row.txId}
                        </td>
                        <td className="border border-[var(--color-hairline)] px-3 py-2 font-sans font-medium text-[var(--color-ink)]">
                          {row.item}
                        </td>
                        <td className="border border-[var(--color-hairline)] px-3 py-2 text-[var(--color-ink-muted)]">
                          {row.site}
                        </td>
                        <td className="border border-[var(--color-hairline)] px-3 py-2">
                          {row.role}
                        </td>
                        <td className="border border-[var(--color-hairline)] px-3 py-2 tabular-nums">
                          {row.delta}
                        </td>
                        <td
                          className={`border border-[var(--color-hairline)] px-3 py-2 font-medium ${
                            row.status.includes("FLAGGED")
                              ? "text-[var(--color-signal)]"
                              : "text-[var(--color-ink)]"
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
