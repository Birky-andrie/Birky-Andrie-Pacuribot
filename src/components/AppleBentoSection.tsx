"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Cpu, Film, Globe, Zap } from "lucide-react";
import type { ProofTab } from "@/data/portfolio";

interface AppleBentoSectionProps {
  onJumpToProof: (tab: ProofTab) => void;
  onSelectService: (serviceTitle: string) => void;
}

const WAVE_BARS = [42, 78, 56, 94, 64, 88, 48, 100, 72, 84, 52, 90, 60, 76];

export function AppleBentoSection({
  onJumpToProof,
  onSelectService,
}: AppleBentoSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="theme-surface bg-[var(--color-paper)] text-[var(--color-ink)] py-24 sm:py-32 border-b border-[var(--color-hairline)]"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-12">
        {/* Minimal Apple Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-12">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#455CE9]">
              03 // Core Pillars
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl sm:text-5xl font-semibold tracking-[-0.03em] text-[var(--color-ink)]">
              Three disciplines. One system.
            </h2>
          </div>
          <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-ink-muted)]">
            CREATIVE &middot; TECHNICAL VA &middot; CS ENGINEERING
          </p>
        </div>

        {/* 4-Card Asymmetric Apple Squircle Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* BENTO 01 (7 COLS): 9:16 Direct-Response Video & Motion */}
          <article
            style={{ transitionDelay: "0ms" }}
            className={`md:col-span-7 group relative overflow-hidden rounded-[28px] border border-[var(--color-hairline)] bg-[var(--color-paper-alt)] p-7 sm:p-9 flex flex-col justify-between gap-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] transition-all duration-700 ease-out-expo ${
              visible
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-8 scale-[0.97]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-hairline)] bg-[var(--color-paper)] px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink)]">
                <Film className="h-3.5 w-3.5 text-[#455CE9]" />
                01 // 9:16 Direct-Response Video
              </span>
              <button
                type="button"
                onClick={() => onJumpToProof("hackerlily")}
                className="inline-flex items-center gap-1 font-mono text-xs text-[#455CE9] hover:underline cursor-pointer"
              >
                <span>6 Reels</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Animated Kinetic Timeline Micro-Graphic */}
            <div className="rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-paper)] p-4 flex items-center justify-between gap-4">
              <div className="flex items-end gap-1.5 h-10 flex-1">
                {WAVE_BARS.map((h, i) => (
                  <span
                    key={i}
                    style={{
                      height: `${h}%`,
                      animationDelay: `${i * 90}ms`,
                    }}
                    className="flex-1 rounded-full bg-[#455CE9]/80 group-hover:bg-[#455CE9] animate-pulse transition-all"
                  />
                ))}
              </div>
              <div className="text-right shrink-0">
                <div className="font-mono text-xl sm:text-2xl font-semibold tabular-nums text-[var(--color-ink)]">
                  45+ Cuts
                </div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-ink-muted)]">
                  Hackerlily DE / AU
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
                Beat-synced 9:16 paid social ads built to convert cold traffic.
              </h3>

              <div className="flex flex-wrap gap-1.5">
                {[
                  "CapCut Pro",
                  "A/B Hook Testing",
                  "Sound-Off Typography",
                  "Foley Mix",
                  "Remotion",
                  "Meta · TikTok · Pinterest",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[var(--color-hairline)] bg-[var(--color-paper)] px-3 py-1 font-mono text-[11px] text-[var(--color-ink-muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>

          {/* BENTO 02 (5 COLS): Technical VA & Global Remote Ops */}
          <article
            style={{ transitionDelay: "90ms" }}
            className={`md:col-span-5 group relative overflow-hidden rounded-[28px] border border-[var(--color-hairline)] bg-[var(--color-paper-alt)] p-7 sm:p-9 flex flex-col justify-between gap-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] transition-all duration-700 ease-out-expo ${
              visible
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-8 scale-[0.97]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-hairline)] bg-[var(--color-paper)] px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink)]">
                <Globe className="h-3.5 w-3.5 text-[#455CE9]" />
                02 // Tech VA &amp; SMM Ops
              </span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                UTC+8 Ready
              </span>
            </div>

            {/* Live Global Shift Overlap Pill Matrix */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { zone: "AU / APAC", status: "Full Overlap" },
                { zone: "EU (Germany)", status: "Proven Client" },
                { zone: "UK / US", status: "Flexible Shift" },
                { zone: "Alpha VA", status: "Certified" },
              ].map((z) => (
                <div
                  key={z.zone}
                  className="rounded-xl border border-[var(--color-hairline)] bg-[var(--color-paper)] px-3 py-2.5"
                >
                  <div className="font-mono text-xs font-semibold text-[var(--color-ink)]">
                    {z.zone}
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-ink-muted)]">
                    {z.status}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
                Executive operations, ClickUp sprints, and multi-platform SMM.
              </h3>

              <div className="flex flex-wrap gap-1.5">
                {[
                  "ClickUp",
                  "Google Workspace",
                  "Freelance Movement",
                  "Claude / GPT Ops",
                  "Content Calendars",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[var(--color-hairline)] bg-[var(--color-paper)] px-3 py-1 font-mono text-[11px] text-[var(--color-ink-muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>

          {/* BENTO 03 (5 COLS): <5s Web & Workflow Automation */}
          <article
            style={{ transitionDelay: "180ms" }}
            className={`md:col-span-5 group relative overflow-hidden rounded-[28px] border border-[var(--color-hairline)] bg-[var(--color-paper-alt)] p-7 sm:p-9 flex flex-col justify-between gap-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] transition-all duration-700 ease-out-expo ${
              visible
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-8 scale-[0.97]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-hairline)] bg-[var(--color-paper)] px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink)]">
                <Zap className="h-3.5 w-3.5 text-[#455CE9]" />
                03 // Workflow Automation
              </span>
              <button
                type="button"
                onClick={() => onJumpToProof("pacs")}
                className="inline-flex items-center gap-1 font-mono text-xs text-[#455CE9] hover:underline cursor-pointer"
              >
                <span>Benchmark</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Visual Speed Comparison Micro-Graphic */}
            <div className="rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-paper)] p-4 space-y-2.5">
              <div>
                <div className="flex justify-between font-mono text-[11px] mb-1">
                  <span className="text-[#455CE9] font-semibold">
                    WEB AUDIT ENGINE
                  </span>
                  <span className="tabular-nums font-semibold text-[var(--color-ink)]">
                    1.84s (&lt; 5s SLA)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-[var(--color-paper-alt)] overflow-hidden">
                  <div className="h-full w-[12%] rounded-full bg-[#455CE9]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between font-mono text-[10px] text-[var(--color-ink-muted)] mb-1">
                  <span>MANUAL EXCEL RECONCILIATION</span>
                  <span className="tabular-nums">~20m 00s</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-[var(--color-paper-alt)] overflow-hidden">
                  <div className="h-full w-full rounded-full bg-[var(--color-ink-muted)]/35" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
                Role-based web apps replacing slow manual spreadsheets.
              </h3>

              <div className="flex flex-wrap gap-1.5">
                {[
                  "React / Next.js",
                  "Python",
                  "TypeScript",
                  "Tailwind v4",
                  "RBAC Audit Trails",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[var(--color-hairline)] bg-[var(--color-paper)] px-3 py-1 font-mono text-[11px] text-[var(--color-ink-muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>

          {/* BENTO 04 (7 COLS): Real-Time AI & Cross-Platform Systems */}
          <article
            style={{ transitionDelay: "270ms" }}
            className={`md:col-span-7 group relative overflow-hidden rounded-[28px] border border-[var(--color-hairline)] bg-[var(--color-paper-alt)] p-7 sm:p-9 flex flex-col justify-between gap-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] transition-all duration-700 ease-out-expo ${
              visible
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-8 scale-[0.97]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-hairline)] bg-[var(--color-paper)] px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink)]">
                <Cpu className="h-3.5 w-3.5 text-[#455CE9]" />
                04 // AI &amp; Full-Stack Systems
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onJumpToProof("husai")}
                  className="inline-flex items-center gap-1 font-mono text-xs text-[#455CE9] hover:underline cursor-pointer"
                >
                  <span>HusAI</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onJumpToProof("financify")}
                  className="inline-flex items-center gap-1 font-mono text-xs text-[#455CE9] hover:underline cursor-pointer"
                >
                  <span>Financify</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Architecture Pipeline Nodes Micro-Graphic */}
            <div className="grid grid-cols-3 gap-2.5">
              {[
                {
                  metric: "4.0s VAD",
                  sub: "HusAI Live Call Coach",
                },
                {
                  metric: "6 OS Targets",
                  sub: "Financify Flutter App",
                },
                {
                  metric: "1.00 Grade",
                  sub: "Startup Lab Project Lead",
                },
              ].map((node) => (
                <div
                  key={node.metric}
                  className="rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-paper)] p-3.5"
                >
                  <div className="font-mono text-base sm:text-lg font-semibold tabular-nums text-[var(--color-ink)]">
                    {node.metric}
                  </div>
                  <div className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-[var(--color-ink-muted)]">
                    {node.sub}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <h3 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
                  Real-time Groq/Gemini voice pipelines and multi-OS apps.
                </h3>
                <a
                  href="#contact"
                  onClick={() =>
                    onSelectService("AI & Full-Stack Workflow Engineering")
                  }
                  className="shrink-0 inline-flex items-center gap-1 rounded-full bg-[var(--color-ink)] text-[var(--color-paper)] hover:bg-[#455CE9] hover:text-white px-4 py-2 font-mono text-[11px] uppercase tracking-wider transition-colors"
                >
                  <span>Start a sprint</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {[
                  "Groq LLaMA 3.1 & Whisper",
                  "Gemini Flash",
                  "Electron",
                  "Flutter / Dart",
                  "Node.js / Socket.IO",
                  "Full-SDLC QA",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[var(--color-hairline)] bg-[var(--color-paper)] px-3 py-1 font-mono text-[11px] text-[var(--color-ink-muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
