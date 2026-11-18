"use client";

import { useEffect, useState } from "react";
import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { ServicesGrid } from "./ServicesGrid";
import { InteractiveProofs } from "./InteractiveProofs";
import { WorkMatrix } from "./WorkMatrix";
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
        <Hero focusMode={focusMode} onJumpToProof={handleJumpToProof} />
        <ServicesGrid onSelectService={setSelectedService} />
        <InteractiveProofs activeTab={proofTab} onChangeTab={setProofTab} />
        <WorkMatrix
          externalFilter={workFilter}
          onJumpToProof={handleJumpToProof}
        />
        <EngagementModels onSelectModel={setSelectedService} />
        <ToolkitSection />
      </main>
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
