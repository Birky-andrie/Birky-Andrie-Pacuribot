"use client";

import { ArrowUpRight } from "lucide-react";

interface EngagementModelsProps {
  onSelectModel: (serviceTitle: string) => void;
}

const ENGAGEMENTS = [
  {
    code: "MOD-01",
    name: "Workflow & MVP Sprint",
    cadence: "2–4 Weeks · Fixed Scope",
    idealFor: "Replacing manual Excel sheets or launching an AI-backed web prototype.",
    includes: [
      "System architecture & role-based permissions",
      "Responsive React / Next.js + Python/Node build",
      "Sub-5-second reporting & audit trail setup",
      "Production deployment on Vercel / Render",
    ],
    mappedService: "Custom Web & Workflow Engineering",
  },
  {
    code: "MOD-02",
    name: "Direct-Response Creative Batch",
    cadence: "Monthly Retainer or Per-Batch",
    idealFor: "D2C brands scaling Meta, TikTok, and Pinterest paid acquisition.",
    includes: [
      "20–40s beat-synced UGC & text-led ad cuts",
      "A/B hook variations (pain point vs. social proof)",
      "Mobile sound-off UI/UX typography hierarchy",
      "Full Foley sound design & commercial audio mix",
    ],
    mappedService: "Direct-Response Video & Creative Production",
  },
  {
    code: "MOD-03",
    name: "Technical Project Leadership",
    cadence: "Fractional / Milestone-Based",
    idealFor: "Early-stage founders needing structured SDLC execution and QA rigor.",
    includes: [
      "End-to-end SDLC & architecture documentation",
      "ClickUp sprint backlogs & developer coordination",
      "QA test plans, defect logs & risk registers",
      "Weekly stakeholder demos & release management",
    ],
    mappedService: "Technical Project Leadership",
  },
];

export function EngagementModels({ onSelectModel }: EngagementModelsProps) {
  return (
    <section id="engagements" className="border-b border-[var(--color-hairline)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-10 border-b border-[var(--color-ink)]">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-signal)]">
              04 // Engagement Models
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
              Clear ways to work together.
            </h2>
          </div>
          <p className="max-w-md text-sm text-[var(--color-ink-muted)]">
            No vague agency retainers. Choose a structured sprint, creative batch, or technical leadership track aligned to your bottleneck.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 border-l border-[var(--color-hairline)]">
          {ENGAGEMENTS.map((model) => (
            <div
              key={model.code}
              className="border-r border-b border-[var(--color-hairline)] bg-[var(--color-paper)] p-6 sm:p-8 flex flex-col justify-between gap-8"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-[var(--color-signal)] font-medium">
                    {model.code}
                  </span>
                  <span className="border border-[var(--color-hairline)] bg-[var(--color-paper-alt)] px-2 py-0.5 text-[11px] text-[var(--color-ink)]">
                    {model.cadence}
                  </span>
                </div>

                <h3 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--color-ink)]">
                  {model.name}
                </h3>

                <p className="text-sm leading-relaxed text-[var(--color-ink-muted)]">
                  {model.idealFor}
                </p>

                <ul className="space-y-2.5 pt-4 border-t border-[var(--color-hairline)]">
                  {model.includes.map((item) => (
                    <li
                      key={item}
                      className="font-mono text-xs text-[var(--color-ink)] flex items-start gap-2"
                    >
                      <span className="text-[var(--color-signal)]" aria-hidden="true">
                        +
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href="#contact"
                onClick={() => onSelectModel(model.mappedService)}
                className="inline-flex items-center justify-between border border-[var(--color-ink)] bg-[var(--color-ink)] px-4 py-3 font-mono text-xs uppercase tracking-wider text-[var(--color-paper)] hover:bg-[var(--color-signal)] hover:border-[var(--color-signal)] transition-colors"
              >
                <span>Select {model.name}</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
