"use client";

import { useEffect, useState } from "react";
import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { WorkMatrix } from "./WorkMatrix";
import { InteractiveProofs } from "./InteractiveProofs";
import { ServicesGrid } from "./ServicesGrid";
import { EngagementModels } from "./EngagementModels";
import { ToolkitSection } from "./ToolkitSection";
import { ContactSection } from "./ContactSection";
import { CommandPalette } from "./CommandPalette";
import type { FocusMode, ProofTab, WorkCategory } from "@/data/portfolio";

export function PortfolioShell() {
  const [focusMode, setFocusMode] = useState<FocusMode>("all");
  const [proofTab, setProofTab] = useState<ProofTab>("husai");
  const [selectedService, setSelectedService] = useState("");
  const [workFilter, setWorkFilter] = useState<WorkCategory>("all");
  const [paletteOpen, setPaletteOpen] = useState(false);

  const applyFocusMode = (mode: FocusMode, updateUrl = true) => {
    setFocusMode(mode);
    if (mode === "engineering") {
      setProofTab("husai");
      setWorkFilter("engineering");
    } else if (mode === "creative") {
      setProofTab("hackerlily");
      setWorkFilter("creative");
    } else {
      setProofTab("husai");
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
      const params = new URLSearchParams(window.location.search);
      const focusParam = params.get("focus");
      if (focusParam === "engineering" || focusParam === "creative") {
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
      <Navbar
        focusMode={focusMode}
        onChangeFocusMode={(m) => applyFocusMode(m, true)}
        onOpenCommandPalette={() => setPaletteOpen(true)}
      />
      <main>
        {/* 1. Dennis Snellenberg 100vh #999D9E Hero + Split Statement & Overlapping Circular Magnetic CTA */}
        <Hero focusMode={focusMode} onJumpToProof={handleJumpToProof} />

        {/* 2. Dennis Snellenberg "RECENT WORK" Oversized Project List + 340x340 Cursor Follower & Blue "View" Circle */}
        <WorkMatrix
          externalFilter={workFilter}
          onJumpToProof={handleJumpToProof}
        />

        {/* 3. Dark Cinema Proof Stage (HusAI 60s Remotion Demo + Localhost :5173 + 3 Autoplaying HipSurfer 9:16 Reels + Pacs <5s Audit) */}
        <InteractiveProofs activeTab={proofTab} onChangeTab={setProofTab} />

        {/* 4. Services, Engagement Models & Toolkit */}
        <ServicesGrid onSelectService={setSelectedService} />
        <EngagementModels onSelectModel={setSelectedService} />
        <ToolkitSection />
      </main>

      {/* 5. Dennis Snellenberg #1C1D20 "Let's work together" Footer with #455CE9 Circular "Get in touch" Button */}
      <ContactSection preselectedService={selectedService} />

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        focusMode={focusMode}
        onChangeFocusMode={(m) => applyFocusMode(m, true)}
        onJumpToProof={handleJumpToProof}
        onSelectService={setSelectedService}
        onFilterWork={setWorkFilter}
      />
    </>
  );
}
