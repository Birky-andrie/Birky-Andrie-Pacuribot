"use client";

import { useState } from "react";
import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { ServicesGrid } from "./ServicesGrid";
import { WorkMatrix } from "./WorkMatrix";
import { ToolkitSection } from "./ToolkitSection";
import { ContactSection } from "./ContactSection";

export function PortfolioShell() {
  const [selectedService, setSelectedService] = useState("");

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ServicesGrid onSelectService={setSelectedService} />
        <WorkMatrix />
        <ToolkitSection />
      </main>
      <ContactSection preselectedService={selectedService} />
    </>
  );
}
