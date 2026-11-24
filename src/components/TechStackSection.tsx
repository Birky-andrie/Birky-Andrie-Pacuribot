"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import {
  PILLAR_BY_ID,
  TECH_PILLARS,
  TECH_STACK_KEYS,
  type TechStackKey,
} from "@/data/techStack";
import {
  createCeramicSwitchAudio,
  type CeramicSwitchAudio,
} from "@/lib/ceramicSwitchAudio";
import type { ThemeMode } from "./ThemeToggle";
import { TechStackFallbackGrid } from "./tech-stack/TechStackFallbackGrid";

const TechStackKeyboard3D = dynamic(
  () => import("./tech-stack/TechStackKeyboard3D"),
  { ssr: false }
);

interface TechStackSectionProps {
  theme: ThemeMode;
}

export function TechStackSection({ theme }: TechStackSectionProps) {
  const isLight = theme === "light";
  const sectionRef = useRef<HTMLElement | null>(null);
  const audioRef = useRef<CeramicSwitchAudio | null>(null);

  const [activeKey, setActiveKey] = useState<TechStackKey | null>(null);
  const [hudOpacity, setHudOpacity] = useState(1);
  const [muted, setMuted] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [shouldMount3D, setShouldMount3D] = useState(false);
  const [rippleTrigger, setRippleTrigger] = useState<{
    row: number;
    nonce: number;
  } | null>(null);

  // Create procedural Ceramic Brown switch synthesizer once
  useEffect(() => {
    const engine = createCeramicSwitchAudio();
    audioRef.current = engine;
    return () => {
      engine.dispose();
      audioRef.current = null;
    };
  }, []);

  // Detect reduced motion or Data Saver -> gracefully show glass fallback grid
  useEffect(() => {
    if (typeof window === "undefined") return;
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const saveData = Boolean(
      (navigator as Navigator & { connection?: { saveData?: boolean } })
        .connection?.saveData
    );
    const evaluate = () => {
      if (motionMq.matches || saveData) {
        setUseFallback(true);
      }
    };
    evaluate();
    motionMq.addEventListener("change", evaluate);
    return () => motionMq.removeEventListener("change", evaluate);
  }, []);

  // Pre-mount Three.js chunk right after initial Hero idle (zero Hero FCP block, zero scroll pop-in)
  useEffect(() => {
    if (useFallback) return;
    let cancelled = false;
    const mount = () => {
      if (!cancelled) setShouldMount3D(true);
    };
    const timer = window.setTimeout(mount, 350);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [useFallback]);

  const handleAudioUnlock = useCallback(() => {
    setAudioUnlocked(true);
  }, []);

  const handleToggleAudio = () => {
    const engine = audioRef.current;
    if (!engine) return;
    if (muted) {
      engine.setMuted(false);
      setMuted(false);
      engine.unlock();
      setAudioUnlocked(true);
      // Play a crisp ceramic brown confirmation thock
      window.setTimeout(() => {
        engine.playPress(1, false);
        window.setTimeout(() => engine.playRelease(1, false), 95);
      }, 20);
    } else if (!audioUnlocked) {
      engine.unlock();
      setAudioUnlocked(true);
      window.setTimeout(() => {
        engine.playPress(1, false);
        window.setTimeout(() => engine.playRelease(1, false), 95);
      }, 20);
    } else {
      engine.setMuted(true);
      setMuted(true);
    }
  };

  const handlePillarClick = (row: number) => {
    setRippleTrigger({ row, nonce: Date.now() });
    const firstInRow = TECH_STACK_KEYS.find((k) => k.row === row) ?? null;
    if (firstInRow) {
      setActiveKey(firstInRow);
      if (useFallback) {
        audioRef.current?.unlock();
        setAudioUnlocked(true);
        audioRef.current?.playPress(row, false);
        window.setTimeout(() => audioRef.current?.playRelease(row, false), 90);
      }
    }
  };

  const activePillar = activeKey ? PILLAR_BY_ID[activeKey.pillar] : null;

  return (
    <section
      id="tech-stack"
      ref={sectionRef}
      aria-label="Interactive Tech Stack Keyboard"
      className={`theme-surface relative w-full bg-[var(--color-paper)] text-[var(--color-ink)] ${
        useFallback ? "min-h-screen py-24" : "h-[210vh] md:h-[220vh]"
      }`}
    >
      {/* Top ambient blend veil into Hero exit (sits above 3D canvas z-10, below HUD z-20) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-[15] h-28 bg-gradient-to-b from-[var(--color-paper)] via-[var(--color-paper)]/65 to-transparent"
      />

      {useFallback ? (
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-10">
          <div className="px-6 text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
              {activeKey ? activeKey.label : "Tech Stack"}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--color-ink-muted)] sm:text-base">
              {activeKey
                ? activeKey.proof
                : "24 tools across Engineering, AI, 9:16 Video & Remote Ops — press any frosted glass keycap."}
            </p>
          </div>

          <TechStackFallbackGrid
            theme={theme}
            activeKey={activeKey}
            audioRef={audioRef}
            onSelectKey={setActiveKey}
            onAudioUnlock={handleAudioUnlock}
          />

          <button
            type="button"
            onClick={handleToggleAudio}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium backdrop-blur-2xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F6BFF] focus-visible:ring-offset-2 ${
              isLight
                ? "border-white/85 bg-white/65 text-[#16171B] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_8px_24px_-10px_rgba(22,23,27,0.16)] hover:bg-white/85 focus-visible:ring-offset-[#F7F6F2]"
                : "border-white/18 bg-white/[0.08] text-white/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] hover:bg-white/[0.14] focus-visible:ring-offset-[#080A0F]"
            }`}
          >
            {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
            <span>
              {muted
                ? "Ceramic Brown: Muted"
                : audioUnlocked
                  ? "Ceramic Brown: ON"
                  : "Try pressing your keyboard! :>"}
            </span>
          </button>
        </div>
      ) : (
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* Ambient radial aura matched to Light gold-pearl / Dark sapphire-obsidian */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 transition-opacity duration-500"
            style={{
              background: isLight
                ? "radial-gradient(60% 52% at 52% 54%, rgba(253, 224, 71, 0.14) 0%, rgba(125, 211, 252, 0.08) 38%, rgba(240, 171, 252, 0.06) 56%, transparent 76%)"
                : "radial-gradient(58% 52% at 52% 54%, rgba(79, 107, 255, 0.15) 0%, rgba(56, 189, 248, 0.09) 38%, rgba(192, 132, 252, 0.06) 56%, transparent 76%)",
            }}
          />

          {/* Top Section Header (clean single heading without eyebrow clutter) */}
          <div
            className="pointer-events-none absolute inset-x-0 top-12 z-20 px-6 text-center transition-opacity duration-300 sm:top-14"
            style={{ opacity: Math.max(0.15, hudOpacity) }}
          >
            <h2 className="text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">
              Tech Stack
            </h2>
            <p className="mt-1.5 text-xs tracking-normal text-[var(--color-ink-muted)] sm:text-sm">
              Hover, click, or tap any glass keycap
            </p>
          </div>

          {/* 3D Procedural Glassmorphism Keyboard Canvas */}
          <div className="absolute inset-0 z-10">
            {shouldMount3D && (
              <TechStackKeyboard3D
                theme={theme}
                sectionRef={sectionRef}
                audioRef={audioRef}
                rippleTrigger={rippleTrigger}
                onActiveKeyChange={setActiveKey}
                onHudOpacityChange={setHudOpacity}
                onAudioUnlock={handleAudioUnlock}
                onWebGLUnavailable={() => setUseFallback(true)}
              />
            )}
          </div>

          {/* Diegetic Angled Skill Proof Readout (Isometric Top-Left Edge on Desktop, Centered Stack on Mobile) */}
          <div
            aria-live="polite"
            className="pointer-events-none absolute inset-x-5 top-32 z-20 flex justify-center transition-opacity duration-200 sm:top-36 lg:inset-x-auto lg:left-[5%] lg:top-[28%] lg:block xl:left-[8%]"
            style={{ opacity: hudOpacity }}
          >
            <div
              className={`max-w-[300px] rounded-2xl border px-4 py-3 backdrop-blur-xl transition-all duration-300 lg:max-w-[310px] lg:[transform:perspective(900px)_rotateZ(-10deg)_skewX(-6deg)] lg:origin-left lg:border-transparent lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none ${
                isLight
                  ? "border-[#16171B]/10 bg-white/75"
                  : "border-white/12 bg-[#0C101A]/75"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-2 w-2 rounded-full transition-colors duration-200"
                  style={{
                    backgroundColor: activeKey
                      ? activeKey.accentHex
                      : isLight
                        ? "#CA8A04"
                        : "#38BDF8",
                  }}
                />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-ink-muted)]">
                  {activeKey && activePillar
                    ? `${activePillar.label} · KEY ${activeKey.shortcutChar}`
                    : "6×4 HYBRID STACK · 24 KEYS"}
                </span>
              </div>

              <p className="mt-1.5 text-2xl font-bold tracking-tight sm:text-3xl lg:text-[2.15rem] lg:leading-[1.06]">
                {activeKey ? activeKey.label : "Explore the stack"}
              </p>

              <p className="mt-1.5 text-xs leading-relaxed text-[var(--color-ink-muted)] sm:text-sm">
                {activeKey
                  ? activeKey.proof
                  : "24 tools across Full-Stack, AI pipelines, 9:16 video ads & remote ops."}
              </p>
            </div>
          </div>

          {/* Bottom Controls Bar: Frosted Liquid Glass Pillar Row Ripples + Ceramic Brown Audio Pill */}
          <div
            className="pointer-events-none absolute inset-x-4 bottom-7 z-20 flex flex-wrap items-center justify-center gap-2 transition-opacity duration-200 sm:bottom-9 sm:gap-2.5"
            style={{ opacity: hudOpacity }}
          >
            {/* Interactive Pillar Row Chips */}
            <div
              className={`pointer-events-auto hidden items-center gap-1 rounded-full border p-1 backdrop-blur-2xl sm:flex ${
                isLight
                  ? "border-white/85 bg-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_10px_28px_-12px_rgba(22,23,27,0.16)]"
                  : "border-white/16 bg-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_12px_30px_-14px_rgba(0,0,0,0.6)]"
              }`}
            >
              {TECH_PILLARS.map((pillar) => {
                const isRowActive = activeKey?.pillar === pillar.id;
                return (
                  <button
                    key={pillar.id}
                    type="button"
                    onClick={() => handlePillarClick(pillar.row)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F6BFF] ${
                      isRowActive
                        ? isLight
                          ? "bg-[#16171B] text-white"
                          : "bg-white text-[#080A0F]"
                        : isLight
                          ? "text-[#16171B]/80 hover:bg-white/75 hover:text-[#16171B]"
                          : "text-white/75 hover:bg-white/12 hover:text-white"
                    }`}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: pillar.accentHex }}
                    />
                    <span>{pillar.shortLabel}</span>
                  </button>
                );
              })}
            </div>

            {/* Tactile Ceramic Brown Switch Audio Pill */}
            <button
              type="button"
              onClick={handleToggleAudio}
              className={`pointer-events-auto inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium backdrop-blur-2xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F6BFF] focus-visible:ring-offset-2 ${
                isLight
                  ? "border-white/85 bg-white/65 text-[#16171B] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_10px_28px_-12px_rgba(22,23,27,0.16)] hover:bg-white/85 focus-visible:ring-offset-[#F7F6F2]"
                  : "border-white/18 bg-white/[0.08] text-white/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_12px_30px_-14px_rgba(0,0,0,0.6)] hover:bg-white/[0.14] focus-visible:ring-offset-[#080A0F]"
              }`}
            >
              {muted ? (
                <VolumeX className="h-3.5 w-3.5 opacity-60" />
              ) : (
                <Volume2
                  className={`h-3.5 w-3.5 ${
                    isLight ? "text-[#CA8A04]" : "text-[#38BDF8]"
                  }`}
                />
              )}
              <span>
                {muted
                  ? "Ceramic Brown: Muted"
                  : audioUnlocked
                    ? "Ceramic Brown: ON"
                    : "Try pressing your keyboard! :>"}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Bottom ambient blend veil into Recent Work (#work) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[15] h-28 bg-gradient-to-t from-[var(--color-paper)] via-[var(--color-paper)]/65 to-transparent"
      />
    </section>
  );
}
