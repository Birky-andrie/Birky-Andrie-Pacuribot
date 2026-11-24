"use client";

import type { RefObject } from "react";
import {
  PILLAR_BY_ID,
  TECH_STACK_KEYS,
  type TechStackKey,
} from "@/data/techStack";
import type { ThemeMode } from "../ThemeToggle";
import type { CeramicSwitchAudio } from "@/lib/ceramicSwitchAudio";

interface TechStackFallbackGridProps {
  theme: ThemeMode;
  activeKey: TechStackKey | null;
  audioRef: RefObject<CeramicSwitchAudio | null>;
  onSelectKey: (key: TechStackKey | null) => void;
  onAudioUnlock: () => void;
}

export function TechStackFallbackGrid({
  theme,
  activeKey,
  audioRef,
  onSelectKey,
  onAudioUnlock,
}: TechStackFallbackGridProps) {
  const isLight = theme === "light";

  return (
    <div className="mx-auto w-full max-w-4xl px-5 sm:px-8">
      <ul className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-6 md:gap-3">
        {TECH_STACK_KEYS.map((item) => {
          const pillar = PILLAR_BY_ID[item.pillar];
          const isActive = activeKey?.id === item.id;
          return (
            <li key={item.id}>
              <button
                type="button"
                onMouseEnter={() => {
                  onSelectKey(item);
                  audioRef.current?.playPress(item.row, true);
                }}
                onMouseLeave={() => {
                  audioRef.current?.playRelease(item.row, true);
                }}
                onPointerDown={() => {
                  audioRef.current?.unlock();
                  onAudioUnlock();
                  audioRef.current?.playPress(item.row, false);
                  onSelectKey(item);
                }}
                onPointerUp={() => {
                  audioRef.current?.playRelease(item.row, false);
                }}
                style={{
                  borderColor: isActive
                    ? item.accentHex
                    : isLight
                      ? "rgba(255,255,255,0.85)"
                      : "rgba(255,255,255,0.16)",
                  boxShadow: isActive
                    ? `inset 0 1px 0 rgba(255,255,255,0.75), 0 14px 32px -10px ${item.accentHex}66`
                    : isLight
                      ? "inset 0 1px 0 rgba(255,255,255,0.9), 0 10px 24px -14px rgba(22,23,27,0.18)"
                      : "inset 0 1px 0 rgba(255,255,255,0.16), 0 12px 26px -14px rgba(0,0,0,0.65)",
                }}
                className={`group relative flex w-full flex-col items-center justify-center gap-1.5 overflow-hidden rounded-2xl border px-2.5 py-4 backdrop-blur-2xl transition-all duration-200 active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F6BFF] focus-visible:ring-offset-2 ${
                  isLight
                    ? "bg-white/60 text-[#16171B] hover:bg-white/80 focus-visible:ring-offset-[#F7F6F2]"
                    : "bg-white/[0.07] text-white hover:bg-white/[0.12] focus-visible:ring-offset-[#080A0F]"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-2.5 top-2 font-mono text-[10px] opacity-40"
                >
                  {item.shortcutChar}
                </span>
                <span
                  aria-hidden="true"
                  style={{ backgroundColor: pillar.accentHex }}
                  className="pointer-events-none absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full opacity-80"
                />
                <span className="text-lg font-bold tracking-tight">
                  {item.shortMark}
                </span>
                <span className="truncate text-[11px] font-medium opacity-75 group-hover:opacity-100">
                  {item.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
