"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { PROFILE, SERVICES } from "@/data/portfolio";

interface ContactSectionProps {
  preselectedService: string;
}

export function ContactSection({ preselectedService }: ContactSectionProps) {
  const [service, setService] = useState<string>(
    preselectedService || SERVICES[0].title
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [brief, setBrief] = useState("");
  const [copiedBrief, setCopiedBrief] = useState(false);

  useEffect(() => {
    if (preselectedService) {
      setService(preselectedService);
    }
  }, [preselectedService]);

  const buildBriefText = () => {
    return [
      `Service: ${service}`,
      `From: ${name || "Prospective Client"} (${email || "No email provided"})`,
      "",
      "Project Brief:",
      brief || "Looking to discuss scope, timeline, and deliverables.",
    ].join("\n");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`[Portfolio Inquiry] ${service}`);
    const body = encodeURIComponent(buildBriefText());
    window.location.href = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
  };

  const handleCopyBrief = async () => {
    try {
      await navigator.clipboard.writeText(buildBriefText());
      setCopiedBrief(true);
      setTimeout(() => setCopiedBrief(false), 2000);
    } catch {
      // Clipboard blocked in restricted browser contexts
    }
  };

  return (
    <footer id="contact" className="bg-[var(--color-paper)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Direct Conversion Details */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-signal)]">
                06 // Start an Engagement
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
                Ready to replace manual bottlenecks or scale ad creatives?
              </h2>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-[var(--color-ink-muted)]">
                Based in Cagayan de Oro City (UTC+8) and working directly with global remote teams across engineering, AI prototyping, and direct-response video production.
              </p>
            </div>

            <div className="border-t border-[var(--color-hairline)] divide-y divide-[var(--color-hairline)] font-mono text-xs">
              <div className="py-3 flex items-center justify-between gap-4">
                <span className="text-[var(--color-ink-muted)]">EMAIL</span>
                <a
                  href={`mailto:${PROFILE.email}`}
                  className="text-[var(--color-ink)] hover:text-[var(--color-signal)] underline underline-offset-4"
                >
                  {PROFILE.email}
                </a>
              </div>
              <div className="py-3 flex items-center justify-between gap-4">
                <span className="text-[var(--color-ink-muted)]">PHONE / WHATSAPP</span>
                <span className="tabular-nums text-[var(--color-ink)]">
                  {PROFILE.phone}
                </span>
              </div>
              <div className="py-3 flex items-center justify-between gap-4">
                <span className="text-[var(--color-ink-muted)]">GITHUB</span>
                <a
                  href={PROFILE.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[var(--color-ink)] hover:text-[var(--color-signal)]"
                >
                  github.com/Birky-andrie
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
              <div className="py-3 flex items-center justify-between gap-4">
                <span className="text-[var(--color-ink-muted)]">EDUCATION</span>
                <span className="text-right text-[var(--color-ink)]">
                  {PROFILE.education}
                </span>
              </div>
              <div className="py-3 flex items-center justify-between gap-4">
                <span className="text-[var(--color-ink-muted)]">LEADERSHIP</span>
                <span className="text-right text-[var(--color-ink)]">
                  {PROFILE.distinction}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Structured Project Brief Builder */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="border border-[var(--color-ink)] bg-[var(--color-paper-alt)] p-6 sm:p-8 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-[var(--color-hairline)] pb-4">
                <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink)]">
                  Project Brief Intake
                </span>
                <span className="font-mono text-[11px] text-[var(--color-ink-muted)]">
                  DIRECT MAILTO + CLIPBOARD
                </span>
              </div>

              <div>
                <label
                  htmlFor="service-select"
                  className="block font-mono text-xs uppercase tracking-wider text-[var(--color-ink-muted)] mb-2"
                >
                  Service Pillar
                </label>
                <select
                  id="service-select"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full border border-[var(--color-ink)] bg-[var(--color-paper)] px-3.5 py-2.5 font-mono text-xs text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-signal)]"
                >
                  {SERVICES.map((item) => (
                    <option key={item.id} value={item.title}>
                      {item.number} — {item.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="client-name"
                    className="block font-mono text-xs uppercase tracking-wider text-[var(--color-ink-muted)] mb-2"
                  >
                    Your Name
                  </label>
                  <input
                    id="client-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="w-full border border-[var(--color-hairline)] bg-[var(--color-paper)] px-3.5 py-2.5 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)]/60 focus:outline-none focus:border-[var(--color-ink)]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="client-email"
                    className="block font-mono text-xs uppercase tracking-wider text-[var(--color-ink-muted)] mb-2"
                  >
                    Work Email
                  </label>
                  <input
                    id="client-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@company.com"
                    className="w-full border border-[var(--color-hairline)] bg-[var(--color-paper)] px-3.5 py-2.5 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)]/60 focus:outline-none focus:border-[var(--color-ink)]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="project-brief"
                  className="block font-mono text-xs uppercase tracking-wider text-[var(--color-ink-muted)] mb-2"
                >
                  Scope, Bottleneck &amp; Timeline
                </label>
                <textarea
                  id="project-brief"
                  rows={4}
                  required
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  placeholder="Describe the workflow bottleneck, product prototype, or paid ad campaign target..."
                  className="w-full border border-[var(--color-hairline)] bg-[var(--color-paper)] px-3.5 py-2.5 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)]/60 focus:outline-none focus:border-[var(--color-ink)]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 border border-[var(--color-ink)] bg-[var(--color-ink)] px-5 py-3 font-mono text-xs uppercase tracking-wider text-[var(--color-paper)] hover:bg-[var(--color-signal)] hover:border-[var(--color-signal)] transition-colors cursor-pointer"
                >
                  Send Brief via Email
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={handleCopyBrief}
                  className="inline-flex items-center gap-2 border border-[var(--color-ink)] bg-[var(--color-paper)] px-4 py-3 font-mono text-xs uppercase tracking-wider text-[var(--color-ink)] hover:bg-[var(--color-paper-alt)] transition-colors cursor-pointer"
                >
                  {copiedBrief ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[var(--color-signal)]" aria-hidden="true" />
                      <span>Brief Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Copy Brief</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-[var(--color-hairline)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-[11px] text-[var(--color-ink-muted)]">
          <span>
            &copy; {new Date().getFullYear()} {PROFILE.name}. Built with Next.js &amp; Tailwind CSS.
          </span>
          <span>SWISS-GRID EDITORIAL // ZERO-SLOP ARCHITECTURE</span>
        </div>
      </div>
    </footer>
  );
}
