"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Check,
  Copy,
  Maximize2,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import type { ProofTab } from "@/data/portfolio";
import { FinancifySandbox } from "./FinancifySandbox";

type RailFilter = "all" | "hackerlily" | "husai" | "pacs" | "financify";
type LightboxTarget =
  | { kind: "reel"; id: string }
  | { kind: "husai" }
  | { kind: "pacs" }
  | { kind: "financify" }
  | null;

interface ReelItem {
  id: string;
  num: string;
  tag: string;
  title: string;
  duration: string;
  platform: string;
  videoSrc: string;
  posterSrc: string;
  hookText: string;
}

const REELS: ReelItem[] = [
  {
    id: "reel-01",
    num: "01",
    tag: "SKEPTIC UGC",
    title: "Cart Conversion",
    duration: "0:20",
    platform: "Meta · TikTok",
    videoSrc: "/videos/hipsurfer-01.mp4",
    posterSrc: "/videos/hipsurfer-01-poster.jpg",
    hookText: '"Woke up with one in my cart. Zero regrets."',
  },
  {
    id: "reel-02",
    num: "02",
    tag: "SWITCHER CUT",
    title: "Travel Arcade Hook",
    duration: "0:20",
    platform: "IG Reels · Meta",
    videoSrc: "/videos/hipsurfer-02.mp4",
    posterSrc: "/videos/hipsurfer-02-poster.jpg",
    hookText: '"Sure, get the cheap one."',
  },
  {
    id: "reel-03",
    num: "03",
    tag: "LIFESTYLE CUT",
    title: "Minimalist Aesthetic",
    duration: "0:18",
    platform: "Pinterest · IG",
    videoSrc: "/videos/hipsurfer-03.mp4",
    posterSrc: "/videos/hipsurfer-03-poster.jpg",
    hookText: "Visual-first daily carry showcase",
  },
  {
    id: "reel-04",
    num: "04",
    tag: "EOFY26 LAUNCH",
    title: "Quick Shop Trip",
    duration: "0:18",
    platform: "Meta · IG Promo",
    videoSrc: "/videos/hipsurfer-04.mp4",
    posterSrc: "/videos/hipsurfer-04-poster.jpg",
    hookText: '"A 5-minute shop trip should not need this much gear"',
  },
  {
    id: "reel-05",
    num: "05",
    tag: "FATHER'S DAY",
    title: "Dad Duty Upgrade",
    duration: "0:15",
    platform: "Meta · TikTok",
    videoSrc: "/videos/hipsurfer-05.mp4",
    posterSrc: "/videos/hipsurfer-05-poster.jpg",
    hookText: "15s High-Velocity Seasonal Angle",
  },
  {
    id: "reel-06",
    num: "06",
    tag: "TREND / MEME",
    title: "Tell Me You're a Mum",
    duration: "0:15",
    platform: "IG · TikTok Organic",
    videoSrc: "/videos/hipsurfer-06.mp4",
    posterSrc: "/videos/hipsurfer-06-poster.jpg",
    hookText: '"Tell me you\'re a mum without telling me..."',
  },
];

const HUSAI_REPLIES = [
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

const FILTERS: { id: RailFilter; label: string }[] = [
  { id: "all", label: "All (9)" },
  { id: "hackerlily", label: "9:16 Reels (6)" },
  { id: "husai", label: "HusAI" },
  { id: "pacs", label: "<5s Audit" },
  { id: "financify", label: "Financify" },
];

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  highlighted?: boolean;
  cardId?: string;
}

function TiltCard({ children, className = "", highlighted, cardId }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - py) * 5;
    const ry = (px - 0.5) * 5;
    el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
  };

  const onLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)";
  };

  return (
    <div
      ref={cardRef}
      data-card-id={cardId}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`group relative overflow-hidden rounded-[28px] border bg-[#12141A] transition-[transform,border-color,box-shadow] duration-300 ease-out shadow-[0_18px_50px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.1)] ${
        highlighted
          ? "border-[#455CE9] ring-2 ring-[#455CE9]/45"
          : "border-white/10 hover:border-white/25"
      } ${className}`}
    >
      {/* Subtle Cursor Specular Glare */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), rgba(110, 134, 255, 0.12), transparent 65%)",
        }}
      />
      {children}
    </div>
  );
}

interface InteractiveProofsProps {
  activeTab: ProofTab;
  onChangeTab: (tab: ProofTab) => void;
}

export function InteractiveProofs({
  activeTab,
  onChangeTab,
}: InteractiveProofsProps) {
  const [filter, setFilter] = useState<RailFilter>("all");
  const [autoGlide, setAutoGlide] = useState(true);
  const [lightbox, setLightbox] = useState<LightboxTarget>(null);
  const [highlightTarget, setHighlightTarget] = useState<string | null>(null);

  // Reel audio/playback state
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const [playingMap, setPlayingMap] = useState<Record<string, boolean>>({});
  const [unmutedReelId, setUnmutedReelId] = useState<string | null>(null);

  // HusAI mini interactive state
  const [husaiView, setHusaiView] = useState<"demo" | "lifeline">("demo");
  const [vadState, setVadState] = useState<"ready" | "listening">("ready");
  const [vadMs, setVadMs] = useState(4000);
  const [replyIdx, setReplyIdx] = useState(0);
  const [copiedReply, setCopiedReply] = useState(false);

  // Pacs Builders mini interactive state
  const [auditMode, setAuditMode] = useState<"web" | "excel">("web");
  const [auditLatency, setAuditLatency] = useState("1.84s");
  const [auditRunning, setAuditRunning] = useState(false);

  // Financify compact interactive card state
  const [finView, setFinView] = useState<"budget" | "analysis">("budget");
  const [finSpentList, setFinSpentList] = useState<number[]>([420, 350, 650]);
  const finBudget = 2500;
  const finTotalSpent = useMemo(
    () => finSpentList.reduce((acc, v) => acc + v, 0),
    [finSpentList]
  );
  const finRemaining = Math.max(0, finBudget - finTotalSpent);
  const finDelta = useMemo(() => {
    if (finSpentList.length < 2) return 0;
    return (
      finSpentList[finSpentList.length - 1] -
      finSpentList[finSpentList.length - 2]
    );
  }, [finSpentList]);

  // Rail scroll, drag-inertia, and left-to-right ambient loop refs
  const railRef = useRef<HTMLDivElement | null>(null);
  const firstSetRef = useRef<HTMLDivElement | null>(null);
  const hoveredRef = useRef(false);
  const draggingRef = useRef(false);
  const dragMovedRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);
  const velocityRef = useRef(0);
  const lastDragXRef = useRef(0);

  // Build ordered rail cards cleanly (duplicated once when filter === "all" for seamless infinite left-to-right loop)
  const railItems = useMemo(() => {
    const base: (
      | { key: string; kind: "reel"; reel: ReelItem }
      | { key: string; kind: "husai" | "pacs" | "financify" }
    )[] = [];

    if (filter === "all" || filter === "hackerlily") {
      REELS.slice(0, 3).forEach((r) =>
        base.push({ key: r.id, kind: "reel", reel: r })
      );
    }
    if (filter === "all" || filter === "husai") {
      base.push({ key: "husai-card", kind: "husai" });
    }
    if (filter === "all" || filter === "pacs") {
      base.push({ key: "pacs-card", kind: "pacs" });
    }
    if (filter === "all" || filter === "financify") {
      base.push({ key: "financify-card", kind: "financify" });
    }
    if (filter === "all" || filter === "hackerlily") {
      REELS.slice(3).forEach((r) =>
        base.push({ key: r.id, kind: "reel", reel: r })
      );
    }
    return base;
  }, [filter]);

  // Initialize scroll offset at setWidth when in "all" mode so decreasing scrollLeft glides endlessly left-to-right
  useEffect(() => {
    const el = railRef.current;
    const setEl = firstSetRef.current;
    if (!el || !setEl) return;
    if (filter === "all") {
      el.scrollLeft = setEl.offsetWidth;
    } else {
      el.scrollLeft = 0;
    }
  }, [filter]);

  // Sync external WorkMatrix / Hero / CommandPalette jumps cleanly
  const lastPropTabRef = useRef<ProofTab | null>(null);
  useEffect(() => {
    if (lastPropTabRef.current === null) {
      lastPropTabRef.current = activeTab;
      return;
    }
    if (lastPropTabRef.current === activeTab) return;
    lastPropTabRef.current = activeTab;

    setFilter("all");
    const targetId =
      activeTab === "hackerlily"
        ? "reel-01"
        : activeTab === "husai"
          ? "husai-card"
          : activeTab === "pacs"
            ? "pacs-card"
            : "financify-card";

    setHighlightTarget(targetId);
    const timer = setTimeout(() => {
      const rail = railRef.current;
      const card = rail?.querySelector(
        `[data-card-id="${targetId}"]`
      ) as HTMLElement | null;
      if (rail && card) {
        const left =
          card.offsetLeft - rail.clientWidth / 2 + card.offsetWidth / 2;
        rail.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
      }
      setTimeout(() => setHighlightTarget(null), 2000);
    }, 80);

    return () => clearTimeout(timer);
  }, [activeTab]);

  // 60fps Left-to-Right Ambient Drift + Inertia Physics Loop
  useEffect(() => {
    let rafId = 0;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const loop = () => {
      const el = railRef.current;
      const firstSet = firstSetRef.current;

      if (el) {
        // Apply drag release inertia
        if (!draggingRef.current && Math.abs(velocityRef.current) > 0.2) {
          el.scrollLeft += velocityRef.current;
          velocityRef.current *= 0.93;
        }

        // Ambient Left-to-Right Glide: decrementing scrollLeft moves cards smoothly rightward across the viewport!
        const canAutoGlide =
          autoGlide &&
          !prefersReduced &&
          filter === "all" &&
          !hoveredRef.current &&
          !draggingRef.current &&
          unmutedReelId === null &&
          lightbox === null;

        if (canAutoGlide) {
          el.scrollLeft -= 0.72;
        }

        // Seamless infinite wrap across the duplicate track
        if (filter === "all" && firstSet) {
          const w = firstSet.offsetWidth;
          if (w > 100) {
            if (el.scrollLeft <= 1) {
              el.scrollLeft += w;
            } else if (el.scrollLeft >= w * 2 - el.clientWidth - 2) {
              el.scrollLeft -= w;
            }
          }
        }
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [autoGlide, filter, unmutedReelId, lightbox]);

  // Play/Pause visible muted reels cleanly
  useEffect(() => {
    Object.entries(videoRefs.current).forEach(([key, vid]) => {
      if (!vid) return;
      const baseId = key.replace("-dup", "");
      vid.muted = unmutedReelId !== baseId;
      vid
        .play()
        .then(() => setPlayingMap((p) => ({ ...p, [key]: true })))
        .catch(() => {});
    });
  }, [filter, unmutedReelId]);

  // HusAI 4.0s VAD countdown simulation
  useEffect(() => {
    if (vadState !== "listening") return;
    const start = Date.now();
    const timer = setInterval(() => {
      const diff = Date.now() - start;
      if (diff >= 1400) {
        setVadMs(4000);
        setVadState("ready");
        setReplyIdx((prev) => (prev + 1) % HUSAI_REPLIES.length);
        clearInterval(timer);
      } else {
        setVadMs(Math.min(4000, Math.round((diff / 1400) * 4000)));
      }
    }, 45);
    return () => clearInterval(timer);
  }, [vadState]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest("button, a, video, input, select, [data-no-drag]")) {
      return;
    }
    const el = railRef.current;
    if (!el) return;
    draggingRef.current = true;
    dragMovedRef.current = false;
    dragStartXRef.current = e.clientX;
    lastDragXRef.current = e.clientX;
    dragStartScrollRef.current = el.scrollLeft;
    velocityRef.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const el = railRef.current;
    if (!el) return;
    const dx = e.clientX - dragStartXRef.current;
    if (Math.abs(dx) > 6) {
      dragMovedRef.current = true;
    }
    if (dragMovedRef.current) {
      const step = lastDragXRef.current - e.clientX;
      velocityRef.current = step;
      lastDragXRef.current = e.clientX;
      el.scrollLeft = dragStartScrollRef.current - dx;
    }
  };

  const handlePointerUp = () => {
    draggingRef.current = false;
    setTimeout(() => {
      dragMovedRef.current = false;
    }, 30);
  };

  const scrollRailBy = (deltaX: number) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({ left: deltaX, behavior: "smooth" });
  };

  const togglePlayReel = (key: string) => {
    const vid = videoRefs.current[key];
    if (!vid) return;
    if (!vid.paused) {
      vid.pause();
      setPlayingMap((p) => ({ ...p, [key]: false }));
    } else {
      vid
        .play()
        .then(() => setPlayingMap((p) => ({ ...p, [key]: true })))
        .catch(() => {});
    }
  };

  const toggleAudioReel = (baseId: string) => {
    const next = unmutedReelId === baseId ? null : baseId;
    setUnmutedReelId(next);
    Object.entries(videoRefs.current).forEach(([k, v]) => {
      if (!v) return;
      const shouldMute = k !== next;
      v.muted = shouldMute;
      if (!shouldMute && v.paused) {
        v.play().catch(() => {});
      }
    });
  };

  const triggerPacsBenchmark = () => {
    setAuditRunning(true);
    setAuditMode("web");
    setTimeout(() => {
      const next = (1.35 + Math.random() * 1.35).toFixed(2);
      setAuditLatency(`${next}s`);
      setAuditRunning(false);
    }, 320);
  };

  const renderCard = (
    item: (typeof railItems)[number],
    isDuplicate = false
  ) => {
    const domKey = isDuplicate ? `${item.key}-dup` : item.key;

    if (item.kind === "reel") {
      const { reel } = item;
      const isPlaying = playingMap[domKey] ?? true;
      const isUnmuted = !isDuplicate && unmutedReelId === reel.id;
      const isHighlighted = !isDuplicate && highlightTarget === reel.id;

      return (
        <TiltCard
          key={domKey}
          cardId={isDuplicate ? undefined : reel.id}
          highlighted={isHighlighted}
          className="w-[270px] sm:w-[295px] h-[500px] shrink-0 bg-black"
        >
          <video
            ref={(el) => {
              videoRefs.current[domKey] = el;
            }}
            src={reel.videoSrc}
            poster={reel.posterSrc}
            autoPlay
            loop
            muted={!isUnmuted}
            playsInline
            preload="metadata"
            onClick={() => togglePlayReel(domKey)}
            className="h-full w-full object-cover cursor-pointer"
          />

          {/* Top Edge Pill: Number & Tag only */}
          <div className="pointer-events-none absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
            <span className="rounded-full bg-black/60 backdrop-blur-md border border-white/15 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-white">
              {reel.num} // {reel.tag}
            </span>
            <span className="rounded-full bg-black/60 backdrop-blur-md border border-white/15 px-2.5 py-1 font-mono text-[10px] tabular-nums text-white/85">
              {reel.duration}
            </span>
          </div>

          {/* Bottom Gradient + Crisp Title + Controls */}
          <div
            className="absolute inset-x-0 bottom-0 p-4 pt-16 bg-gradient-to-t from-black/90 via-black/55 to-transparent flex items-end justify-between gap-2"
            data-no-drag
          >
            <div className="min-w-0">
              <div className="font-mono text-[10px] uppercase tracking-wider text-[#8FA2FF]">
                {reel.platform}
              </div>
              <div className="truncate font-[family-name:var(--font-display)] text-lg font-medium text-white">
                {reel.title}
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => togglePlayReel(domKey)}
                aria-label={isPlaying ? "Pause reel" : "Play reel"}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 hover:bg-[#455CE9] text-white backdrop-blur-md transition-colors cursor-pointer"
              >
                {isPlaying ? (
                  <Pause className="h-3.5 w-3.5" />
                ) : (
                  <Play className="h-3.5 w-3.5 fill-current" />
                )}
              </button>
              <button
                type="button"
                onClick={() => toggleAudioReel(reel.id)}
                aria-label={isUnmuted ? "Mute reel" : "Unmute reel"}
                className={`flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-colors cursor-pointer ${
                  isUnmuted
                    ? "bg-[#455CE9] text-white"
                    : "bg-white/15 hover:bg-white/25 text-white"
                }`}
              >
                {isUnmuted ? (
                  <Volume2 className="h-3.5 w-3.5" />
                ) : (
                  <VolumeX className="h-3.5 w-3.5" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setLightbox({ kind: "reel", id: reel.id })}
                aria-label="Expand reel"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 hover:bg-white hover:text-[#1C1D20] text-white backdrop-blur-md transition-colors cursor-pointer"
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </TiltCard>
      );
    }

    if (item.kind === "husai") {
      return (
        <TiltCard
          key={domKey}
          cardId={isDuplicate ? undefined : "husai-card"}
          highlighted={!isDuplicate && highlightTarget === "husai-card"}
          className="w-[380px] sm:w-[480px] h-[500px] shrink-0 flex flex-col justify-between p-5"
        >
          {/* Header Strip */}
          <div className="flex items-center justify-between gap-2 z-10">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#455CE9]/15 border border-[#455CE9]/40 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[#8FA2FF]">
                HUSAI // LIVE CALL COACH
              </span>
              <span className="font-mono text-[11px] tabular-nums text-white/60">
                69/100
              </span>
            </div>

            <div className="flex items-center gap-1.5" data-no-drag>
              <button
                type="button"
                onClick={() =>
                  setHusaiView((v) => (v === "demo" ? "lifeline" : "demo"))
                }
                className="rounded-full border border-white/15 bg-white/5 hover:bg-white/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-white transition-colors cursor-pointer"
              >
                {husaiView === "demo" ? "Show UI" : "60s Demo"}
              </button>
              <button
                type="button"
                onClick={() => setLightbox({ kind: "husai" })}
                aria-label="Expand HusAI details"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 hover:bg-white hover:text-[#1C1D20] text-white transition-colors cursor-pointer"
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* 16:9 Media Stage */}
          <div
            className="relative my-3 flex-1 overflow-hidden rounded-2xl border border-white/10 bg-[#0A0B0F]"
            data-no-drag
          >
            {husaiView === "demo" ? (
              <video
                src="/husai/husai-demo.mp4"
                poster="/husai/husai-poster.jpg"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="h-full w-full object-cover"
              />
            ) : (
              <img
                src="/husai/screen-solution.png"
                alt="HusAI Floating Call Coach UI"
                className="h-full w-full object-cover object-top"
              />
            )}
          </div>

          {/* Interactive 4.0s VAD Mini Lifeline Trigger */}
          <div
            className="rounded-2xl border border-white/10 bg-[#0B0D12] p-3.5 space-y-2.5 z-10"
            data-no-drag
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider">
                <span
                  className={`h-2 w-2 rounded-full ${
                    vadState === "listening"
                      ? "bg-amber-400 animate-ping"
                      : "bg-emerald-400"
                  }`}
                />
                <span className="text-white/75 tabular-nums">
                  {vadState === "listening"
                    ? `SILENCE ${(vadMs / 1000).toFixed(1)}S / 4.0S`
                    : "4.0S VAD // SMART REPLY"}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setVadMs(0);
                  setVadState("listening");
                }}
                className="rounded-full bg-[#455CE9] hover:bg-[#334BD3] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-white transition-colors cursor-pointer"
              >
                Fire 4.0s VAD
              </button>
            </div>

            <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
              <div
                style={{ width: `${(vadMs / 4000) * 100}%` }}
                className="h-full bg-[#455CE9] transition-all duration-75"
              />
            </div>

            <div className="flex items-center justify-between gap-2 text-xs text-white/90 font-medium truncate">
              <span className="truncate">
                &ldquo;{HUSAI_REPLIES[replyIdx]}&rdquo;
              </span>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(HUSAI_REPLIES[replyIdx]);
                    setCopiedReply(true);
                    setTimeout(() => setCopiedReply(false), 1600);
                  } catch {
                    // ignore
                  }
                }}
                aria-label="Copy Smart Reply"
                className="shrink-0 text-white/60 hover:text-white cursor-pointer"
              >
                {copiedReply ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>
        </TiltCard>
      );
    }

    if (item.kind === "pacs") {
      return (
        <TiltCard
          key={domKey}
          cardId={isDuplicate ? undefined : "pacs-card"}
          highlighted={!isDuplicate && highlightTarget === "pacs-card"}
          className="w-[340px] sm:w-[400px] h-[500px] shrink-0 flex flex-col justify-between p-5"
        >
          <div className="flex items-center justify-between gap-2 z-10">
            <span className="rounded-full bg-white/10 border border-white/15 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-white">
              PACS // AUDIT ENGINE
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/55">
              RBAC TRAIL
            </span>
          </div>

          {/* Center Oversized Apple Latency Meter */}
          <div className="my-auto space-y-5 z-10" data-no-drag>
            <div className="inline-flex rounded-full border border-white/15 bg-[#0A0C11] p-1">
              {(["web", "excel"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setAuditMode(m)}
                  className={`rounded-full px-3.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors cursor-pointer ${
                    auditMode === m
                      ? "bg-[#455CE9] text-white"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {m === "web" ? "Web App" : "Excel Sheet"}
                </button>
              ))}
            </div>

            <div>
              <div className="font-[family-name:var(--font-display)] text-5xl sm:text-6xl font-semibold tabular-nums tracking-tight text-white">
                {auditMode === "excel"
                  ? "~20m"
                  : auditRunning
                    ? "..."
                    : auditLatency}
              </div>
              <div className="mt-1 font-mono text-xs text-[#8FA2FF]">
                {auditMode === "excel"
                  ? "Manual Cross-Sheet Reconciliation"
                  : "Sub-5s Automated Role Query"}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    auditMode === "excel"
                      ? "w-full bg-white/35"
                      : "w-[11%] bg-[#455CE9]"
                  }`}
                />
              </div>
              <div className="flex justify-between font-mono text-[10px] text-white/50 tabular-nums">
                <span>0s</span>
                <span>5s SLA TARGET</span>
                <span>20m LEGACY</span>
              </div>
            </div>

            {/* Minimal Ledger Pills */}
            <div className="space-y-1.5 pt-2 border-t border-white/10 font-mono text-[11px]">
              <div className="flex justify-between text-white/80">
                <span>TX-9041 · Portland Cement</span>
                <span className="text-emerald-400">VERIFIED</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span>TX-9043 · Marine Plywood</span>
                <span className="text-[#8FA2FF]">FLAGGED</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            data-no-drag
            onClick={triggerPacsBenchmark}
            className="w-full rounded-full border border-white/20 bg-white text-[#1C1D20] hover:bg-[#455CE9] hover:border-[#455CE9] hover:text-white py-2.5 font-mono text-xs uppercase tracking-wider font-medium transition-colors cursor-pointer z-10 inline-flex items-center justify-center gap-2"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Re-Run Query Benchmark</span>
          </button>
        </TiltCard>
      );
    }

    // Financify Compact Interactive Flutter Card + 1-Click Full Runner Modal
    return (
      <TiltCard
        key={domKey}
        cardId={isDuplicate ? undefined : "financify-card"}
        highlighted={!isDuplicate && highlightTarget === "financify-card"}
        className="w-[340px] sm:w-[400px] h-[500px] shrink-0 flex flex-col justify-between p-5"
      >
        <div className="flex items-center justify-between gap-2 z-10">
          <span className="rounded-full bg-[#2196F3]/20 border border-[#2196F3]/45 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[#64B5F6]">
            FINANCIFY // 6 OS FLUTTER
          </span>
          <a
            href="https://github.com/Birky-andrie/Financify"
            target="_blank"
            rel="noreferrer"
            data-no-drag
            className="font-mono text-[10px] uppercase tracking-wider text-white/65 hover:text-white inline-flex items-center gap-1"
          >
            GitHub <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>

        {/* Mini Material Phone Viewport */}
        <div
          className="my-3 flex-1 overflow-hidden rounded-2xl border border-white/15 bg-white text-[#1C1D20] flex flex-col justify-between shadow-lg z-10"
          data-no-drag
        >
          <div className="bg-[#2196F3] px-4 py-2.5 flex items-center justify-between text-white">
            <span className="text-xs font-semibold">Budget &amp; Analysis</span>
            <div className="flex gap-1">
              {(["budget", "analysis"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFinView(tab)}
                  className={`rounded px-2 py-0.5 font-mono text-[9px] uppercase cursor-pointer ${
                    finView === tab
                      ? "bg-white text-[#1976D2] font-semibold"
                      : "bg-white/15 text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 flex-1 flex flex-col justify-between">
            {finView === "budget" ? (
              <>
                <div className="space-y-1">
                  <div className="text-[11px] text-slate-500">
                    Weekly Budget: ₱{finBudget.toFixed(2)}
                  </div>
                  <div className="text-2xl font-bold tabular-nums text-slate-900">
                    ₱{finRemaining.toFixed(2)}{" "}
                    <span className="text-xs font-normal text-slate-500">
                      left
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden mt-2">
                    <div
                      style={{
                        width: `${Math.min(100, (finTotalSpent / finBudget) * 100)}%`,
                      }}
                      className={`h-full transition-all duration-300 ${
                        finRemaining === 0 ? "bg-red-500" : "bg-[#2196F3]"
                      }`}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setFinSpentList((prev) => [...prev, 280])}
                    className="inline-flex items-center gap-1 rounded bg-[#2196F3] hover:bg-[#1976D2] px-3 py-1.5 text-[11px] font-semibold text-white cursor-pointer"
                  >
                    <Plus className="h-3 w-3" /> Log ₱280
                  </button>
                  <button
                    type="button"
                    onClick={() => setFinSpentList([420, 350, 650])}
                    aria-label="Reset demo budget"
                    className="inline-flex items-center gap-1 rounded border border-slate-200 px-2.5 py-1.5 text-[11px] text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    <RotateCcw className="h-3 w-3" /> Reset
                  </button>
                </div>
              </>
            ) : (
              <div className="my-auto rounded-xl border border-slate-200 bg-slate-50 p-4 text-center space-y-1.5">
                <div className="flex justify-center">
                  {finDelta > 0 ? (
                    <ArrowUp className="h-8 w-8 text-red-600" />
                  ) : (
                    <ArrowDown className="h-8 w-8 text-emerald-600" />
                  )}
                </div>
                <div className="text-xs font-semibold text-slate-800">
                  {finDelta > 0
                    ? `Increased by ₱${finDelta.toFixed(2)}`
                    : `Decreased by ₱${Math.abs(finDelta).toFixed(2)}`}
                </div>
                <div className="font-mono text-[10px] text-slate-500">
                  {finSpentList.length} logged entries
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          data-no-drag
          onClick={() => setLightbox({ kind: "financify" })}
          className="w-full rounded-full bg-[#455CE9] hover:bg-[#334BD3] py-2.5 font-mono text-xs uppercase tracking-wider font-medium text-white transition-colors cursor-pointer z-10 inline-flex items-center justify-center gap-1.5"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Open Full Flutter Runner</span>
        </button>
      </TiltCard>
    );
  };

  const lightboxReel =
    lightbox?.kind === "reel"
      ? REELS.find((r) => r.id === lightbox.id)
      : null;

  return (
    <section
      id="proof-lab"
      className="bg-[#07080B] text-white py-20 sm:py-28 border-y border-white/10 overflow-hidden"
    >
      {/* Minimal Header + Left-to-Right Controls */}
      <div className="mx-auto max-w-7xl px-6 sm:px-10 mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#7D92FF]">
            02 // PROOF RAIL
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl sm:text-5xl font-normal tracking-[-0.03em] text-white">
            Shipped work. Live demos.
          </h2>
        </div>

        <div className="flex flex-wrap lg:flex-nowrap items-center gap-2">
          {/* Category Filter Chips */}
          <div className="flex flex-wrap lg:flex-nowrap gap-1.5">
            {FILTERS.map((f) => {
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    setFilter(f.id);
                    if (f.id !== "all") {
                      onChangeTab(f.id as ProofTab);
                    }
                  }}
                  className={`rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer ${
                    active
                      ? "bg-white text-[#1C1D20] font-medium"
                      : "border border-white/15 text-white/75 hover:border-white/40 hover:text-white"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          <div className="h-5 w-px bg-white/15 mx-0.5 hidden sm:block" />

          {/* Ambient Left-to-Right Toggle & Magnetic Arrows */}
          <button
            type="button"
            onClick={() => setAutoGlide((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider whitespace-nowrap text-white/85 transition-colors cursor-pointer"
          >
            {autoGlide ? (
              <>
                <Pause className="h-3 w-3 text-[#8FA2FF]" />
                <span>L&rarr;R Glide</span>
              </>
            ) : (
              <>
                <Play className="h-3 w-3 fill-current" />
                <span>Paused</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => scrollRailBy(-380)}
            aria-label="Scroll proof rail left"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 hover:bg-[#455CE9] hover:border-[#455CE9] text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => scrollRailBy(380)}
            aria-label="Scroll proof rail right"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 hover:bg-[#455CE9] hover:border-[#455CE9] text-white transition-colors cursor-pointer"
          >
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Horizontal Interactive Left-to-Right Kinetic Rail */}
      <div
        ref={railRef}
        onMouseEnter={() => {
          hoveredRef.current = true;
        }}
        onMouseLeave={() => {
          hoveredRef.current = false;
          handlePointerUp();
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="w-full overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing px-6 sm:px-10 py-2"
      >
        <div className="flex w-max items-stretch gap-5">
          {/* Primary Track */}
          <div ref={firstSetRef} className="flex items-stretch gap-5 shrink-0">
            {railItems.map((item) => renderCard(item, false))}
          </div>

          {/* Seamless Duplicate Track for endless Left-to-Right Glide in "All" mode */}
          {filter === "all" && (
            <div className="flex items-stretch gap-5 shrink-0" aria-hidden="true">
              {railItems.map((item) => renderCard(item, true))}
            </div>
          )}
        </div>
      </div>

      {/* Clean Fullscreen Lightbox Modal for Reels / HusAI / Financify */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-lg p-4 sm:p-8"
          onClick={() => setLightbox(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full overflow-y-auto rounded-[28px] border border-white/15 bg-[#0D0F14] p-5 sm:p-8 shadow-2xl ${
              lightbox.kind === "reel"
                ? "max-w-md"
                : "max-w-5xl max-h-[90vh]"
            }`}
          >
            <button
              type="button"
              onClick={() => setLightbox(null)}
              aria-label="Close expanded proof"
              className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-[#1C1D20] text-white hover:bg-[#455CE9] transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            {lightboxReel && (
              <div className="space-y-4">
                <div className="font-mono text-xs uppercase tracking-wider text-[#8FA2FF]">
                  {lightboxReel.num} // {lightboxReel.tag} ·{" "}
                  {lightboxReel.platform}
                </div>
                <video
                  src={lightboxReel.videoSrc}
                  poster={lightboxReel.posterSrc}
                  controls
                  autoPlay
                  playsInline
                  className="aspect-[9/16] w-full max-h-[68vh] rounded-2xl bg-black object-contain"
                />
                <div className="text-sm text-white/80 font-mono">
                  Hook: {lightboxReel.hookText}
                </div>
              </div>
            )}

            {lightbox.kind === "husai" && (
              <div className="space-y-6">
                <div>
                  <div className="font-mono text-xs uppercase tracking-wider text-[#8FA2FF]">
                    HUSAI // REAL-TIME AI CALL COACH (USTP STARTUP LAB 1.00)
                  </div>
                  <h3 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-semibold text-white">
                    60s Remotion Reveal + 69/100 Post-Call Breakdown
                  </h3>
                </div>

                <video
                  src="/husai/husai-demo.mp4"
                  poster="/husai/husai-poster.jpg"
                  controls
                  autoPlay
                  playsInline
                  className="aspect-video w-full rounded-2xl border border-white/10 bg-black"
                />

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {HUSAI_SCORES.map((s) => (
                    <div
                      key={s.label}
                      className="rounded-2xl border border-white/10 bg-white/5 p-3"
                    >
                      <div className="font-mono text-[10px] uppercase tracking-wider text-white/60">
                        {s.label}
                      </div>
                      <div className="mt-1 font-mono text-xl font-semibold tabular-nums text-white">
                        {s.value}/100
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {lightbox.kind === "financify" && <FinancifySandbox />}
          </div>
        </div>
      )}
    </section>
  );
}
