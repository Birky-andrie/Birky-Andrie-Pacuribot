"use client";

import { useEffect, useState } from "react";
import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { ServicesGrid } from "./ServicesGrid";
import { WorkMatrix } from "./WorkMatrix";
import { ToolkitSection } from "./ToolkitSection";
import { ContactSection } from "./ContactSection";
import { CommandPalette } from "./CommandPalette";
import type { WorkCategory } from "@/data/portfolio";

export function PortfolioShell() {
  const [selectedService, setSelectedService] = useState("");
  const [workFilter, setWorkFilter] = useState<WorkCategory>("all");
  const [paletteOpen, setPaletteOpen] = useState(false);

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

  return (
    <>
      <Navbar onOpenCommandPalette={() => setPaletteOpen(true)} />
      <main>
        <Hero />
        <ServicesGrid onSelectService={setSelectedService} />
        <WorkMatrix externalFilter={workFilter} />
        <ToolkitSection />
      </main>
      <ContactSection preselectedService={selectedService} />
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onSelectService={setSelectedService}
        onFilterWork={setWorkFilter}
      />
    </>
  );
}
