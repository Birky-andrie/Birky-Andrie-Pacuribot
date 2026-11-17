"use client";

import { ArrowUpRight } from "lucide-react";
import { SERVICES } from "@/data/portfolio";

interface ServicesGridProps {
  onSelectService: (serviceTitle: string) => void;
}

export function ServicesGrid({ onSelectService }: ServicesGridProps) {
  return (
    <section id="services" className="border-b border-[var(--color-hairline)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-10 border-b border-[var(--color-ink)]">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-signal)]">
              01 // Services &amp; Capabilities
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
              Four ways I ship measurable value.
            </h2>
          </div>
          <p className="max-w-md text-sm text-[var(--color-ink-muted)]">
            Structured engagements for remote founders, operations teams, and D2C brands—built on software engineering rigor and direct-response conversion data.
          </p>
        </div>

        {/* Exposed 2x2 Swiss Hairline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-l border-[var(--color-hairline)]">
          {SERVICES.map((service) => (
            <article
              key={service.id}
              className="border-r border-b border-[var(--color-hairline)] p-6 sm:p-8 flex flex-col justify-between gap-8 bg-[var(--color-paper)] hover:bg-[var(--color-paper-alt)] transition-colors"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-[var(--color-signal)] font-medium tabular-nums">
                    PILLAR {service.number}
                  </span>
                  <span className="text-[var(--color-ink-muted)] uppercase tracking-wider">
                    {service.audience}
                  </span>
                </div>

                <h3 className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-semibold tracking-[-0.01em] text-[var(--color-ink)]">
                  {service.title}
                </h3>

                <p className="text-sm sm:text-base leading-relaxed text-[var(--color-ink-muted)]">
                  {service.outcome}
                </p>
              </div>

              <div className="space-y-5 pt-4 border-t border-[var(--color-hairline)]">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {service.deliverables.map((item) => (
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

                <a
                  href="#contact"
                  onClick={() => onSelectService(service.title)}
                  className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-[var(--color-ink)] hover:text-[var(--color-signal)] transition-colors"
                >
                  Scope this engagement
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
