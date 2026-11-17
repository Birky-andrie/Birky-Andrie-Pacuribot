"use client";

import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { PROFILE } from "@/data/portfolio";

const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Selected Work", href: "#work" },
  { label: "Toolkit", href: "#toolkit" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-hairline)] bg-[var(--color-paper)]/95 backdrop-blur-[2px]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-14">
        <a
          href="#"
          className="font-mono text-xs font-medium tracking-wider uppercase text-[var(--color-ink)] flex items-center gap-2.5"
        >
          <span
            className="inline-block h-2 w-2 bg-[var(--color-signal)]"
            aria-hidden="true"
          />
          <span>{PROFILE.shortName}</span>
          <span className="hidden sm:inline text-[var(--color-ink-muted)] font-normal">
            // {PROFILE.location}
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
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

        <div className="flex items-center gap-3">
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
            className="md:hidden inline-flex items-center justify-center border border-[var(--color-hairline)] p-1.5 text-[var(--color-ink)] hover:border-[var(--color-ink)]"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--color-hairline)] bg-[var(--color-paper)] px-4 py-4">
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
