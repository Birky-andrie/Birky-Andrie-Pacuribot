"use client";

import { useEffect, useState } from "react";

const GREETINGS = [
  "Hello",
  "Kamusta",
  "Maayong Adlaw",
  "Hallo",
  "Bonjour",
  "こんにちは",
  "Birky Pacuribot",
];

export function Preloader() {
  const [index, setIndex] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        Boolean(window.location.hash))
    ) {
      setDone(true);
      return;
    }

    if (index < GREETINGS.length - 1) {
      const delay = index === 0 ? 320 : 120;
      const timer = setTimeout(() => setIndex((prev) => prev + 1), delay);
      return () => clearTimeout(timer);
    }

    const exitTimer = setTimeout(() => {
      setExiting(true);
    }, 280);

    const doneTimer = setTimeout(() => {
      setDone(true);
    }, 1150);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [index]);

  if (done) return null;

  return (
    <div
      onClick={() => setDone(true)}
      aria-hidden="true"
      className={`fixed inset-0 z-[120] flex items-center justify-center bg-[#141517] text-white transition-transform duration-[850ms] ease-dennis ${
        exiting ? "-translate-y-full pointer-events-none" : "translate-y-0"
      }`}
    >
      <div
        className={`flex items-center gap-3.5 text-3xl sm:text-5xl font-normal tracking-tight transition-opacity duration-300 ${
          exiting ? "opacity-0" : "opacity-100"
        }`}
      >
        <span className="h-3 w-3 rounded-full bg-white inline-block" />
        <span>{GREETINGS[index]}</span>
      </div>

      {/* Dennis Snellenberg Morphing SVG Bottom Arch Overhang during Curtain Lift */}
      <svg
        className="pointer-events-none absolute top-full left-0 w-full h-24 sm:h-36 fill-[#141517]"
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
      >
        <path
          className="transition-all duration-[850ms] ease-dennis"
          d={
            exiting
              ? "M0,0 L1440,0 Q720,0 0,0 Z"
              : "M0,0 L1440,0 Q720,160 0,0 Z"
          }
        />
      </svg>
    </div>
  );
}
