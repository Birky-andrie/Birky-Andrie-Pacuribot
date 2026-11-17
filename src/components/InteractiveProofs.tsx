"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Check, Copy, Play, RotateCcw } from "lucide-react";

type ProofTab = "husai" | "pacs" | "hackerlily";

const HUSAI_SCENARIOS = [
  {
    id: "scope",
    title: "Scenario A: Unplanned Scope Expansion",
    transcript:
      'Client (US Founder): "Can we also add automated Stripe invoicing and multi-tenant workspaces before Friday\'s demo?"',
    suggestions: [
      {
        tag: "BOUNDARY + OPTIONS",
        text: "To keep Friday's core demo rock-solid, let's lock the current sprint first—I can scope Stripe invoicing as a 3-day Phase 2 immediately after.",
      },
      {
        tag: "TRADE-OFF FRAME",
        text: "We can pull Stripe invoicing into Friday if we defer the analytics export module. Which one drives more value for your investor walkthrough?",
      },
      {
        tag: "PROTOTYPE COMPROMISE",
        text: "I can wire a clickable UI state for the invoice view by Friday so your demo flows end-to-end, then connect live webhooks on Monday.",
      },
    ],
  },
  {
    id: "creative",
    title: "Scenario B: Ad Hook Fatigue (D2C Stakeholder)",
    transcript:
      'Client (DE Brand Lead): "Our Meta CPA crept up 18% this week on the talking-head reels. What\'s our next test batch?"',
    suggestions: [
      {
        tag: "A/B HOOK PIVOT",
        text: "Let's keep the proven 15–30s body and swap the first 3 seconds with 3 text-led 'Competitor Switching' hooks optimized for sound-off mobile feeds.",
      },
      {
        tag: "SOCIAL PROOF OVERLAY",
        text: "I'll inject dynamic review badge callouts at the 4-second mark where drop-off peaked, plus a faster 120-BPM beat-synced cut for TikTok.",
      },
      {
        tag: "FORMAT VARIATION",
        text: "Let's test a 'Mum Math' pain-point angle against a pure visual product demo so Meta's algorithm has two distinct creative buckets.",
      },
    ],
  },
];

const AD_TIMELINE = [
  {
    phase: "00–03s",
    title: "Pattern-Interrupt Hook",
    visual: "SPLIT-SCREEN VISUAL SHOCK + BOLD 72PT SANS HEADLINE",
    caption: '"Why 73% of toddler carriers sit unused after week two..."',
    audio: "Sub-bass riser + crisp paper-tear Foley at frame 08",
    abVariant: "Variant B: Direct '3 Back-Pain Mistakes' text-only hook (+22% thumbstop target)",
  },
  {
    phase: "03–12s",
    title: "Pain Point Agitation",
    visual: "RAPID 1.2s UGC CUTS // HIGH-CONTRAST KINETIC CAPTIONS",
    caption: '"Straps digging into shoulders. 4 buckles just to get out the door."',
    audio: "Muted-safe kinetic word highlighting synced to 124 BPM kick",
    abVariant: "Tested talking-head vs. no-voiceover B-roll for sound-off commuters",
  },
  {
    phase: "12–25s",
    title: "German Brand Proof & Demo",
    visual: "HIPSURFER 3-SECOND MOUNT DEMO + FLOATING AWARD BADGE",
    caption: '"Ergonomic hip seat. 5-second clip-and-go. 4.9★ across Europe."',
    audio: "Satisfying buckle-click Foley + upbeat acoustic/electronic drop",
    abVariant: "Dynamic overlay swapping German vs. EU review count badges",
  },
  {
    phase: "25–35s",
    title: "Risk-Reversal CTA",
    visual: "OFFER CARD // HIGH-CONTRAST ARROW TO NATIVE SHOP BUTTON",
    caption: '"Try HipSurfer risk-free for 30 days — Tap Shop Now."',
    audio: "Clean vocal resolving chord + subtle UI click sound",
    abVariant: "Urgency shipping callout vs. 30-day trial guarantee end-card",
  },
];

const AUDIT_ROWS = [
  { txId: "TX-9041", item: "Portland Cement (40kg)", site: "Zone B Foundation", role: "Staff -> Auditor", delta: "-140 bags", status: "VERIFIED" },
  { txId: "TX-9042", item: "Deformed Steel Bar 16mm", site: "Pier 04 Rebar", role: "Admin Override", delta: "+320 pcs", status: "VERIFIED" },
  { txId: "TX-9043", item: "Marine Plywood 3/4\"", site: "Formwork North", role: "Staff Entry", delta: "-45 sheets", status: "FLAGGED: COUNT MISMATCH" },
  { txId: "TX-9044", item: "Ready-Mix Concrete 3000psi", site: "Slab Pour L2", role: "Auditor Signed", delta: "+24 cu.m", status: "VERIFIED" },
];

export function InteractiveProofs() {
  const [activeTab, setActiveTab] = useState<ProofTab>("husai");

  // HusAI state
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [simState, setSimState] = useState<"idle" | "listening" | "ready">("ready");
  const [elapsedMs, setElapsedMs] = useState(4000);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  // Pacs Builders state
  const [auditMode, setAuditMode] = useState<"excel" | "web">("web");
  const [runningAudit, setRunningAudit] = useState(false);
  const [auditLatency, setAuditLatency] = useState("1.84s");

  // Hackerlily state
  const [adStageIdx, setAdStageIdx] = useState(0);

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

  const scenario = HUSAI_SCENARIOS[scenarioIdx];
  const activeAdStage = AD_TIMELINE[adStageIdx];

  return (
    <section id="proof-lab" className="border-b border-[var(--color-hairline)] bg-[var(--color-paper-alt)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[var(--color-ink)]">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-signal)]">
              02 // Interactive Proof Lab
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
              Inspect the systems and creative mechanics directly.
            </h2>
          </div>

          <div
            className="flex flex-wrap border-t border-l border-[var(--color-ink)]"
            role="tablist"
            aria-label="Interactive proof demonstrations"
          >
            {[
              { id: "husai" as const, label: "01 // HUSAI CALL COACH" },
              { id: "pacs" as const, label: "02 // PACS <5S AUDIT" },
              { id: "hackerlily" as const, label: "03 // 9:16 AD ANATOMY" },
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

        {/* TAB 01: HusAI Live Simulator */}
        {activeTab === "husai" && (
          <div className="mt-8 border border-[var(--color-ink)] bg-[var(--color-paper)]">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-ink)] bg-[var(--color-paper-alt)] px-4 sm:px-6 py-3 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 bg-[var(--color-signal)]" />
                <span className="font-medium text-[var(--color-ink)]">
                  HUSAI // &ldquo;THE LIFELINE&rdquo; LIVE PAUSE ENGINE
                </span>
                <span className="hidden sm:inline text-[var(--color-ink-muted)]">
                  (Groq LLaMA 3.1 + Whisper STT)
                </span>
              </div>
              <a
                href="https://hus-ai-five.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[var(--color-ink)] hover:text-[var(--color-signal)] underline underline-offset-4"
              >
                Launch Full App on Vercel
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-5 p-6 border-b lg:border-b-0 lg:border-r border-[var(--color-hairline)] flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  <div className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink-muted)]">
                    Select Live Call Scenario
                  </div>
                  <div className="flex flex-col gap-2">
                    {HUSAI_SCENARIOS.map((s, idx) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setScenarioIdx(idx);
                          triggerLifeline();
                        }}
                        className={`text-left border px-3.5 py-2.5 font-mono text-xs transition-colors cursor-pointer ${
                          scenarioIdx === idx
                            ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)]"
                            : "border-[var(--color-hairline)] bg-[var(--color-paper-alt)] text-[var(--color-ink)] hover:border-[var(--color-ink)]"
                        }`}
                      >
                        {s.title}
                      </button>
                    ))}
                  </div>

                  <div className="border border-[var(--color-hairline)] bg-[var(--color-paper-alt)] p-4">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-ink-muted)]">
                      Whisper Live Transcript Stream
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink)]">
                      {scenario.transcript}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-[var(--color-hairline)]">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-[var(--color-ink-muted)]">SILENCE DETECTOR:</span>
                    <span className="tabular-nums font-semibold text-[var(--color-ink)]">
                      {(elapsedMs / 1000).toFixed(1)}s / 4.0s threshold
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[var(--color-paper-alt)] border border-[var(--color-hairline)]">
                    <div
                      className="h-full bg-[var(--color-signal)] transition-all duration-75"
                      style={{ width: `${(elapsedMs / 4000) * 100}%` }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={triggerLifeline}
                    className="w-full inline-flex items-center justify-center gap-2 border border-[var(--color-ink)] bg-[var(--color-ink)] px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-[var(--color-paper)] hover:bg-[var(--color-signal)] hover:border-[var(--color-signal)] transition-colors cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Simulate 4s Client Pause
                  </button>
                </div>
              </div>

              <div className="lg:col-span-7 p-6 space-y-4">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="uppercase tracking-wider text-[var(--color-ink-muted)]">
                    AI Coaching Output (3 Instant Angles)
                  </span>
                  <span className="text-[var(--color-signal)] tabular-nums">
                    {simState === "listening" ? "DETECTING PAUSE..." : "READY // <380ms GROQ INFERENCE"}
                  </span>
                </div>

                {simState === "listening" ? (
                  <div className="h-64 flex flex-col items-center justify-center border border-dashed border-[var(--color-hairline)] font-mono text-xs text-[var(--color-ink-muted)]">
                    Listening for 4.0s silence window ({(elapsedMs / 1000).toFixed(1)}s)...
                  </div>
                ) : (
                  <div className="space-y-3">
                    {scenario.suggestions.map((item, i) => (
                      <div
                        key={item.tag}
                        className="border border-[var(--color-hairline)] bg-[var(--color-paper-alt)] p-4 flex flex-col gap-2"
                      >
                        <div className="flex items-center justify-between font-mono text-[11px]">
                          <span className="bg-[var(--color-ink)] text-[var(--color-paper)] px-2 py-0.5">
                            0{i + 1} // {item.tag}
                          </span>
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                await navigator.clipboard.writeText(item.text);
                                setCopiedIdx(i);
                                setTimeout(() => setCopiedIdx(null), 1500);
                              } catch {
                                // ignore
                              }
                            }}
                            className="inline-flex items-center gap-1 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] cursor-pointer"
                          >
                            {copiedIdx === i ? (
                              <>
                                <Check className="h-3 w-3 text-[var(--color-signal)]" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span>Use Line</span>
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-sm leading-relaxed text-[var(--color-ink)]">
                          &ldquo;{item.text}&rdquo;
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 02: Pacs Builders Audit Benchmark */}
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
                  {auditMode === "excel" ? "~20 min" : runningAudit ? "Running..." : auditLatency}
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
                      <th className="border border-[var(--color-hairline)] px-3 py-2">TX ID</th>
                      <th className="border border-[var(--color-hairline)] px-3 py-2">MATERIAL</th>
                      <th className="border border-[var(--color-hairline)] px-3 py-2">DESTINATION</th>
                      <th className="border border-[var(--color-hairline)] px-3 py-2">RBAC TRAIL</th>
                      <th className="border border-[var(--color-hairline)] px-3 py-2">DELTA</th>
                      <th className="border border-[var(--color-hairline)] px-3 py-2">AUDIT STATUS</th>
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

        {/* TAB 03: Hackerlily 9:16 Direct-Response Ad Anatomy */}
        {activeTab === "hackerlily" && (
          <div className="mt-8 border border-[var(--color-ink)] bg-[var(--color-paper)] p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Simulated 9:16 Mobile Ad Frame */}
              <div className="lg:col-span-4 flex justify-center">
                <div className="w-full max-w-[260px] aspect-[9/16] border-2 border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)] p-4 flex flex-col justify-between relative">
                  <div className="flex items-center justify-between font-mono text-[10px] text-[var(--color-paper)]/70">
                    <span>9:16 PAID SOCIAL</span>
                    <span className="bg-[var(--color-signal)] text-[var(--color-paper)] px-1.5 py-0.5">
                      {activeAdStage.phase}
                    </span>
                  </div>

                  <div className="space-y-3 my-auto border-y border-[var(--color-paper)]/20 py-5">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-signal)]">
                      {activeAdStage.visual}
                    </div>
                    <p className="font-[family-name:var(--font-display)] text-lg font-semibold leading-snug">
                      {activeAdStage.caption}
                    </p>
                  </div>

                  <div className="space-y-2 font-mono text-[10px] text-[var(--color-paper)]/80">
                    <div className="border border-[var(--color-paper)]/30 px-2 py-1">
                      AUDIO: {activeAdStage.audio}
                    </div>
                    <div className="text-center uppercase tracking-wider bg-[var(--color-paper)] text-[var(--color-ink)] py-1.5 font-semibold">
                      SOUND-OFF SAFE HIERARCHY
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline Scrubber & Conversion Architecture */}
              <div className="lg:col-span-8 space-y-6">
                <div>
                  <div className="font-mono text-xs uppercase tracking-wider text-[var(--color-signal)]">
                    HACKERLILY HIPSURFER (GERMANY) // 20–40s AD ARCHITECTURE
                  </div>
                  <h3 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]">
                    Every second is engineered for thumbstop and hook retention.
                  </h3>
                  <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
                    Select any timestamp block below to inspect how UI/UX typography, Foley sound design, and A/B hook variations are layered for Meta, TikTok, and Pinterest paid acquisition.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {AD_TIMELINE.map((stage, idx) => {
                    const isSelected = idx === adStageIdx;
                    return (
                      <button
                        key={stage.phase}
                        type="button"
                        onClick={() => setAdStageIdx(idx)}
                        className={`text-left border p-4 transition-colors cursor-pointer ${
                          isSelected
                            ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)]"
                            : "border-[var(--color-hairline)] bg-[var(--color-paper-alt)] text-[var(--color-ink)] hover:border-[var(--color-ink)]"
                        }`}
                      >
                        <div className="flex items-center justify-between font-mono text-xs">
                          <span
                            className={
                              isSelected
                                ? "text-[var(--color-signal)] font-semibold"
                                : "text-[var(--color-signal)]"
                            }
                          >
                            {stage.phase}
                          </span>
                          <span className="text-[10px] uppercase opacity-75">
                            STAGE 0{idx + 1}
                          </span>
                        </div>
                        <div className="mt-1 font-[family-name:var(--font-display)] text-base font-semibold">
                          {stage.title}
                        </div>
                        <p
                          className={`mt-1 text-xs leading-relaxed ${
                            isSelected
                              ? "text-[var(--color-paper)]/80"
                              : "text-[var(--color-ink-muted)]"
                          }`}
                        >
                          {stage.abVariant}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
