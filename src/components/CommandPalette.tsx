"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Check, Command, Copy, Search, X } from "lucide-react";
import {
  PROFILE,
  SERVICES,
  type FocusMode,
  type ProofTab,
  type WorkCategory,
} from "@/data/portfolio";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  focusMode: FocusMode;
  onChangeFocusMode: (mode: FocusMode) => void;
  onJumpToProof: (tab: ProofTab) => void;
  onSelectService: (serviceTitle: string) => void;
  onFilterWork: (category: WorkCategory) => void;
}

interface CommandAction {
  id: string;
  group: string;
  label: string;
  hint: string;
  run: () => void;
}

export function CommandPalette({
  open,
  onClose,
  focusMode,
  onChangeFocusMode,
  onJumpToProof,
  onSelectService,
  onFilterWork,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  const jumpTo = (hash: string) => {
    onClose();
    const el = document.querySelector(hash);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const actions: CommandAction[] = useMemo(
    () => [
      {
        id: "proof-husai",
        group: "Cinema Proof Stage",
        label: "Launch HusAI Showcase (60s Remotion Demo + Localhost :5173)",
        hint: "01 // HUSAI",
        run: () => {
          onClose();
          onJumpToProof("husai");
        },
      },
      {
        id: "proof-hipsurfer",
        group: "Cinema Proof Stage",
        label: "Launch Hackerlily HipSurfer 9:16 Video Reels (3 Cuts)",
        hint: "02 // REELS",
        run: () => {
          onClose();
          onJumpToProof("hackerlily");
        },
      },
      {
        id: "proof-pacs",
        group: "Cinema Proof Stage",
        label: "Launch Pacs Builders <5s Audit Engine Benchmark",
        hint: "03 // AUDIT",
        run: () => {
          onClose();
          onJumpToProof("pacs");
        },
      },
      {
        id: "focus-all",
        group: "Persona Focus URL",
        label: "Switch Focus: Best of Both Worlds (Creative + VA + Engineering)",
        hint: focusMode === "all" ? "ACTIVE" : "?focus=all",
        run: () => {
          onChangeFocusMode("all");
          onClose();
        },
      },
      {
        id: "focus-va",
        group: "Persona Focus URL",
        label: "Switch Focus: Technical VA, SMM & Remote Operations",
        hint: focusMode === "va" ? "ACTIVE" : "?focus=va",
        run: () => {
          onChangeFocusMode("va");
          onClose();
        },
      },
      {
        id: "focus-eng",
        group: "Persona Focus URL",
        label: "Switch Focus: Software Engineering & AI Systems",
        hint: focusMode === "engineering" ? "ACTIVE" : "?focus=engineering",
        run: () => {
          onChangeFocusMode("engineering");
          onClose();
        },
      },
      {
        id: "focus-creative",
        group: "Persona Focus URL",
        label: "Switch Focus: Direct-Response 9:16 Video & Creative",
        hint: focusMode === "creative" ? "ACTIVE" : "?focus=creative",
        run: () => {
          onChangeFocusMode("creative");
          onClose();
        },
      },
      {
        id: "nav-services",
        group: "Navigation",
        label: "Go to Services & Capabilities",
        hint: "#services",
        run: () => jumpTo("#services"),
      },
      {
        id: "nav-work",
        group: "Navigation",
        label: "Go to Selected Work Index (Dennis Snellenberg Hover Matrix)",
        hint: "#work",
        run: () => jumpTo("#work"),
      },
      {
        id: "nav-engagement",
        group: "Navigation",
        label: "Go to Engagement Models",
        hint: "#engagements",
        run: () => jumpTo("#engagements"),
      },
      {
        id: "nav-toolkit",
        group: "Navigation",
        label: "Go to Tech Stack & Toolkit",
        hint: "#toolkit",
        run: () => jumpTo("#toolkit"),
      },
      {
        id: "nav-contact",
        group: "Navigation",
        label: "Book a Discovery Call / Project Brief",
        hint: "#contact",
        run: () => jumpTo("#contact"),
      },
      {
        id: "filter-eng",
        group: "Filter Work",
        label: "Filter Work Index: Engineering Systems",
        hint: "04 items",
        run: () => {
          onFilterWork("engineering");
          jumpTo("#work");
        },
      },
      {
        id: "filter-creative",
        group: "Filter Work",
        label: "Filter Work Index: Direct-Response Creative",
        hint: "01 item",
        run: () => {
          onFilterWork("creative");
          jumpTo("#work");
        },
      },
      {
        id: "filter-github",
        group: "Filter Work",
        label: "Filter Work Index: Viable GitHub Repositories",
        hint: "03 items",
        run: () => {
          onFilterWork("github");
          jumpTo("#work");
        },
      },
      ...SERVICES.map((s) => ({
        id: `scope-${s.id}`,
        group: "Scope Engagement",
        label: `Scope: ${s.title}`,
        hint: `Pillar ${s.number}`,
        run: () => {
          onSelectService(s.title);
          jumpTo("#contact");
        },
      })),
      {
        id: "copy-email",
        group: "Direct Actions",
        label: copiedEmail
          ? "Copied Email Address!"
          : `Copy Email (${PROFILE.email})`,
        hint: "Clipboard",
        run: async () => {
          try {
            await navigator.clipboard.writeText(PROFILE.email);
            setCopiedEmail(true);
            setTimeout(() => {
              setCopiedEmail(false);
              onClose();
            }, 700);
          } catch {
            window.location.href = `mailto:${PROFILE.email}`;
          }
        },
      },
      {
        id: "ext-husai",
        group: "External Links",
        label: "Open HusAI Live App (Vercel)",
        hint: "hus-ai-five.vercel.app",
        run: () => {
          window.open(
            "https://hus-ai-five.vercel.app",
            "_blank",
            "noopener,noreferrer"
          );
          onClose();
        },
      },
      {
        id: "ext-github",
        group: "External Links",
        label: "Open GitHub Profile (Birky-andrie)",
        hint: "github.com",
        run: () => {
          window.open(PROFILE.github, "_blank", "noopener,noreferrer");
          onClose();
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [copiedEmail, focusMode]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter(
      (a) =>
        a.label.toLowerCase().includes(q) ||
        a.group.toLowerCase().includes(q) ||
        a.hint.toLowerCase().includes(q)
    );
  }, [actions, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  if (!open) return null;

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        filtered.length ? (prev + 1) % filtered.length : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        filtered.length ? (prev - 1 + filtered.length) % filtered.length : 0
      );
    } else if (e.key === "Enter" && filtered[activeIndex]) {
      e.preventDefault();
      filtered[activeIndex].run();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-[var(--color-ink)]/60 px-4 pt-16 sm:pt-24"
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl border border-[var(--color-ink)] bg-[var(--color-paper)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[var(--color-ink)] bg-[var(--color-paper-alt)] px-4 py-2 font-mono text-[11px] uppercase tracking-wider">
          <span className="flex items-center gap-1.5 text-[var(--color-ink)]">
            <Command className="h-3.5 w-3.5 text-[var(--color-signal)]" />
            QUICK COMMAND INDEX
          </span>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] cursor-pointer"
          >
            <span>ESC</span>
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-3 border-b border-[var(--color-hairline)] px-4 py-3">
          <Search className="h-4 w-4 text-[var(--color-ink-muted)] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Type HusAI, HipSurfer, Focus Mode, section, or command..."
            className="w-full bg-transparent font-mono text-xs text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus:outline-none"
          />
        </div>

        <div className="max-h-80 overflow-y-auto divide-y divide-[var(--color-hairline)]">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center font-mono text-xs text-[var(--color-ink-muted)]">
              No matching commands for &ldquo;{query}&rdquo;.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={item.run}
                  className={`w-full flex items-center justify-between gap-4 px-4 py-3 text-left transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[var(--color-ink)] text-[var(--color-paper)]"
                      : "bg-[var(--color-paper)] text-[var(--color-ink)] hover:bg-[var(--color-paper-alt)]"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`font-mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 border ${
                        isSelected
                          ? "border-[var(--color-paper)]/40 text-[var(--color-paper)]/80"
                          : "border-[var(--color-hairline)] text-[var(--color-ink-muted)]"
                      }`}
                    >
                      {item.group}
                    </span>
                    <span className="text-xs sm:text-sm font-medium truncate">
                      {item.label}
                    </span>
                  </div>

                  <span
                    className={`font-mono text-[11px] shrink-0 flex items-center gap-1 ${
                      isSelected
                        ? "text-[var(--color-paper)]/80"
                        : "text-[var(--color-ink-muted)]"
                    }`}
                  >
                    {item.id === "copy-email" && copiedEmail ? (
                      <Check className="h-3.5 w-3.5 text-[var(--color-signal)]" />
                    ) : item.id === "copy-email" ? (
                      <Copy className="h-3 w-3" />
                    ) : (
                      <ArrowUpRight className="h-3 w-3" />
                    )}
                    <span>{item.hint}</span>
                  </span>
                </button>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-between border-t border-[var(--color-hairline)] bg-[var(--color-paper-alt)] px-4 py-2 font-mono text-[10px] text-[var(--color-ink-muted)]">
          <span>↑↓ TO NAVIGATE · ENTER TO SELECT</span>
          <span>CTRL+K / ⌘K</span>
        </div>
      </div>
    </div>
  );
}
