export type WorkCategory = "all" | "engineering" | "creative" | "leadership" | "github";

export interface ServicePillar {
  id: string;
  number: string;
  title: string;
  audience: string;
  outcome: string;
  deliverables: string[];
}

export interface CaseStudy {
  id: string;
  code: string;
  title: string;
  clientOrContext: string;
  role: string;
  period: string;
  categories: Exclude<WorkCategory, "all">[];
  primaryMetric: string;
  primaryMetricLabel: string;
  problem: string;
  execution: string;
  impact: string;
  stack: string[];
  links?: {
    repo?: string;
    live?: string;
  };
}

export interface ToolkitGroup {
  code: string;
  functionName: string;
  summary: string;
  items: { name: string; role: string }[];
}

export const PROFILE = {
  name: "Birky Andrie L. Pacuribot",
  shortName: "BIRKY PACURIBOT",
  location: "Cagayan de Oro City, PH",
  timezone: "UTC+8 (Global Remote)",
  email: "pacuribot.birkyandrie@gmail.com",
  phone: "+63 966 704 3646",
  github: "https://github.com/Birky-andrie",
  education: "BS Computer Science, USTP CDO (2023–2027)",
  distinction: "Project Lead, Trailblazer Startup Lab (Final Grade: 1.00)",
} as const;

export const HERO_METRICS = [
  {
    value: "< 5s",
    label: "Audit Report Latency",
    source: "Pacs Builders Material System",
  },
  {
    value: "1.00",
    label: "Final Leadership Grade",
    source: "Trailblazer Startup Lab, USTP",
  },
  {
    value: "20–40s",
    label: "Direct-Response Ad Cuts",
    source: "Hackerlily HipSurfer (Germany)",
  },
] as const;

export const SERVICES: ServicePillar[] = [
  {
    id: "workflow-engineering",
    number: "01",
    title: "Custom Web & Workflow Engineering",
    audience: "Operations-heavy teams outgrowing spreadsheets",
    outcome:
      "Replace error-prone manual Excel tracking with centralized, role-based web applications and sub-5-second audit reporting.",
    deliverables: [
      "Role-Based Access (Admin / Auditor / Staff)",
      "Automated Audit Trails",
      "Real-Time Inventory & Reporting Modules",
      "Non-Technical Staff UX",
    ],
  },
  {
    id: "ai-prototyping",
    number: "02",
    title: "AI Integration & Rapid Prototyping",
    audience: "Founders & remote service teams validating products",
    outcome:
      "Ship working AI-assisted web and desktop tools—from live call coaching to LLM-backed transcript analysis—in compressed sprint cycles.",
    deliverables: [
      "LLM & Speech-to-Text Pipelines (Groq / Gemini)",
      "React, Next.js & Electron Frontends",
      "Rapid UI Iteration & Component Systems",
      "Vercel / Render Deployment",
    ],
  },
  {
    id: "direct-response-creative",
    number: "03",
    title: "Direct-Response Video & Creative Production",
    audience: "International D2C & e-commerce brands",
    outcome:
      "Produce 20–40s Meta, TikTok, and Pinterest video ads engineered with A/B-tested hooks, kinetic typography, and sound-off readability.",
    deliverables: [
      "UGC & Text-Driven Ad Variations",
      "A/B Hook & Social Proof Testing",
      "Mobile UI/UX Typography Hierarchy",
      "Foley Sound Design & Audio Mixing",
    ],
  },
  {
    id: "technical-leadership",
    number: "04",
    title: "Technical Project Leadership",
    audience: "Early-stage startups & engineering cohorts",
    outcome:
      "Guide product concepts from initial system documentation through Agile sprint execution, QA defect logging, and production launch.",
    deliverables: [
      "Full SDLC & Architecture Docs",
      "Agile Backlog & ClickUp Workflows",
      "QA Test Plans & Risk Registers",
      "Cross-Functional Stakeholder Alignment",
    ],
  },
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "pacs-builders",
    code: "CS-01",
    title: "Centralized Material Tracking & Auditing System",
    clientOrContext: "Pacs Builders (Engineering Firm, CDO)",
    role: "Contract Programmer — Frontend & Workflow Automation",
    period: "AUG 2025 – DEC 2025",
    categories: ["engineering"],
    primaryMetric: "< 5s",
    primaryMetricLabel: "Complex Audit Report Generation",
    problem:
      "Material receipts, site usage, and inventory movements were tracked across fragmented manual Excel sheets, causing human entry errors and slow audit reconciliation.",
    execution:
      "Built the frontend interface and workflow automation for a centralized web platform with role-based permissions (Admin, Auditor, Staff), automated transaction trails, and optimized reporting queries.",
    impact:
      "Eliminated manual spreadsheet reconciliation for non-technical staff and cut data-heavy audit and inventory report generation to under 5 seconds.",
    stack: ["Python", "HTML/CSS", "Role-Based Auth", "SDLC", "Audit Reporting"],
  },
  {
    id: "hackerlily-hipsurfer",
    code: "CS-02",
    title: "Direct-Response Paid Ad Creatives (HipSurfer)",
    clientOrContext: "Hackerlily (Germany-Based Client)",
    role: "Freelance Video Editor & Creative Strategist",
    period: "FEB 2026 – PRESENT",
    categories: ["creative"],
    primaryMetric: "20–40s",
    primaryMetricLabel: "High-Retention Ad Variations",
    problem:
      "International D2C paid acquisition on Meta, TikTok, and Pinterest requires rapid creative iteration to prevent ad fatigue and capture sound-off mobile scrollers.",
    execution:
      "Engineered beat-synced UGC and text-led video ads targeting pain points, social proof, and competitor switching. Applied mobile UI/UX typography hierarchy, Foley sound design, and rapid A/B hook testing.",
    impact:
      "Delivered multi-variant top-of-funnel ad assets (talking-head vs. text-led, dynamic award badges and review metrics) aligned directly with German brand stakeholders.",
    stack: ["CapCut Pro", "A/B Hook Testing", "Kinetic Typography", "Foley Audio", "Meta / TikTok / Pinterest"],
  },
  {
    id: "trailblazer-startup-lab",
    code: "CS-03",
    title: "Startup Incubation & Full-SDLC Delivery",
    clientOrContext: "Trailblazer Startup Lab, USTP CDO",
    role: "Project Lead",
    period: "JUN 2026 – AUG 2026",
    categories: ["leadership"],
    primaryMetric: "1.00",
    primaryMetricLabel: "Final Grade (Highest Distinction)",
    problem:
      "Translating an early-stage startup concept into a documented, testable, and deployable software product under strict academic and incubation milestones.",
    execution:
      "Led technical scoping, system architecture documentation, task prioritization, and end-to-end SDLC coordination from initial design specs to final deployment.",
    impact:
      "Delivered the complete incubation milestone on schedule and earned a Final Grade of 1.00—the highest possible academic distinction at USTP.",
    stack: ["Technical Leadership", "SDLC Documentation", "ClickUp", "System Architecture"],
  },
  {
    id: "husai",
    code: "GH-01",
    title: "HusAI — Real-Time AI Call Coach for Remote VAs",
    clientOrContext: "GitHub Open Source · Live on Vercel",
    role: "Creator & Full-Stack Builder",
    period: "2026",
    categories: ["engineering", "github"],
    primaryMetric: "~4s",
    primaryMetricLabel: "Pause-Triggered Live Coaching",
    problem:
      "Filipino Virtual Assistants handling live international client calls face high-stakes communication pressure and slow post-call feedback loops.",
    execution:
      "Built a React/Vite web client, Electron desktop app, and Express/TypeScript backend powered by Groq (LLaMA 3.1 & Whisper) and Gemini Flash. Features 'The Lifeline' (3 live suggestions on a ~4s client pause) and 'The Review' (post-call transcript analysis and custom roleplay).",
    impact:
      "Deployed a production prototype addressing real BPO/VA onboarding and live call confidence bottlenecks.",
    stack: ["React", "TypeScript", "Electron", "Express", "Groq LLaMA 3.1", "Gemini Flash"],
    links: {
      repo: "https://github.com/Birky-andrie/HusAI",
      live: "https://hus-ai-five.vercel.app",
    },
  },
  {
    id: "siam-cs3b",
    code: "GH-02",
    title: "SIAM_CS3B — Client-Server App & DevOps Docs",
    clientOrContext: "GitHub Open Source · Render Deployment",
    role: "Systems & QA Contributor",
    period: "2026",
    categories: ["engineering", "leadership", "github"],
    primaryMetric: "100%",
    primaryMetricLabel: "SDLC & QA Traceability",
    problem:
      "Student and early-stage web builds often ship without real-time architecture, CI/CD discipline, or formal QA defect tracking.",
    execution:
      "Implemented a Node.js, Express, and Socket.IO client-server application paired with structured Agile sprint backlogs, CI/CD pipeline configs, QA testing defect logs, and risk registers.",
    impact:
      "Demonstrates production-minded engineering rigor—linking live Socket.IO features with formal verification and release documentation.",
    stack: ["Node.js", "Express", "Socket.IO", "CI/CD", "QA Defect Logs"],
    links: {
      repo: "https://github.com/Birky-andrie/SIAM_CS3B",
    },
  },
  {
    id: "financify",
    code: "GH-03",
    title: "Financify — Cross-Platform Personal Finance Base",
    clientOrContext: "GitHub Open Source · Multi-Target Flutter",
    role: "Cross-Platform Developer",
    period: "2025",
    categories: ["engineering", "github"],
    primaryMetric: "6",
    primaryMetricLabel: "Target Platforms (Web/Mobile/Desktop)",
    problem:
      "Personal finance tools often lock users into a single OS ecosystem, requiring separate codebases for mobile and desktop.",
    execution:
      "Configured a unified Flutter/Dart and CMake/C++ project scaffold targeting Android, iOS, Web, Windows, macOS, and Linux from a single repository.",
    impact:
      "Provides a clean multi-platform foundation ready for rapid feature iteration across consumer finance workflows.",
    stack: ["Flutter", "Dart", "C++", "CMake", "Cross-Platform"],
    links: {
      repo: "https://github.com/Birky-andrie/Financify",
    },
  },
];

export const TOOLKIT_GROUPS: ToolkitGroup[] = [
  {
    code: "TK-01",
    functionName: "Engineering & Systems",
    summary: "Frontend interfaces, workflow automation, and AI-assisted full-stack builds.",
    items: [
      { name: "React / Next.js", role: "Production UI & App Router" },
      { name: "Tailwind CSS", role: "Design systems & responsive grids" },
      { name: "TypeScript / JavaScript", role: "Type-safe client & Express APIs" },
      { name: "Python", role: "Backend logic & parallel processing" },
      { name: "C++", role: "Systems & CS foundations" },
      { name: "HTML / CSS", role: "Semantic markup & precision layout" },
      { name: "Node.js / Socket.IO", role: "Real-time client-server apps" },
      { name: "Groq / Gemini APIs", role: "LLM & Whisper voice pipelines" },
    ],
  },
  {
    code: "TK-02",
    functionName: "Creative & Direct-Response",
    summary: "High-retention paid social video production and visual hierarchy.",
    items: [
      { name: "CapCut Pro", role: "Beat-synced short-form ad editing" },
      { name: "Adobe Ecosystem", role: "Graphic design & brand assets" },
      { name: "Figma", role: "UI/UX wireframes & layout systems" },
      { name: "Canva", role: "Rapid static ad & social templates" },
      { name: "Foley & Sound Mixing", role: "Audio polish & pacing retention" },
      { name: "A/B Creative Testing", role: "Hook, angle & social proof variants" },
    ],
  },
  {
    code: "TK-03",
    functionName: "Operations & Leadership",
    summary: "Structured delivery from initial documentation to remote client execution.",
    items: [
      { name: "ClickUp", role: "Sprint & task workflow management" },
      { name: "SDLC Documentation", role: "Specs, architecture & QA logs" },
      { name: "Agile / Sprint Planning", role: "Backlog & milestone execution" },
      { name: "Google Workspace", role: "Remote team & client operations" },
      { name: "MS Excel", role: "Legacy workflow auditing & migration" },
      { name: "English / Filipino / Cebuano", role: "Global & local stakeholder comms" },
    ],
  },
];
