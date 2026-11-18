"use client";

import { useEffect, useState } from "react";
import { Command, X } from "lucide-react";
import { PROFILE, type FocusMode } from "@/data/portfolio";

const NAV_LINKS = [
  { label: "Work", href: "#work" },
  { label: "Proof Stage", href: "#proof-lab" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const FOCUS_OPTIONS: { id: FocusMode; label: string; title: string }[] = [
  { id: "all", label: "ALL", title: "Full Hybrid View (Engineering + Creative)" },
  {
    id: "engineering",
    label: "ENG",
    title: "Engineering & AI Systems Focus (?focus=engineering)",
  },
  {
    id: "creative",
    label: "CREATIVE",
    title: "Direct-Response 9:16 Video Focus (?focus=creative)",
  },
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 160);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Top Transparent Dennis Snellenberg Header overlaid on #999D9E Hero */}
      <header className="absolute top-0 inset-x-0 z-40 px-6 sm:px-12 py-7 flex items-center justify-between text-white">
        {/* Left: © Code by Birky -> slides on hover to Birky Andrie Pacuribot */}
        <a
          href="#"
          className="group flex items-center gap-1.5 text-sm sm:text-base font-normal tracking-tight text-white"
        >
          <span className="inline-block transition-transform duration-500 ease-out-expo group-hover:rotate-[360deg]">
            &copy;
          </span>
          <span className="relative overflow-hidden inline-flex">
            <span className="transition-transform duration-500 ease-out-expo group-hover:-translate-y-full">
              Code by Birky
            </span>
            <span className="absolute left-0 top-0 translate-y-full transition-transform duration-500 ease-out-expo group-hover:translate-y-0 whitespace-nowrap">
              Birky Pacuribot
            </span>
          </span>
        </a>

        {/* Right: Clean Links with bottom dot indicator + Focus Switcher + ⌘K */}
        <div className="flex items-center gap-6 lg:gap-9">
          <nav className="hidden md:flex items-center gap-7 lg:gap-9" aria-label="Primary">
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group relative py-1 text-sm sm:text-base font-normal text-white/95 hover:text-white transition-colors"
              >
                <span>{item.label}</span>
                <span className="
                  pointer-events-none absolute -bottom-1.5 left-1/2 -translate-x-1/2
                  h-1.5 w-1.5 rounded-full bg-white scale-0 transition-transform duration-300 ease-out-expo
                  group-hover:scale-100
                " />
              </a>
            ))}
          </nav>

          {/* Persona Focus Pills */}
          <div
            className="hidden sm:inline-flex items-center rounded-full bg-[#1C1D20]/35 backdrop-blur-sm p-1 border border-white/15"
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
                  className={`rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors cursor-pointer ${
                    active
                      ? "bg-white text-[#1C1D20] font-semibold"
                      : "text-white/80 hover:text-white"
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
            className="inline-flex items-center gap-1.5 rounded-full bg-[#1C1D20]/35 hover:bg-[#1C1D20] border border-white/20 px-3 py-1.5 font-mono text-xs text-white transition-colors cursor-pointer"
            aria-label="Open command palette"
            title="Open Command Palette (Ctrl+K / ⌘K)"
          >
            <Command className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">⌘K</span>
          </button>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="md:hidden inline-flex items-center gap-1.5 rounded-full bg-[#1C1D20]/40 border border-white/20 px-3.5 py-1.5 text-xs text-white cursor-pointer"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            <span>Menu</span>
          </button>
        </div>
      </header>

      {/* Dennis Snellenberg Floating Circular Hamburger Button (appears on scroll or when drawer is open) */}
      <button
        type="button"
        onClick={() => setDrawerOpen((prev) => !prev)}
        aria-label={drawerOpen ? "Close navigation drawer" : "Open navigation drawer"}
        aria-expanded={drawerOpen}
        className={`fixed top-5 right-5 sm:top-7 sm:right-7 z-50 h-16 w-16 sm:h-20 sm:w-20 rounded-full flex items-center justify-center transition-all duration-500 ease-out-expo cursor-pointer shadow-lg ${
          drawerOpen
            ? "bg-[#455CE9] text-white scale-100"
            : scrolled
              ? "bg-[#1C1D20] hover:bg-[#455CE9] text-white scale-100"
              : "bg-[#1C1D20] text-white scale-0 pointer-events-none"
        }`}
      >
        {drawerOpen ? (
          <X className="h-6 w-6 stroke-[1.5]" />
        ) : (
          <div className="flex flex-col gap-1.5 items-center justify-center">
            <span className="block h-[1.5px] w-6 bg-white" />
            <span className="block h-[1.5px] w-6 bg-white" />
          </div>
        )}
      </button>

      {/* Dennis Snellenberg Dark Side-Drawer Menu (#1C1D20) */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
          onClick={() => setDrawerOpen(false)}
        >
          <aside
            onClick={(e) => e.stopPropagation()}
            className="ml-auto h-full w-full max-w-md bg-[#1C1D20] text-white px-8 sm:px-14 py-12 flex flex-col justify-between"
          >
            <div className="space-y-8 pt-8">
              <div className="border-b border-white/15 pb-4 font-mono text-[11px] uppercase tracking-widest text-[#999D9E]">
                Navigation
              </div>

              <nav className="flex flex-col gap-4" aria-label="Drawer">
                {[
                  { label: "Home", href: "#" },
                  ...NAV_LINKS,
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setDrawerOpen(false)}
                    className="group flex items-center justify-between text-3xl sm:text-4xl font-normal tracking-tight text-white/90 hover:text-white transition-transform duration-300 ease-out-expo hover:translate-x-2"
                  >
                    <span>{item.label}</span>
                    <span className="h-2.5 w-2.5 rounded-full bg-[#455CE9] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </nav>

              <div className="pt-4 border-t border-white/15 space-y-2">
                <div className="font-mono text-[11px] uppercase tracking-widest text-[#999D9E]">
                  Focus Mode URL
                </div>
                <div className="inline-flex rounded-full bg-white/10 p-1">
                  {FOCUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => onChangeFocusMode(opt.id)}
                      className={`rounded-full px-3 py-1 font-mono text-xs uppercase cursor-pointer ${
                        focusMode === opt.id
                          ? "bg-[#455CE9] text-white"
                          : "text-white/75 hover:text-white"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-white/15 pt-6 space-y-2">
              <div className="font-mono text-[11px] uppercase tracking-widest text-[#999D9E]">
                Socials &amp; Direct
              </div>
              <div className="flex flex-wrap gap-5 text-sm text-white/90">
                <a
                  href={PROFILE.github}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#455CE9] transition-colors"
                >
                  GitHub
                </a>
                <a
                  href="https://hus-ai-five.vercel.app"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#455CE9] transition-colors"
                >
                  HusAI Live
                </a>
                <a
                  href={`mailto:${PROFILE.email}`}
                  className="hover:text-[#455CE9] transition-colors"
                >
                  Email
                </a>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
