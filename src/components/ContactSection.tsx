"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  Copy,
  Download,
  MessageCircle,
} from "lucide-react";
import { PROFILE, SERVICES } from "@/data/portfolio";
import { MagneticButton } from "./MagneticButton";

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
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [showBriefForm, setShowBriefForm] = useState(false);
  const [localTime, setLocalTime] = useState("UTC+8 (CDO, PH)");
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "submitting" | "sent-direct" | "sent-fallback"
  >("idle");

  useEffect(() => {
    if (preselectedService) {
      setService(preselectedService);
      setShowBriefForm(true);
    }
  }, [preselectedService]);

  useEffect(() => {
    const updateTime = () => {
      try {
        const formatted = new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Manila",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }).format(new Date());
        setLocalTime(`${formatted} GMT+8`);
      } catch {
        setLocalTime("GMT+8");
      }
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  const buildBriefText = () => {
    return [
      `Service: ${service}`,
      `From: ${name || "Prospective Client"} (${email || "No email provided"})`,
      "",
      "Project Brief:",
      brief || "Looking to discuss scope, timeline, and deliverables.",
    ].join("\n");
  };

  const mailtoHref = `mailto:${PROFILE.email}?subject=${encodeURIComponent(
    `[Portfolio Inquiry] ${service}`
  )}&body=${encodeURIComponent(buildBriefText())}`;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service, name, email, brief }),
      });
      const data = (await res.json()) as { ok?: boolean; mode?: string };
      if (data.mode === "resend") {
        setSubmitStatus("sent-direct");
      } else {
        await navigator.clipboard.writeText(buildBriefText()).catch(() => {});
        setSubmitStatus("sent-fallback");
      }
    } catch {
      await navigator.clipboard.writeText(buildBriefText()).catch(() => {});
      setSubmitStatus("sent-fallback");
    }
  };

  const handleCopyBrief = async () => {
    try {
      await navigator.clipboard.writeText(buildBriefText());
      setCopiedBrief(true);
      setTimeout(() => setCopiedBrief(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2200);
    } catch {
      // ignore
    }
  };

  return (
    <footer
      id="contact"
      className="relative bg-[#080A0F] text-white pt-32 sm:pt-40 pb-12"
    >
      {/* Top Blend from Core Pillars Surface into Obsidian Contact Footer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[var(--color-paper)] to-transparent"
      />
      <div className="mx-auto max-w-6xl px-6 sm:px-12">
        {/* Header with Crisp Editorial Portrait Badge */}
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="h-14 w-14 sm:h-20 sm:w-20 rounded-full overflow-hidden ring-1 ring-white/25 bg-[#141822] shrink-0 shadow-lg">
                <img
                  src="/about-portrait.jpg"
                  alt={PROFILE.name}
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <h2 className="text-4xl sm:text-6xl lg:text-[5.25rem] font-normal leading-[1.05] tracking-[-0.03em] text-white">
                Let&apos;s work
              </h2>
            </div>
            <div className="text-4xl sm:text-6xl lg:text-[5.25rem] font-normal leading-[1.05] tracking-[-0.03em] text-white">
              together
            </div>
          </div>

          <ArrowDownLeft
            className="hidden sm:block h-7 w-7 text-white/80 mb-4 mr-12 stroke-[1.75]"
            aria-hidden="true"
          />
        </div>

        {/* Hairline Divider + Overlapping Frosted Primary "Get in touch" Button */}
        <div className="relative mt-16 sm:mt-24 mb-16 sm:mb-20">
          <div className="h-[1px] w-full bg-white/15" />
          <div className="absolute right-6 sm:right-20 -top-20 sm:-top-24">
            <MagneticButton
              onClick={() => setShowBriefForm((prev) => !prev)}
              fillColor="#334BD3"
              className="h-40 w-40 sm:h-48 sm:w-48 rounded-full border border-white/25 bg-[#455CE9] text-white flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_20px_50px_rgba(69,92,233,0.4)]"
            >
              <span className="text-base sm:text-lg font-medium tracking-tight">
                {showBriefForm ? "Hide brief" : "Get in touch"}
              </span>
              <span className="mt-1 text-xs text-white/80">
                Scope a project
              </span>
            </MagneticButton>
          </div>
        </div>

        {/* 4 Streamlined Zero-Duplicate Client Action Pills */}
        <div className="flex flex-wrap items-center gap-3.5">
          <MagneticButton
            onClick={handleCopyEmail}
            strength={0.2}
            textStrength={0.1}
            title="Click to copy email address"
            className="rounded-full border border-white/16 bg-white/[0.04] backdrop-blur-xl px-6 py-3.5 text-sm sm:text-base text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]"
          >
            <span className="inline-flex items-center gap-2">
              {copiedEmail ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                  <span>Copied {PROFILE.email}</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-white/70" aria-hidden="true" />
                  <span>{PROFILE.email}</span>
                </>
              )}
            </span>
          </MagneticButton>

          <MagneticButton
            href={PROFILE.whatsappUrl}
            strength={0.2}
            textStrength={0.1}
            className="rounded-full border border-white/16 bg-white/[0.04] backdrop-blur-xl px-6 py-3.5 text-sm sm:text-base text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]"
          >
            <span className="inline-flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-emerald-400" aria-hidden="true" />
              <span>WhatsApp &middot; {PROFILE.phone}</span>
            </span>
          </MagneticButton>

          <MagneticButton
            href="/Birky_Andrie_Pacuribot_CV.pdf"
            strength={0.2}
            textStrength={0.1}
            className="rounded-full border border-white/16 bg-white/[0.04] backdrop-blur-xl px-6 py-3.5 text-sm sm:text-base text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]"
          >
            <span className="inline-flex items-center gap-2">
              <Download className="h-4 w-4 text-white/75" aria-hidden="true" />
              <span>Download CV (PDF)</span>
            </span>
          </MagneticButton>

          <MagneticButton
            href={PROFILE.github}
            strength={0.2}
            textStrength={0.1}
            className="rounded-full border border-white/16 bg-white/[0.04] backdrop-blur-xl px-6 py-3.5 text-sm sm:text-base text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]"
          >
            <span className="inline-flex items-center gap-1.5">
              <span>GitHub</span>
              <ArrowUpRight className="h-4 w-4 text-white/75" aria-hidden="true" />
            </span>
          </MagneticButton>
        </div>

        {/* Frosted Liquid Glass Project Brief Builder */}
        {showBriefForm && (
          <form
            onSubmit={handleSubmit}
            className="mt-10 rounded-[28px] border border-white/15 bg-white/[0.05] backdrop-blur-2xl p-6 sm:p-9 space-y-5 shadow-[0_28px_80px_-16px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.16)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/12 pb-4">
              <span className="text-base font-medium text-white">
                Project Brief
              </span>
              <a
                href="/Birky_Andrie_Pacuribot_Harvard_CV.docx"
                download
                className="text-xs text-white/65 hover:text-white underline"
              >
                Need ATS Word (.docx) CV instead?
              </a>
            </div>

            <div>
              <label
                htmlFor="service-select"
                className="block text-xs font-medium text-white/75 mb-2"
              >
                What do you need help with?
              </label>
              <select
                id="service-select"
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full rounded-xl border border-white/16 bg-[#111520] px-4 py-3 text-sm text-white focus:outline-none focus:border-[#455CE9]"
              >
                {SERVICES.map((item) => (
                  <option key={item.id} value={item.title}>
                    {item.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="client-name"
                  className="block text-xs font-medium text-white/75 mb-2"
                >
                  Your name
                </label>
                <input
                  id="client-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="w-full rounded-xl border border-white/16 bg-[#111520] px-4 py-3 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-[#455CE9]"
                />
              </div>
              <div>
                <label
                  htmlFor="client-email"
                  className="block text-xs font-medium text-white/75 mb-2"
                >
                  Work email
                </label>
                <input
                  id="client-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full rounded-xl border border-white/16 bg-[#111520] px-4 py-3 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-[#455CE9]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="project-brief"
                className="block text-xs font-medium text-white/75 mb-2"
              >
                Goal &amp; timeline
              </label>
              <textarea
                id="project-brief"
                rows={4}
                required
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                placeholder="Share the product, ad campaign, or operations workflow you want shipped..."
                className="w-full rounded-xl border border-white/16 bg-[#111520] px-4 py-3 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-[#455CE9]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={submitStatus === "submitting"}
                className="inline-flex items-center gap-2 rounded-full bg-[#455CE9] hover:bg-[#334BD3] px-6 py-3 text-xs sm:text-sm font-medium text-white transition-colors cursor-pointer disabled:opacity-60"
              >
                <span>
                  {submitStatus === "submitting"
                    ? "Sending brief..."
                    : submitStatus === "sent-direct"
                      ? "Brief sent — I'll reply shortly"
                      : submitStatus === "sent-fallback"
                        ? "Brief copied — open email below"
                        : "Send project brief"}
                </span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </button>

              {submitStatus === "sent-fallback" && (
                <a
                  href={mailtoHref}
                  className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-5 py-3 text-xs sm:text-sm font-medium text-emerald-300 hover:bg-emerald-500/25 transition-colors"
                >
                  <span>Open pre-filled email</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              )}

              <button
                type="button"
                onClick={handleCopyBrief}
                className="inline-flex items-center gap-2 rounded-full border border-white/16 px-5 py-3 text-xs sm:text-sm text-white/85 hover:bg-white/10 transition-colors cursor-pointer"
              >
                {copiedBrief ? (
                  <>
                    <Check
                      className="h-3.5 w-3.5 text-emerald-400"
                      aria-hidden="true"
                    />
                    <span>Brief copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Copy brief</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Bottom Bar: Edition | Local Time | Distinction | Direct Links */}
        <div className="mt-24 pt-8 border-t border-white/12 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8">
          <div className="flex flex-wrap gap-10">
            <div>
              <div className="text-[11px] font-medium text-white/50 mb-1">
                Edition
              </div>
              <div className="text-xs sm:text-sm text-white">
                2026 &copy; Birky Pacuribot
              </div>
            </div>
            <div>
              <div className="text-[11px] font-medium text-white/50 mb-1">
                Local Time
              </div>
              <div className="text-xs sm:text-sm text-white tabular-nums">
                {localTime} (CDO, PH)
              </div>
            </div>
            <div>
              <div className="text-[11px] font-medium text-white/50 mb-1">
                Education &amp; Distinction
              </div>
              <div className="text-xs sm:text-sm text-white">
                USTP BS CS &apos;27 &middot; 1.00 Startup Lab Lead
              </div>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-medium text-white/50 mb-1">
              Direct Channels
            </div>
            <div className="flex items-center gap-6 text-xs sm:text-sm text-white">
              <a
                href={PROFILE.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#455CE9] transition-colors"
              >
                WhatsApp
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
              <a
                href={`mailto:${PROFILE.email}`}
                className="hover:text-[#455CE9] transition-colors"
              >
                Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
