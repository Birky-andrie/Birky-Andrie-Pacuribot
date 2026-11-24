"use client";

import { useEffect, useRef, useState } from "react";
import { Coffee, Crown, Dumbbell, MapPin } from "lucide-react";
import type { ThemeMode } from "./ThemeToggle";

interface AboutSectionProps {
  theme: ThemeMode;
}

interface HobbyItem {
  id: "coffee" | "chess" | "gym";
  label: string;
  accent: string;
  note: string;
  icon: typeof Coffee;
}

const OFF_THE_CLOCK: readonly HobbyItem[] = [
  {
    id: "coffee",
    label: "Coffee & People",
    accent: "#D97706",
    note: "Over an iced coffee unpacking why people click, linger, or bounce—the psychology behind every good interface and ad hook.",
    icon: Coffee,
  },
  {
    id: "chess",
    label: "Chess",
    accent: "#455CE9",
    note: "Tempo, pattern recognition, and thinking three moves ahead—the same habits that carry straight into system architecture.",
    icon: Crown,
  },
  {
    id: "gym",
    label: "Gym",
    accent: "#0EA5E9",
    note: "Progressive overload and showing up on the quiet days—consistency beats burst motivation in training and shipping builds.",
    icon: Dumbbell,
  },
] as const;

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function easeOutQuint(t: number): number {
  const inv = 1 - clamp01(t);
  return 1 - inv * inv * inv * inv * inv;
}

export function AboutSection({ theme }: AboutSectionProps) {
  const isLight = theme === "light";
  const sectionRef = useRef<HTMLElement | null>(null);
  const portraitWrapRef = useRef<HTMLDivElement | null>(null);
  const bioWrapRef = useRef<HTMLDivElement | null>(null);
  const portraitCardRef = useRef<HTMLDivElement | null>(null);
  const glareRef = useRef<HTMLDivElement | null>(null);

  const [activeHobby, setActiveHobby] = useState<HobbyItem["id"]>("coffee");

  // Viewport-entry whip-in + velocity-driven directional motion blur (mirrors #tech-stack)
  useEffect(() => {
    const section = sectionRef.current;
    const portraitWrap = portraitWrapRef.current;
    const bioWrap = bioWrapRef.current;
    if (!section || !portraitWrap || !bioWrap) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      portraitWrap.style.opacity = "1";
      portraitWrap.style.transform = "none";
      bioWrap.style.opacity = "1";
      bioWrap.style.transform = "none";
      return;
    }

    let rafId = 0;
    let running = false;
    let lastTime = performance.now();

    const getEntryRaw = () => {
      const rect = section.getBoundingClientRect();
      const vh = Math.max(1, window.innerHeight);
      // Whip-in runs cleanly as section rises from bottom edge to ~14% from top
      return clamp01((vh - rect.top) / (vh * 0.86));
    };

    let smoothEntry = getEntryRaw();
    let smoothBlur = 0;

    const applyTransforms = (entry: number, blurPx: number) => {
      const e = easeOutQuint(entry);
      // Craft-floor rule: animate smoothly from an already-visible state (never blank opacity: 0)
      const alpha = 0.35 + clamp01(entry * 1.4) * 0.65;

      // Left portrait sweeps in from left-bottom with subtle 3D yaw
      const pX = (1 - e) * -76;
      const pY = (1 - e) * 26;
      const pRotY = (1 - e) * 11;
      const pScale = 0.93 + e * 0.07;

      // Right frosted bio card whips in from right (matching Tech Stack right-to-center motion)
      const bX = (1 - e) * 112;
      const bY = (1 - e) * 20;
      const bRotY = (1 - e) * -9;
      const bScale = 0.94 + e * 0.06;

      portraitWrap.style.opacity = alpha.toFixed(3);
      portraitWrap.style.transform = `perspective(1100px) translate3d(${pX.toFixed(1)}px, ${pY.toFixed(1)}px, 0) rotateY(${pRotY.toFixed(2)}deg) scale(${pScale.toFixed(4)})`;

      bioWrap.style.opacity = alpha.toFixed(3);
      bioWrap.style.transform = `perspective(1100px) translate3d(${bX.toFixed(1)}px, ${bY.toFixed(1)}px, 0) rotateY(${bRotY.toFixed(2)}deg) scale(${bScale.toFixed(4)})`;

      if (blurPx > 0.08) {
        const f = `blur(${blurPx.toFixed(2)}px)`;
        portraitWrap.style.filter = f;
        bioWrap.style.filter = f;
      } else {
        if (portraitWrap.style.filter !== "") portraitWrap.style.filter = "";
        if (bioWrap.style.filter !== "") bioWrap.style.filter = "";
      }
    };

    const tick = (now: number) => {
      if (!running) return;
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      const raw = getEntryRaw();
      const prev = smoothEntry;
      smoothEntry += (raw - smoothEntry) * (1 - Math.exp(-dt * 8.6));
      if (Math.abs(raw - smoothEntry) < 0.0005) smoothEntry = raw;

      const velocity = Math.abs(raw - prev);
      const entryBell = Math.sin(clamp01(smoothEntry) * Math.PI);
      const targetBlur = clamp01(velocity * 22 * (0.3 + entryBell * 1.15)) * 5.6;
      smoothBlur += (targetBlur - smoothBlur) * (1 - Math.exp(-dt * 12));
      if (smoothEntry > 0.975 && smoothBlur < 0.12) smoothBlur = 0;

      applyTransforms(smoothEntry, smoothBlur);
      rafId = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || document.hidden) return;
      running = true;
      lastTime = performance.now();
      rafId = requestAnimationFrame(tick);
    };

    const stop = () => {
      running = false;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    applyTransforms(smoothEntry, 0);

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          start();
        } else {
          stop();
        }
      },
      { rootMargin: "220px 0px 220px 0px", threshold: 0 }
    );
    io.observe(section);

    const onVis = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  // Interactive 3D magnetic tilt + Apple prismatic specular glare on portrait card
  const handlePortraitMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = portraitCardRef.current;
    const glare = glareRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
    const ny = (e.clientY - rect.top) / Math.max(1, rect.height) - 0.5;

    const rotX = -ny * 12;
    const rotY = nx * 13;
    card.style.transform = `perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;

    if (glare) {
      const gx = (nx + 0.5) * 100;
      const gy = (ny + 0.5) * 100;
      glare.style.opacity = "1";
      glare.style.background = `radial-gradient(280px circle at ${gx.toFixed(1)}% ${gy.toFixed(1)}%, rgba(255,255,255,0.34) 0%, rgba(125,211,252,0.16) 32%, rgba(240,171,252,0.12) 55%, transparent 78%)`;
    }
  };

  const handlePortraitLeave = () => {
    if (portraitCardRef.current) {
      portraitCardRef.current.style.transform =
        "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    }
    if (glareRef.current) {
      glareRef.current.style.opacity = "0";
    }
  };

  const currentHobby =
    OFF_THE_CLOCK.find((h) => h.id === activeHobby) ?? OFF_THE_CLOCK[0];

  const frostedCardSurface = isLight
    ? "bg-white/74 border-white/85 text-[#16171B] shadow-[0_24px_70px_-18px_rgba(22,23,27,0.12),inset_0_1px_0_rgba(255,255,255,0.95)]"
    : "bg-[#0B0E16]/76 border-white/14 text-white shadow-[0_28px_80px_-16px_rgba(0,0,0,0.68),inset_0_1px_0_rgba(255,255,255,0.16)]";

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-label="A Little About Me"
      className="theme-surface relative w-full overflow-x-clip bg-[var(--color-paper)] py-20 text-[var(--color-ink)] sm:py-28 lg:py-32"
    >
      {/* Top ambient blend veil from Tech Stack */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-20 bg-gradient-to-b from-[var(--color-paper)] to-transparent"
      />

      {/* Soft ambient studio aura matching portfolio Light/Dark tokens */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: isLight
            ? "radial-gradient(52% 50% at 32% 52%, rgba(250, 204, 21, 0.10) 0%, rgba(79, 107, 255, 0.04) 48%, transparent 76%)"
            : "radial-gradient(52% 50% at 32% 52%, rgba(69, 92, 233, 0.12) 0%, rgba(56, 189, 248, 0.06) 46%, transparent 76%)",
        }}
      />

      <div className="relative z-20 mx-auto max-w-6xl px-6 sm:px-12">
        <h2 className="mb-10 text-3xl font-semibold tracking-[-0.03em] sm:mb-12 sm:text-5xl">
          A Little About Me
        </h2>

        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
          {/* LEFT: Compact Editorial 4:5 Portrait inside Frosted Liquid Glass Bezel with 3D Magnetic Tilt */}
          <div
            ref={portraitWrapRef}
            className="mx-auto w-full max-w-[330px] will-change-[transform,opacity,filter] sm:max-w-[360px] lg:col-span-5 lg:mx-0 lg:max-w-none"
          >
            <div
              ref={portraitCardRef}
              onMouseMove={handlePortraitMove}
              onMouseLeave={handlePortraitLeave}
              className={`group relative overflow-hidden rounded-[28px] border p-2.5 backdrop-blur-2xl transition-transform duration-300 ease-out-expo ${frostedCardSurface}`}
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[20px]">
                <img
                  src="/about-portrait.jpg"
                  alt="Birky Andrie L. Pacuribot"
                  loading="lazy"
                  className="h-full w-full object-cover object-center transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
                />

                {/* Prismatic Liquid Glass specular sweep following cursor */}
                <div
                  ref={glareRef}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 mix-blend-screen"
                />

                {/* Subtle bottom glass legibility vignette + caption pill */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/65 via-black/20 to-transparent"
                />
                <div className="absolute inset-x-3.5 bottom-3.5 flex items-center justify-between gap-2 rounded-2xl border border-white/20 bg-black/35 px-3.5 py-2.5 text-white backdrop-blur-xl">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium tracking-tight">
                      Birky Pacuribot
                    </p>
                    <p className="truncate text-[11px] text-white/75">
                      BS Computer Science · USTP
                    </p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 font-mono text-[10px] tracking-wide text-white/90">
                    <MapPin className="h-3 w-3" aria-hidden="true" />
                    <span>UTC+8</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Frosted Liquid Glass Bio Card (Consistent with Hero Postcards & Tech Stack Pills) */}
          <div
            ref={bioWrapRef}
            className="will-change-[transform,opacity,filter] lg:col-span-7"
          >
            <div
              className={`rounded-[28px] border p-7 backdrop-blur-2xl sm:p-10 ${frostedCardSurface}`}
            >
              <p className="font-[family-name:var(--font-display)] text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
                Hey, I&rsquo;m Birky.
              </p>

              <p
                className={`mt-4 max-w-[65ch] text-[15px] leading-[1.72] sm:text-[16.5px] ${
                  isLight ? "text-[#16171B]/80" : "text-white/80"
                }`}
              >
                I build software, interfaces, and visual stories that actually
                connect with people. Currently pursuing my BS in Computer
                Science, I&rsquo;ve spent the last few years wearing multiple
                hats&mdash;from leading projects at the Trailblazer Startup Lab
                and engineering solutions for local firms, to co-developing AI
                speech tools and producing high-retention video ads. When
                I&rsquo;m not coding or designing, you&rsquo;ll probably find me
                over coffee dissecting why people do what they do, playing
                chess, or hitting the gym.
              </p>

              {/* Interactive Off-the-Clock Motion Strip */}
              <div
                className={`mt-7 border-t pt-6 ${
                  isLight ? "border-black/10" : "border-white/12"
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  {OFF_THE_CLOCK.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.id === activeHobby;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onMouseEnter={() => setActiveHobby(item.id)}
                        onClick={() => setActiveHobby(item.id)}
                        className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-medium transition-all duration-300 ease-out-expo cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#455CE9] ${
                          isActive
                            ? isLight
                              ? "border-[#16171B] bg-[#16171B] text-white shadow-sm"
                              : "border-white bg-white text-[#080A0F] shadow-sm"
                            : isLight
                              ? "border-black/10 bg-black/[0.04] text-[#16171B]/75 hover:bg-black/[0.08] hover:text-[#16171B]"
                              : "border-white/14 bg-white/[0.06] text-white/75 hover:bg-white/[0.12] hover:text-white"
                        }`}
                      >
                        <Icon
                          className="h-3.5 w-3.5 shrink-0"
                          style={{
                            color: isActive ? undefined : item.accent,
                          }}
                          aria-hidden="true"
                        />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Live Interactive Micro-Note Panel */}
                <div
                  aria-live="polite"
                  className={`mt-4 flex items-start gap-3 rounded-2xl border px-4 py-3.5 transition-colors duration-300 ${
                    isLight
                      ? "border-black/[0.07] bg-black/[0.03]"
                      : "border-white/[0.09] bg-white/[0.04]"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full transition-colors duration-300"
                    style={{ backgroundColor: currentHobby.accent }}
                  />
                  <p
                    className={`text-xs leading-relaxed sm:text-sm ${
                      isLight ? "text-[#16171B]/78" : "text-white/78"
                    }`}
                  >
                    {currentHobby.note}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom ambient blend veil into Recent Work (#work) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-20 bg-gradient-to-t from-[var(--color-paper)] to-transparent"
      />
    </section>
  );
}
