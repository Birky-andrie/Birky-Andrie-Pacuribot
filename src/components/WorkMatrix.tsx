"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, ChevronDown, ChevronUp } from "lucide-react";
import { CASE_STUDIES, type WorkCategory } from "@/data/portfolio";

const FILTERS: { id: WorkCategory; label: string }[] = [
  { id: "all", label: "ALL" },
  { id: "engineering", label: "ENGINEERING" },
  { id: "creative", label: "CREATIVE" },
  { id: "leadership", label: "LEADERSHIP" },
  { id: "github", label: "GITHUB REPOS" },
];

interface WorkMatrixProps {
  externalFilter?: WorkCategory;
}

export function WorkMatrix({ externalFilter }: WorkMatrixProps) {
  const [activeFilter, setActiveFilter] = useState<WorkCategory>("all");
  const [expandedId, setExpandedId] = useState<string | null>("pacs-builders");

  useEffect(() => {
    if (externalFilter) {
      setActiveFilter(externalFilter);
    }
  }, [externalFilter]);

  const filtered =
    activeFilter === "all"
      ? CASE_STUDIES
      : CASE_STUDIES.filter((item) => item.categories.includes(activeFilter));

  return (
    <section id="work" className="border-b border-[var(--color-hairline)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[var(--color-ink)]">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-signal)]">
              02 // Selected Work &amp; Verified Repositories
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
              Proof of execution, not just tech stacks.
            </h2>
          </div>

          {/* Filter Bar */}
          <div
            className="flex flex-wrap border-t border-l border-[var(--color-hairline)]"
            role="tablist"
            aria-label="Filter case studies by category"
          >
            {FILTERS.map((filter) => {
              const count =
                filter.id === "all"
                  ? CASE_STUDIES.length
                  : CASE_STUDIES.filter((c) =>
                      c.categories.includes(filter.id as Exclude<WorkCategory, "all">)
                    ).length;
              const isActive = activeFilter === filter.id;

              return (
                <button
                  key={filter.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`border-r border-b border-[var(--color-hairline)] px-3.5 py-2 font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                    isActive
                      ? "bg-[var(--color-ink)] text-[var(--color-paper)]"
                      : "bg-[var(--color-paper)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-paper-alt)]"
                  }`}
                >
                  {filter.label}{" "}
                  <span className="tabular-nums opacity-70">
                    ({String(count).padStart(2, "0")})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Structured Case Study Rows */}
        <div className="divide-y divide-[var(--color-hairline)] border-b border-[var(--color-hairline)]">
          {filtered.map((study) => {
            const isExpanded = expandedId === study.id;

            return (
              <article
                key={study.id}
                className="py-6 sm:py-8 transition-colors"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Metadata & Metric */}
                  <div className="lg:col-span-3 flex lg:flex-col justify-between gap-2">
                    <div className="font-mono text-xs text-[var(--color-ink-muted)] space-y-1">
                      <div className="text-[var(--color-signal)] font-medium">
                        {study.code} // {study.period}
                      </div>
                      <div>{study.clientOrContext}</div>
                    </div>

                    <div className="lg:pt-3 text-right lg:text-left">
                      <div className="font-mono text-2xl sm:text-3xl font-semibold tabular-nums text-[var(--color-ink)]">
                        {study.primaryMetric}
                      </div>
                      <div className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink-muted)]">
                        {study.primaryMetricLabel}
                      </div>
                    </div>
                  </div>

                  {/* Core Title, Summary & Expandable Breakdown */}
                  <div className="lg:col-span-9 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <h3 className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-semibold tracking-[-0.01em] text-[var(--color-ink)]">
                          {study.title}
                        </h3>
                        <p className="mt-1 font-mono text-xs text-[var(--color-ink-muted)]">
                          {study.role}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {study.links?.live && (
                          <a
                            href={study.links.live}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 border border-[var(--color-ink)] bg-[var(--color-ink)] px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-[var(--color-paper)] hover:bg-[var(--color-signal)] hover:border-[var(--color-signal)] transition-colors"
                          >
                            Live App
                            <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                          </a>
                        )}
                        {study.links?.repo && (
                          <a
                            href={study.links.repo}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 border border-[var(--color-hairline)] px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink)] hover:border-[var(--color-ink)] transition-colors"
                          >
                            GitHub
                            <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedId(isExpanded ? null : study.id)
                          }
                          aria-expanded={isExpanded}
                          className="inline-flex items-center gap-1 border border-[var(--color-hairline)] px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink)] hover:border-[var(--color-ink)] transition-colors cursor-pointer"
                        >
                          {isExpanded ? "Collapse" : "Details"}
                          {isExpanded ? (
                            <ChevronUp className="h-3 w-3" aria-hidden="true" />
                          ) : (
                            <ChevronDown className="h-3 w-3" aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </div>

                    <p className="text-sm sm:text-base leading-relaxed text-[var(--color-ink)]">
                      {study.impact}
                    </p>

                    {isExpanded && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[var(--color-hairline)]">
                        <div className="bg-[var(--color-paper-alt)] p-4 border border-[var(--color-hairline)]">
                          <div className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink-muted)] mb-1.5">
                            Problem
                          </div>
                          <p className="text-sm leading-relaxed text-[var(--color-ink)]">
                            {study.problem}
                          </p>
                        </div>
                        <div className="bg-[var(--color-paper-alt)] p-4 border border-[var(--color-hairline)]">
                          <div className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink-muted)] mb-1.5">
                            Execution
                          </div>
                          <p className="text-sm leading-relaxed text-[var(--color-ink)]">
                            {study.execution}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {study.stack.map((tag) => (
                        <span
                          key={tag}
                          className="border border-[var(--color-hairline)] bg-[var(--color-paper)] px-2.5 py-1 font-mono text-[11px] text-[var(--color-ink-muted)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
