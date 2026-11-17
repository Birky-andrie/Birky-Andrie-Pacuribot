"use client";

import { useState } from "react";
import { ArrowDownRight, ArrowUpRight, Check, Copy } from "lucide-react";
import { HERO_METRICS, PROFILE } from "@/data/portfolio";

export function Hero() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${PROFILE.email}`;
    }
  };

  return (
    <section className="border-b border-[var(--color-hairline)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Editorial Positioning */}
          <div className="lg:col-span-7 py-12 sm:py-16 lg:py-20 lg:pr-12 lg:border-r border-[var(--color-hairline)] flex flex-col justify-between gap-10">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs uppercase tracking-wider text-[var(--color-ink-muted)]">
                <span className="inline-flex items-center gap-1.5 text-[var(--color-ink)]">
                  <span className="h-1.5 w-1.5 bg-[var(--color-signal)]" aria-hidden="true" />
                  Available for Global Remote
                </span>
                <span>//</span>
                <span>{PROFILE.education}</span>
              </div>

              <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold leading-[1.03] tracking-[-0.03em] text-[var(--color-ink)]">
                I engineer fast internal web systems and direct-response video assets that drive measurable revenue.
              </h1>

              <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-[var(--color-ink-muted)]">
                <strong className="font-medium text-[var(--color-ink)]">
                  CS Engineer + Creative Technologist.
                </strong>{" "}
                I replace manual spreadsheet bottlenecks with role-based web applications
                (&lt;5s audit reporting) and produce A/B-tested Meta &amp; TikTok ad creatives
                for international brands—backed by full-SDLC leadership.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 border border-[var(--color-ink)] bg-[var(--color-ink)] px-5 py-3 font-mono text-xs uppercase tracking-wider text-[var(--color-paper)] hover:bg-[var(--color-signal)] hover:border-[var(--color-signal)] transition-colors"
                >
                  Book a Discovery Call
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>

                <a
                  href="#services"
                  className="inline-flex items-center gap-2 border border-[var(--color-ink)] bg-transparent px-5 py-3 font-mono text-xs uppercase tracking-wider text-[var(--color-ink)] hover:bg-[var(--color-paper-alt)] transition-colors"
                >
                  Explore Services
                  <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
                </a>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-2 border border-[var(--color-hairline)] bg-transparent px-4 py-3 font-mono text-xs text-[var(--color-ink-muted)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)] transition-colors cursor-pointer"
                  aria-label="Copy email address"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[var(--color-signal)]" aria-hidden="true" />
                      <span>Copied Email</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{PROFILE.email}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Bottom Hero Strip: Verified Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 border-t border-l border-[var(--color-hairline)]">
              {HERO_METRICS.map((metric) => (
                <div
                  key={metric.label}
                  className="border-r border-b border-[var(--color-hairline)] p-4 bg-[var(--color-paper)]"
                >
                  <div className="font-mono text-2xl sm:text-3xl font-semibold tabular-nums text-[var(--color-ink)]">
                    {metric.value}
                  </div>
                  <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink)]">
                    {metric.label}
                  </div>
                  <div className="mt-0.5 text-xs text-[var(--color-ink-muted)]">
                    {metric.source}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Clean Structured 4:5 Studio Portrait Slot */}
          <div className="lg:col-span-5 py-8 sm:py-12 lg:py-20 lg:pl-12 flex flex-col justify-center">
            <figure className="border border-[var(--color-ink)] bg-[var(--color-paper-alt)]">
              <div className="flex items-center justify-between border-b border-[var(--color-ink)] px-3.5 py-2 font-mono text-[11px] uppercase tracking-wider">
                <span>FIG. 01 // {PROFILE.shortName}</span>
                <span className="tabular-nums">4:5 · STUDIO</span>
              </div>

              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--color-paper-alt)]">
                <img
                  src="/portrait.jpg"
                  alt="Birky Andrie L. Pacuribot — CS Engineer and Creative Technologist"
                  className="h-full w-full object-cover object-top"
                />
                {/* Architectural registration marks */}
                <span className="pointer-events-none absolute top-3 left-3 h-3 w-3 border-t border-l border-[var(--color-paper)]/70" />
                <span className="pointer-events-none absolute top-3 right-3 h-3 w-3 border-t border-r border-[var(--color-paper)]/70" />
                <span className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b border-l border-[var(--color-paper)]/70" />
                <span className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-[var(--color-paper)]/70" />
              </div>

              <figcaption className="flex items-center justify-between border-t border-[var(--color-ink)] px-3.5 py-2 font-mono text-[11px] text-[var(--color-ink-muted)]">
                <span>CAGAYAN DE ORO, PH</span>
                <span>USTP BS CS &apos;27</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
