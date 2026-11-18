"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Command, Menu, X } from "lucide-react";
import { PROFILE, type FocusMode } from "@/data/portfolio";

const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Proof Stage", href: "#proof-lab" },
  { label: "Work Index", href: "#work" },
  { label: "Engagements", href: "#engagements" },
  { label: "Toolkit", href: "#toolkit" },
];

const FOCUS_OPTIONS: { id: FocusMode; label: string; title: string }[] = [
  { id: "all", label: "ALL", title: "Full Hybrid View (Engineering + Creative)" },
  { id: "engineering", label: "ENG", title: "Engineering & AI Systems Focus (?focus=engineering)" },
  { id: "creative", label: "CREATIVE", title: "Direct-Response 9:16 Video Focus (?focus=creative)" },
];

interface NavbarProps {
  focusMode: FocusMode;
  onChangeFocusMode: (mode: FocusMode) => void;
  onOpenCommandPalette: () => void;
}

export function Navbar({
  focusMode,
  onChangeFocusMode,
  onOpenCommandPalette,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [phtTime, setPhtTime] = useState<string>("");

  useEffect(() => {
    const updateClock = () => {
      try {
        const formatted = new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Manila",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date());
        setPhtTime(`${formatted} PHT`);
      } catch {
        setPhtTime("UTC+8");
      }
    };
    updateClock();
    const timer = setInterval(updateClock, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-hairline)] bg-[var(--color-paper)]/95 backdrop-blur-[2px]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-14">
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="font-mono text-xs font-medium tracking-wider uppercase text-[var(--color-ink)] flex items-center gap-2"
          >
            <span
              className="inline-block h-2 w-2 bg-[var(--color-signal)]"
              aria-hidden="true"
            />
            <span>{PROFILE.shortName}</span>
          </a>
          <span className="hidden xl:inline-flex items-center gap-1.5 border border-[var(--color-hairline)] bg-[var(--color-paper-alt)] px-2 py-0.5 font-mono text-[11px] tabular-nums text-[var(--color-ink-muted)]">
            <span>CDO, PH</span>
            <span>//</span>
            <span className="text-[var(--color-ink)]">{phtTime || "UTC+8"}</span>
          </span>
        </div>

        <nav className="hidden lg:flex items-center gap-6" aria-label="Primary">
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Shareable Focus Mode Switcher */}
          <div
            className="hidden sm:inline-flex items-center border border-[var(--color-hairline)] bg-[var(--color-paper-alt)]"
            role="group"
            aria-label="Portfolio Focus Mode"
          >
            {FOCUS_OPTIONS.map((opt) => {
              const active = focusMode === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  title={opt.title}
                  onClick={() => onChangeFocusMode(opt.id)}
                  className={`px-2 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors cursor-pointer ${
                    active
                      ? "bg-[var(--color-ink)] text-[var(--color-paper)]"
                      : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="inline-flex items-center gap-1.5 border border-[var(--color-hairline)] bg-[var(--color-paper-alt)] px-2.5 py-1.5 font-mono text-[11px] text-[var(--color-ink)] hover:border-[var(--color-ink)] transition-colors cursor-pointer"
            aria-label="Open command palette"
            title="Open Command Palette (Ctrl+K / ⌘K)"
          >
            <Command className="h-3 w-3 text-[var(--color-signal)]" aria-hidden="true" />
            <span className="hidden md:inline">Index</span>
            <kbd className="border border-[var(--color-hairline)] bg-[var(--color-paper)] px-1 text-[10px] text-[var(--color-ink-muted)]">
              ⌘K
            </kbd>
          </button>

          <a
            href="#contact"
            className="hidden sm:inline-flex items-center gap-1.5 border border-[var(--color-ink)] bg-[var(--color-ink)] px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider text-[var(--color-paper)] hover:bg-[var(--color-signal)] hover:border-[var(--color-signal)] transition-colors"
          >
            Book a Call
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="lg:hidden inline-flex items-center justify-center border border-[var(--color-hairline)] p-1.5 text-[var(--color-ink)] hover:border-[var(--color-ink)]"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-[var(--color-hairline)] bg-[var(--color-paper)] px-4 py-4 space-y-4">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-[var(--color-ink-muted)]">FOCUS VIEW:</span>
            <div className="inline-flex border border-[var(--color-hairline)]">
              {FOCUS_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onChangeFocusMode(opt.id)}
                  className={`px-2.5 py-1 font-mono text-[10px] uppercase ${
                    focusMode === opt.id
                      ? "bg-[var(--color-ink)] text-[var(--color-paper)]"
                      : "bg-[var(--color-paper-alt)] text-[var(--color-ink)]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <nav className="flex flex-col gap-3" aria-label="Mobile">
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="font-mono text-xs uppercase tracking-wider py-1.5 border-b border-[var(--color-hairline)] text-[var(--color-ink)]"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMobileOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-1.5 border border-[var(--color-ink)] bg-[var(--color-ink)] px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-[var(--color-paper)]"
            >
              Book a Discovery Call
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
