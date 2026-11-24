"use client";

import { useEffect, useState } from "react";
import { Command, Download, X } from "lucide-react";
import { PROFILE, type FocusMode } from "@/data/portfolio";
import { MagneticButton } from "./MagneticButton";
import { ThemeToggle, type ThemeMode } from "./ThemeToggle";

const NAV_LINKS = [
  { label: "Tech Stack", href: "#tech-stack" },
  { label: "Work", href: "#work" },
  { label: "Proof Stage", href: "#proof-lab" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const FOCUS_OPTIONS: { id: FocusMode; label: string; title: string }[] = [
  {
    id: "all",
    label: "ALL",
    title: "Best of Both Worlds (Creative + Technical VA + Engineering)",
  },
  {
    id: "va",
    label: "VA & OPS",
    title: "Technical VA, Operations & SMM Focus (?focus=va)",
  },
  {
    id: "creative",
    label: "CREATIVE",
    title: "Direct-Response 9:16 Video Focus (?focus=creative)",
  },
  {
    id: "engineering",
    label: "ENG",
    title: "Software Engineering & AI Systems Focus (?focus=engineering)",
  },
];

interface NavbarProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  focusMode: FocusMode;
  onChangeFocusMode: (mode: FocusMode) => void;
  onOpenCommandPalette: () => void;
}

export function Navbar({
  theme,
  onToggleTheme,
  focusMode,
  onChangeFocusMode,
  onOpenCommandPalette,
}: NavbarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 240);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isLight = theme === "light";

  return (
    <>
      {/* Top Transparent Header dynamically matched to Light (#F7F6F2) & Dark (#080A0F) */}
      <header
        className={`theme-surface absolute top-0 inset-x-0 z-40 px-5 sm:px-10 py-6 flex items-center justify-between ${
          isLight ? "text-[#16171B]" : "text-white"
        }`}
      >
        {/* Left: © Code by Birky -> slides on hover to Birky Pacuribot */}
        <a
          href="#"
          className={`group flex items-center gap-1.5 text-sm sm:text-base font-normal tracking-tight ${
            isLight ? "text-[#16171B]" : "text-white"
          }`}
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

        {/* Right: Clean Links + Focus Switcher + 3D Pixel-Particle Theme Toggle + CV + ⌘K */}
        <div className="flex items-center gap-3.5 lg:gap-6">
          <nav
            className="hidden xl:flex items-center gap-6"
            aria-label="Primary"
          >
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`group relative py-1 text-sm font-normal transition-colors ${
                  isLight
                    ? "text-[#16171B]/80 hover:text-[#16171B]"
                    : "text-white/90 hover:text-white"
                }`}
              >
                <span>{item.label}</span>
                <span
                  className={`
                  pointer-events-none absolute -bottom-1.5 left-1/2 -translate-x-1/2
                  h-1.5 w-1.5 rounded-full scale-0 transition-transform duration-300 ease-out-expo
                  group-hover:scale-100 ${isLight ? "bg-[#16171B]" : "bg-white"}
                `}
                />
              </a>
            ))}
          </nav>

          {/* 4-Mode Persona Focus Pills */}
          <div
            className={`hidden md:inline-flex items-center rounded-full backdrop-blur-md p-1 border transition-colors ${
              isLight
                ? "bg-black/[0.05] border-black/10"
                : "bg-white/[0.06] border-white/15"
            }`}
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
                      ? isLight
                        ? "bg-[#16171B] text-white font-semibold"
                        : "bg-white text-[#16171B] font-semibold"
                      : isLight
                        ? "text-[#16171B]/70 hover:text-[#16171B]"
                        : "text-white/80 hover:text-white"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* 3D Soft-UI Pixel-Particle Dark/Light Mode Toggle */}
          <ThemeToggle theme={theme} onToggle={onToggleTheme} size="sm" />

          {/* 1-Click Top-Bar Download CV Pill */}
          <a
            href="/Birky_Andrie_Pacuribot_CV.pdf"
            download
            className={`hidden sm:inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-xs font-medium transition-colors ${
              isLight
                ? "bg-[#16171B] text-white hover:bg-[#455CE9]"
                : "bg-white text-[#16171B] hover:bg-[#455CE9] hover:text-white"
            }`}
            title="Download Updated CV (PDF)"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            <span>CV</span>
          </a>

          <button
            type="button"
            onClick={onOpenCommandPalette}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-xs transition-colors cursor-pointer ${
              isLight
                ? "bg-black/[0.05] hover:bg-[#16171B] hover:text-white border-black/15 text-[#16171B]"
                : "bg-white/[0.08] hover:bg-white hover:text-[#16171B] border-white/20 text-white"
            }`}
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
            className={`xl:hidden inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs cursor-pointer ${
              isLight
                ? "bg-black/[0.05] border-black/15 text-[#16171B]"
                : "bg-white/[0.08] border-white/20 text-white"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isLight ? "bg-[#16171B]" : "bg-white"
              }`}
            />
            <span>Menu</span>
          </button>
        </div>
      </header>

      {/* Floating Frosted Glassmorphism Magnetic Hamburger Button */}
      <div
        className={`fixed top-5 right-5 sm:top-7 sm:right-7 z-50 transition-all duration-300 ease-dennis ${
          drawerOpen || scrolled
            ? "scale-100 opacity-100 visible"
            : "scale-0 opacity-0 invisible pointer-events-none"
        }`}
      >
        <MagneticButton
          onClick={() => setDrawerOpen((prev) => !prev)}
          ariaLabel={
            drawerOpen ? "Close navigation drawer" : "Open navigation drawer"
          }
          fillColor={
            drawerOpen
              ? "rgba(255, 255, 255, 0.14)"
              : isLight
                ? "rgba(255, 255, 255, 0.52)"
                : "rgba(255, 255, 255, 0.14)"
          }
          className={`h-16 w-16 sm:h-20 sm:w-20 rounded-full flex items-center justify-center backdrop-blur-2xl border transition-colors ${
            drawerOpen
              ? "bg-white/[0.10] border-white/20 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_14px_34px_-10px_rgba(0,0,0,0.55)]"
              : isLight
                ? "bg-[#EFECE6]/70 border-[var(--color-hairline)] text-[#16171B] shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_12px_30px_-10px_rgba(22,23,27,0.20)]"
                : "bg-[#10131C]/65 border-white/15 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.20),0_14px_34px_-10px_rgba(0,0,0,0.65)]"
          }`}
        >
          {drawerOpen ? (
            <X className="h-6 w-6 stroke-[1.5]" />
          ) : (
            <div className="flex flex-col gap-1.5 items-center justify-center">
              <span
                className={`block h-[1.5px] w-6 ${
                  isLight ? "bg-[#16171B]" : "bg-white"
                }`}
              />
              <span
                className={`block h-[1.5px] w-6 ${
                  isLight ? "bg-[#16171B]" : "bg-white"
                }`}
              />
            </div>
          )}
        </MagneticButton>
      </div>

      {/* Dennis Snellenberg Animated Dark Side-Drawer Menu (#1C1D20) with Morphing SVG Left Curve */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-500 ease-dennis ${
          drawerOpen
            ? "opacity-100 pointer-events-auto bg-black/45 backdrop-blur-[2px]"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setDrawerOpen(false)}
      >
        <aside
          onClick={(e) => e.stopPropagation()}
          className={`relative ml-auto h-full w-full max-w-md bg-[#1C1D20] text-white px-8 sm:px-14 py-10 flex flex-col justify-between transition-transform duration-700 ease-dennis overflow-y-auto ${
            drawerOpen ? "translate-x-0" : "translate-x-[115%]"
          }`}
        >
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute top-0 -left-24 h-full w-24 fill-[#1C1D20]"
            viewBox="0 0 100 800"
            preserveAspectRatio="none"
          >
            <path
              className="transition-all duration-700 ease-dennis"
              d={
                drawerOpen
                  ? "M100,0 L100,800 Q100,400 100,0 Z"
                  : "M100,0 L100,800 Q0,400 100,0 Z"
              }
            />
          </svg>

          <div className="space-y-7 pt-6">
            <div className="flex items-center justify-start border-b border-white/15 pb-5">
              <ThemeToggle theme={theme} onToggle={onToggleTheme} size="md" />
            </div>

            <nav className="flex flex-col gap-3.5" aria-label="Drawer">
              {[{ label: "Home", href: "#" }, ...NAV_LINKS].map((item, idx) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setDrawerOpen(false)}
                  style={{ transitionDelay: `${idx * 45}ms` }}
                  className={`group flex items-center justify-between text-3xl sm:text-4xl font-normal tracking-tight text-white/90 hover:text-white transition-all duration-500 ease-out-expo hover:translate-x-2 ${
                    drawerOpen
                      ? "translate-x-0 opacity-100"
                      : "translate-x-12 opacity-0"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="h-2.5 w-2.5 rounded-full bg-[#455CE9] opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </nav>

            {/* Instant Resume Downloads inside Drawer */}
            <div className="pt-4 border-t border-white/15 space-y-2.5">
              <div className="font-mono text-[11px] uppercase tracking-widest text-[#999D9E]">
                Instant Resume Download
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href="/Birky_Andrie_Pacuribot_CV.pdf"
                  download
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#455CE9] hover:bg-[#334BD3] px-4 py-2 font-mono text-xs text-white transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>PDF Resume</span>
                </a>
                <a
                  href="/Birky_Andrie_Pacuribot_Harvard_CV.docx"
                  download
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/25 hover:bg-white hover:text-[#1C1D20] px-4 py-2 font-mono text-xs text-white transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Harvard Word (.docx)</span>
                </a>
              </div>
            </div>

            <div className="pt-4 border-t border-white/15 space-y-2">
              <div className="font-mono text-[11px] uppercase tracking-widest text-[#999D9E]">
                Tailored Application View
              </div>
              <div className="flex flex-wrap rounded-2xl bg-white/10 p-1 gap-1">
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

          <div className="border-t border-white/15 pt-5 space-y-2">
            <div className="font-mono text-[11px] uppercase tracking-widest text-[#999D9E]">
              Direct Contact &amp; Links
            </div>
            <div className="flex flex-wrap gap-5 text-sm text-white/90">
              <a
                href={PROFILE.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#455CE9] transition-colors"
              >
                WhatsApp
              </a>
              <a
                href={`mailto:${PROFILE.email}`}
                className="hover:text-[#455CE9] transition-colors"
              >
                Email
              </a>
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
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
