"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowDownLeft, ArrowUpRight, Check, Copy } from "lucide-react";
import { PROFILE, SERVICES } from "@/data/portfolio";

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
  const [showBriefForm, setShowBriefForm] = useState(false);
  const [localTime, setLocalTime] = useState("UTC+8 (CDO, PH)");
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "submitting" | "sent"
  >("idle");

  const magneticRef = useRef<HTMLButtonElement | null>(null);

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

  const handleMagneticMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = magneticRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.28;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.28;
    btn.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const handleMagneticLeave = () => {
    const btn = magneticRef.current;
    if (!btn) return;
    btn.style.transform = "translate3d(0px, 0px, 0)";
  };

  const buildBriefText = () => {
    return [
      `Service: ${service}`,
      `From: ${name || "Prospective Client"} (${email || "No email provided"})`,
      "",
      "Project Brief:",
      brief || "Looking to discuss scope, timeline, and deliverables.",
    ].join("\n");
  };

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
      setSubmitStatus("sent");

      if (data.mode !== "resend") {
        const subject = encodeURIComponent(`[Portfolio Inquiry] ${service}`);
        const body = encodeURIComponent(buildBriefText());
        window.location.href = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
      }
    } catch {
      setSubmitStatus("sent");
      const subject = encodeURIComponent(`[Portfolio Inquiry] ${service}`);
      const body = encodeURIComponent(buildBriefText());
      window.location.href = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
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

  return (
    <footer id="contact" className="bg-[#1C1D20] text-white pt-20 sm:pt-32 pb-10">
      <div className="mx-auto max-w-6xl px-6 sm:px-12">
        {/* Iconic Dennis Snellenberg "Let's work together" Header with Circular Portrait Badge */}
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="h-14 w-14 sm:h-20 sm:w-20 rounded-full overflow-hidden bg-[#999D9E] shrink-0">
                <img
                  src="/portrait.jpg"
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

        {/* Horizontal Divider with Overlapping #455CE9 Blue Circular "Get in touch" Button */}
        <div className="relative mt-16 sm:mt-24 mb-16 sm:mb-20">
          <div className="h-[1px] w-full bg-white/20" />
          <div className="absolute right-6 sm:right-20 -top-20 sm:-top-24">
            <button
              ref={magneticRef}
              type="button"
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
              onClick={() => setShowBriefForm((prev) => !prev)}
              className="h-40 w-40 sm:h-48 sm:w-48 rounded-full bg-[#455CE9] hover:bg-[#334BD3] text-white flex flex-col items-center justify-center gap-1 transition-colors duration-300 ease-out-expo cursor-pointer shadow-lg"
            >
              <span className="text-base sm:text-lg font-medium tracking-tight">
                Get in touch
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/80">
                {showBriefForm ? "Hide Brief" : "Scope Project"}
              </span>
            </button>
          </div>
        </div>

        {/* Dennis Snellenberg Rounded Contact Pills */}
        <div className="flex flex-wrap items-center gap-4">
          <a
            href={`mailto:${PROFILE.email}`}
            className="rounded-full border border-white/20 px-7 py-4 text-sm sm:text-base text-white hover:bg-[#455CE9] hover:border-[#455CE9] transition-colors duration-300"
          >
            {PROFILE.email}
          </a>
          <a
            href={`tel:${PROFILE.phone.replace(/\s+/g, "")}`}
            className="rounded-full border border-white/20 px-7 py-4 text-sm sm:text-base text-white hover:bg-[#455CE9] hover:border-[#455CE9] transition-colors duration-300 tabular-nums"
          >
            {PROFILE.phone}
          </a>
          <button
            type="button"
            onClick={() => setShowBriefForm((prev) => !prev)}
            className="rounded-full border border-white/20 px-7 py-4 text-sm sm:text-base text-white/80 hover:text-white hover:border-white transition-colors duration-300 cursor-pointer"
          >
            {showBriefForm ? "Close Brief Builder" : "+ Open Project Brief Builder"}
          </button>
        </div>

        {/* Expandable Project Brief Builder */}
        {showBriefForm && (
          <form
            onSubmit={handleSubmit}
            className="mt-10 border border-white/20 bg-[#141517] p-6 sm:p-8 space-y-5"
          >
            <div className="flex items-center justify-between border-b border-white/15 pb-4">
              <span className="font-mono text-xs uppercase tracking-wider text-white">
                Project Brief Intake
              </span>
              <span className="font-mono text-[11px] text-[#999D9E]">
                VERCEL API + DIRECT MAILTO
              </span>
            </div>

            <div>
              <label
                htmlFor="service-select"
                className="block font-mono text-xs uppercase tracking-wider text-[#999D9E] mb-2"
              >
                Service Pillar
              </label>
              <select
                id="service-select"
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full border border-white/25 bg-[#1C1D20] px-3.5 py-2.5 font-mono text-xs text-white focus:outline-none focus:border-[#455CE9]"
              >
                {SERVICES.map((item) => (
                  <option key={item.id} value={item.title}>
                    {item.number} — {item.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="client-name"
                  className="block font-mono text-xs uppercase tracking-wider text-[#999D9E] mb-2"
                >
                  Your Name
                </label>
                <input
                  id="client-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="w-full border border-white/20 bg-[#1C1D20] px-3.5 py-2.5 text-sm text-white placeholder:text-[#999D9E]/60 focus:outline-none focus:border-[#455CE9]"
                />
              </div>
              <div>
                <label
                  htmlFor="client-email"
                  className="block font-mono text-xs uppercase tracking-wider text-[#999D9E] mb-2"
                >
                  Work Email
                </label>
                <input
                  id="client-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full border border-white/20 bg-[#1C1D20] px-3.5 py-2.5 text-sm text-white placeholder:text-[#999D9E]/60 focus:outline-none focus:border-[#455CE9]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="project-brief"
                className="block font-mono text-xs uppercase tracking-wider text-[#999D9E] mb-2"
              >
                Scope, Bottleneck &amp; Timeline
              </label>
              <textarea
                id="project-brief"
                rows={4}
                required
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                placeholder="Describe the workflow bottleneck, product prototype, or paid ad campaign target..."
                className="w-full border border-white/20 bg-[#1C1D20] px-3.5 py-2.5 text-sm text-white placeholder:text-[#999D9E]/60 focus:outline-none focus:border-[#455CE9]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={submitStatus === "submitting"}
                className="inline-flex items-center gap-2 rounded-full bg-[#455CE9] hover:bg-[#334BD3] px-6 py-3 font-mono text-xs uppercase tracking-wider text-white transition-colors cursor-pointer disabled:opacity-60"
              >
                {submitStatus === "submitting"
                  ? "Dispatching Brief..."
                  : submitStatus === "sent"
                    ? "Brief Logged // Send Again"
                    : "Send Brief via Email"}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={handleCopyBrief}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 font-mono text-xs uppercase tracking-wider text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                {copiedBrief ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-[#455CE9]" aria-hidden="true" />
                    <span>Brief Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Copy Brief</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Dennis Snellenberg Signature Bottom Bar: VERSION | LOCAL TIME | SOCIALS */}
        <div className="mt-24 pt-8 border-t border-white/15 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8">
          <div className="flex flex-wrap gap-10">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#999D9E] mb-1.5">
                Version
              </div>
              <div className="text-xs sm:text-sm text-white">
                2026 &copy; Edition
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#999D9E] mb-1.5">
                Local Time
              </div>
              <div className="text-xs sm:text-sm text-white tabular-nums">
                {localTime} (CDO, PH)
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#999D9E] mb-1.5">
                Education &amp; Distinction
              </div>
              <div className="text-xs sm:text-sm text-white">
                USTP BS CS &apos;27 · 1.00 Startup Lab Lead
              </div>
            </div>
          </div>

          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#999D9E] mb-1.5">
              Socials
            </div>
            <div className="flex items-center gap-6 text-xs sm:text-sm text-white">
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
