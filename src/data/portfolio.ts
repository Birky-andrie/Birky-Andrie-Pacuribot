export type WorkCategory = "all" | "engineering" | "creative" | "leadership" | "github";
export type FocusMode = "all" | "engineering" | "creative";
export type ProofTab = "husai" | "hackerlily" | "pacs";

export interface ServicePillar {
  id: string;
  number: string;
  title: string;
  audience: string;
  outcome: string;
  deliverables: string[];
}

export interface CaseStudyPreview {
  type: "video" | "image" | "telemetry";
  src?: string;
  poster?: string;
  badge: string;
  highlight: string;
  sublabel: string;
}

export interface CaseStudy {
  id: string;
  index: string;
  code: string;
  title: string;
  clientOrContext: string;
  locationTag: string;
  role: string;
  period: string;
  categories: Exclude<WorkCategory, "all">[];
  primaryMetric: string;
  primaryMetricLabel: string;
  problem: string;
  execution: string;
  impact: string;
  stack: string[];
  previewMedia: CaseStudyPreview;
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

export const FOCUS_COPY: Record<
  FocusMode,
  {
    badge: string;
    headline: string;
    subheadline: string;
  }
> = {
  all: {
    badge: "HYBRID MODE // CS ENGINEER + CREATIVE TECHNOLOGIST",
    headline:
      "I engineer fast internal web systems and direct-response video assets that drive measurable revenue.",
    subheadline:
      "I replace manual spreadsheet bottlenecks with role-based web applications (<5s audit reporting), build real-time AI call-coaching software (HusAI), and produce A/B-tested 9:16 Meta & TikTok ad creatives for international brands.",
  },
  engineering: {
    badge: "ENGINEERING FOCUS // FULL-STACK SYSTEMS & AI PROTOTYPING",
    headline:
      "I build sub-5-second internal web platforms, real-time AI coaching tools, and full-SDLC software.",
    subheadline:
      "Specializing in React/Next.js, TypeScript/Express, Electron, and Groq/Gemini AI pipelines—replacing manual Excel workflows with role-based audit systems and shipping production prototypes with 1.00-grade SDLC rigor.",
  },
  creative: {
    badge: "CREATIVE FOCUS // DIRECT-RESPONSE 9:16 VIDEO & MOTION",
    headline:
      "I engineer high-retention 9:16 paid social video ads and visual systems that convert cold traffic.",
    subheadline:
      "Combining UI/UX typography hierarchy, beat-synced CapCut Pro editing, Foley sound design, and rapid A/B hook testing (Skeptic UGC, Competitor Switchers, Minimalist Lifestyle) for international D2C brands.",
  },
};

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
    id: "husai",
    index: "01",
    code: "GH-01",
    title: "HusAI — Real-Time AI Call Coach",
    clientOrContext: "USTP Startup Incubation · Open Source",
    locationTag: "CDO, PH // VERCEL + ELECTRON",
    role: "Creator & Full-Stack Builder",
    period: "2026",
    categories: ["engineering", "github"],
    primaryMetric: "4.0s",
    primaryMetricLabel: "Web Audio VAD Silence Trigger",
    problem:
      "Filipino Virtual Assistants taking live international client calls (US/UK/AU) on Meet or Zoom work solo without a supervisor—most call tools only analyze recordings after the call has already gone wrong.",
    execution:
      "Engineered a dual-channel React (Vite) web app, Electron desktop shell, and Express/TypeScript backend. Uses an STT-independent Web Audio AnalyserNode amplitude VAD (4s silence, 8s debounce) to trigger 'The Lifeline' (3 live Smart Replies via Groq llama-3.1-8b-instant) alongside dual-channel transcription (Web Speech API + Groq whisper-large-v3-turbo) and post-call pattern scoring ('The Review' via Gemini 2.5 Flash).",
    impact:
      "Ships as both a web client with a floating Picture-in-Picture coach window and a Windows/macOS Electron desktop build, scoring calls across Confidence, Clarity, Conciseness, and Professionalism.",
    stack: [
      "React (Vite)",
      "TypeScript / Express",
      "Electron",
      "Web Audio VAD",
      "Groq LLaMA 3.1 & Whisper",
      "Gemini Flash",
      "Prisma",
    ],
    previewMedia: {
      type: "image",
      src: "/husai/screen-solution.png",
      badge: "HUSAI // LIVE CALL COACH",
      highlight: "4.0s Silence VAD -> 3 Instant Smart Replies",
      sublabel: "Localhost :5173 UI + 60s Remotion Reveal",
    },
    links: {
      repo: "https://github.com/Birky-andrie/HusAI",
      live: "https://hus-ai-five.vercel.app",
    },
  },
  {
    id: "hackerlily-hipsurfer",
    index: "02",
    code: "CS-02",
    title: "Hackerlily HipSurfer — 9:16 Ad System",
    clientOrContext: "Hackerlily (International Client)",
    locationTag: "GERMANY / AU // META & TIKTOK",
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
      "Delivered multi-variant top-of-funnel ad assets (Skeptic UGC, Competitor Switcher, and Minimalist Lifestyle cuts) aligned directly with international brand stakeholders.",
    stack: [
      "CapCut Pro",
      "A/B Hook Testing",
      "Kinetic Typography",
      "Foley Audio",
      "Meta / TikTok / Pinterest",
    ],
    previewMedia: {
      type: "video",
      src: "/videos/hipsurfer-02.mp4",
      poster: "/videos/hipsurfer-02-poster.jpg",
      badge: "9:16 PAID SOCIAL // 3 REELS",
      highlight: "Beat-Synced Direct-Response Cuts",
      sublabel: "Meta, TikTok & Pinterest Paid Acquisition",
    },
  },
  {
    id: "pacs-builders",
    index: "03",
    code: "CS-01",
    title: "Pacs Builders — Material Audit Engine",
    clientOrContext: "Pacs Builders (Engineering Firm)",
    locationTag: "CDO, PH // INTERNAL WEB APP",
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
      "Eliminated manual spreadsheet reconciliation for non-technical staff and cut data-heavy audit and inventory report generation from ~20 minutes to under 5 seconds.",
    stack: ["Python", "HTML/CSS", "Role-Based Auth", "SDLC", "Audit Reporting"],
    previewMedia: {
      type: "telemetry",
      badge: "RBAC AUDIT // < 5.0S SLA",
      highlight: "1.84s Avg Query vs. ~20m Manual Excel",
      sublabel: "Admin · Auditor · Staff Permission Trails",
    },
  },
  {
    id: "trailblazer-startup-lab",
    index: "04",
    code: "CS-03",
    title: "Trailblazer Startup Lab — Incubation Lead",
    clientOrContext: "Trailblazer Startup Lab, USTP",
    locationTag: "USTP CDO // FULL SDLC",
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
    stack: [
      "Technical Leadership",
      "SDLC Documentation",
      "ClickUp",
      "System Architecture",
    ],
    previewMedia: {
      type: "telemetry",
      badge: "INCUBATION LEADERSHIP",
      highlight: "1.00 Final Distinction Grade",
      sublabel: "Concept -> Architecture -> QA -> Demo Day",
    },
  },
  {
    id: "siam-cs3b",
    index: "05",
    code: "GH-02",
    title: "SIAM_CS3B — Real-Time App & QA Suite",
    clientOrContext: "GitHub Open Source · Render",
    locationTag: "NODE.JS + SOCKET.IO",
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
    previewMedia: {
      type: "telemetry",
      badge: "DEVOPS & QA RIGOR",
      highlight: "Socket.IO + CI/CD + Risk Registers",
      sublabel: "Full Defect Log & Sprint Traceability",
    },
    links: {
      repo: "https://github.com/Birky-andrie/SIAM_CS3B",
    },
  },
  {
    id: "financify",
    index: "06",
    code: "GH-03",
    title: "Financify — Cross-Platform Finance Base",
    clientOrContext: "GitHub Open Source · Flutter/C++",
    locationTag: "6 OS TARGETS",
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
    previewMedia: {
      type: "telemetry",
      badge: "MULTI-PLATFORM ARCHITECTURE",
      highlight: "iOS · Android · Web · Win · macOS · Linux",
      sublabel: "Unified Dart + C++ CMake Workspace",
    },
    links: {
      repo: "https://github.com/Birky-andrie/Financify",
    },
  },
];

export const TOOLKIT_GROUPS: ToolkitGroup[] = [
  {
    code: "TK-01",
    functionName: "Engineering & Systems",
    summary:
      "Frontend interfaces, workflow automation, and AI-assisted full-stack builds.",
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
    summary:
      "Structured delivery from initial documentation to remote client execution.",
    items: [
      { name: "ClickUp", role: "Sprint & task workflow management" },
      { name: "SDLC Documentation", role: "Specs, architecture & QA logs" },
      { name: "Agile / Sprint Planning", role: "Backlog & milestone execution" },
      { name: "Google Workspace", role: "Remote team & client operations" },
      { name: "MS Excel", role: "Legacy workflow auditing & migration" },
      {
        name: "English / Filipino / Cebuano",
        role: "Global & local stakeholder comms",
      },
    ],
  },
];
