import { TOOLKIT_GROUPS } from "@/data/portfolio";

export function ToolkitSection() {
  return (
    <section id="toolkit" className="border-b border-[var(--color-hairline)] bg-[var(--color-paper-alt)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-10 border-b border-[var(--color-ink)]">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-signal)]">
              05 // Tech Stack &amp; Toolkit
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
              Tools grouped by operational function.
            </h2>
          </div>
          <p className="max-w-md text-sm text-[var(--color-ink-muted)]">
            Every tool in this stack is tied to production work—from internal audit dashboards to international paid social creative pipelines.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 border-l border-[var(--color-hairline)]">
          {TOOLKIT_GROUPS.map((group) => (
            <div
              key={group.code}
              className="border-r border-b border-[var(--color-hairline)] bg-[var(--color-paper)] p-6 sm:p-8 flex flex-col justify-between gap-6"
            >
              <div>
                <div className="font-mono text-xs text-[var(--color-signal)]">
                  {group.code}
                </div>
                <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--color-ink)]">
                  {group.functionName}
                </h3>
                <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
                  {group.summary}
                </p>
              </div>

              <dl className="divide-y divide-[var(--color-hairline)] border-t border-[var(--color-hairline)]">
                {group.items.map((item) => (
                  <div
                    key={item.name}
                    className="py-2.5 flex items-baseline justify-between gap-4"
                  >
                    <dt className="font-mono text-xs font-medium text-[var(--color-ink)]">
                      {item.name}
                    </dt>
                    <dd className="text-xs text-right text-[var(--color-ink-muted)]">
                      {item.role}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
