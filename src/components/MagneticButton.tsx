"use client";

import { useRef, useState, type ReactNode } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  fillColor?: string;
  strength?: number;
  textStrength?: number;
  ariaLabel?: string;
  title?: string;
}

export function MagneticButton({
  children,
  onClick,
  href,
  className = "",
  fillColor = "#455CE9",
  strength = 0.34,
  textStrength = 0.18,
  ariaLabel,
  title,
}: MagneticButtonProps) {
  const outerRef = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);
  const innerRef = useRef<HTMLSpanElement | null>(null);
  const [fillPhase, setFillPhase] = useState<"idle" | "enter" | "leave">("idle");

  const handleMouseEnter = () => {
    setFillPhase("enter");
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = outerRef.current;
    const inner = innerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);

    el.style.transform = `translate3d(${dx * strength}px, ${dy * strength}px, 0)`;
    if (inner) {
      inner.style.transform = `translate3d(${dx * textStrength}px, ${dy * textStrength}px, 0)`;
    }
  };

  const handleMouseLeave = () => {
    const el = outerRef.current;
    const inner = innerRef.current;
    if (el) {
      el.style.transform = "translate3d(0px, 0px, 0)";
    }
    if (inner) {
      inner.style.transform = "translate3d(0px, 0px, 0)";
    }
    setFillPhase("leave");
    setTimeout(() => {
      setFillPhase((prev) => (prev === "leave" ? "idle" : prev));
    }, 450);
  };

  const fillTransform =
    fillPhase === "enter"
      ? "translate3d(0, 0%, 0)"
      : fillPhase === "leave"
        ? "translate3d(0, -105%, 0)"
        : "translate3d(0, 105%, 0)";

  const content = (
    <>
      {/* Directional Liquid Fill Circle sweeping from bottom -> center -> top */}
      <span
        aria-hidden="true"
        style={{
          backgroundColor: fillColor,
          transform: fillTransform,
          transition:
            fillPhase === "idle"
              ? "none"
              : "transform 480ms cubic-bezier(0.76, 0, 0.24, 1)",
        }}
        className="pointer-events-none absolute -inset-x-2 -inset-y-4 rounded-[50%]"
      />
      <span
        ref={innerRef}
        className="relative z-10 inline-flex flex-col items-center justify-center transition-transform duration-300 ease-out-expo"
      >
        {children}
      </span>
    </>
  );

  const sharedClasses = `relative overflow-hidden transition-transform duration-500 ease-out-expo cursor-pointer select-none ${className}`;

  if (href) {
    return (
      <a
        ref={(node) => {
          outerRef.current = node;
        }}
        href={href}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        aria-label={ariaLabel}
        title={title}
        className={sharedClasses}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={(node) => {
        outerRef.current = node;
      }}
      type="button"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label={ariaLabel}
      title={title}
      className={sharedClasses}
    >
      {content}
    </button>
  );
}
