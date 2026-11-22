"use client";

import { useEffect, useState } from "react";
import { Preloader } from "./Preloader";
import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { WorkMatrix } from "./WorkMatrix";
import { InteractiveProofs } from "./InteractiveProofs";
import { AppleBentoSection } from "./AppleBentoSection";
import { SlidingGallery } from "./SlidingGallery";
import { ContactSection } from "./ContactSection";
import { CommandPalette } from "./CommandPalette";
import type { ThemeMode } from "./ThemeToggle";
import type { FocusMode, ProofTab, WorkCategory } from "@/data/portfolio";

export function PortfolioShell() {
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [focusMode, setFocusMode] = useState<FocusMode>("all");
  const [proofTab, setProofTab] = useState<ProofTab>("hackerlily");
  const [selectedService, setSelectedService] = useState("");
  const [workFilter, setWorkFilter] = useState<WorkCategory>("all");
  const [paletteOpen, setPaletteOpen] = useState(false);

  const applyTheme = (next: ThemeMode, persist = true) => {
    setTheme(next);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", next);
    }
    if (persist && typeof window !== "undefined") {
      try {
        window.localStorage.setItem("birky-theme", next);
      } catch {
        // ignore storage errors
      }
    }
  };

  const toggleTheme = () => {
    applyTheme(theme === "light" ? "dark" : "light", true);
  };

  const applyFocusMode = (mode: FocusMode, updateUrl = true) => {
    setFocusMode(mode);
    if (mode === "engineering") {
      setProofTab("husai");
      setWorkFilter("engineering");
    } else if (mode === "creative") {
      setProofTab("hackerlily");
      setWorkFilter("creative");
    } else if (mode === "va") {
      setProofTab("hackerlily");
      setWorkFilter("va");
    } else {
      setProofTab("hackerlily");
      setWorkFilter("all");
    }

    if (updateUrl && typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (mode === "all") {
        url.searchParams.delete("focus");
      } else {
        url.searchParams.set("focus", mode);
      }
      window.history.replaceState({}, "", url.toString());
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = window.localStorage.getItem("birky-theme");
        if (saved === "dark" || saved === "light") {
          applyTheme(saved, false);
        } else {
          document.documentElement.setAttribute("data-theme", "light");
        }
      } catch {
        // ignore
      }

      const params = new URLSearchParams(window.location.search);
      const focusParam = params.get("focus");
      if (
        focusParam === "va" ||
        focusParam === "engineering" ||
        focusParam === "creative"
      ) {
        applyFocusMode(focusParam, false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleJumpToProof = (tab: ProofTab) => {
    setProofTab(tab);
    const el = document.querySelector("#proof-lab");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <Preloader />

      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        focusMode={focusMode}
        onChangeFocusMode={(m) => applyFocusMode(m, true)}
        onOpenCommandPalette={() => setPaletteOpen(true)}
      />
      <main>
        <Hero focusMode={focusMode} onJumpToProof={handleJumpToProof} />

        <WorkMatrix
          externalFilter={workFilter}
          onJumpToProof={handleJumpToProof}
        />

        <InteractiveProofs activeTab={proofTab} onChangeTab={setProofTab} />

        <AppleBentoSection
          onJumpToProof={handleJumpToProof}
          onSelectService={setSelectedService}
        />

        <SlidingGallery onJumpToProof={handleJumpToProof} />
      </main>

      <ContactSection preselectedService={selectedService} />

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        theme={theme}
        onToggleTheme={toggleTheme}
        focusMode={focusMode}
        onChangeFocusMode={(m) => applyFocusMode(m, true)}
        onJumpToProof={handleJumpToProof}
        onSelectService={setSelectedService}
        onFilterWork={setWorkFilter}
      />
    </>
  );
}
