export type WorkCategory =
  | "all"
  | "va"
  | "creative"
  | "engineering"
  | "leadership"
  | "github";
export type FocusMode = "all" | "va" | "creative" | "engineering";
export type ProofTab = "hackerlily" | "husai" | "pacs" | "financify";

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
  whatsappUrl: "https://wa.me/639667043646",
  github: "https://github.com/Birky-andrie",
  education: "BS Computer Science, USTP CDO (2023–2027)",
  distinction: "Project Lead, Trailblazer Startup Lab (Final Grade: 1.00)",
} as const;

export const REMOTE_READINESS_SPECS = [
  {
    label: "GLOBAL SHIFT OVERLAP",
    value: "AU / APAC · EU (Germany) · UK / US",
    detail: "UTC+8 Base · Flexible Shift Alignment",
  },
  {
    label: "VA & TECH CREDENTIALS",
    value: "Alpha VA Certified · 1.00 Lab Lead",
    detail: "Freelance Movement · USTP BS CS '27",
  },
  {
    label: "CREATIVE & DEV OUTPUT",
    value: "45+ Paid Ad Cuts · <5s Web Systems",
    detail: "CapCut Pro · React/Next.js · AI/Groq",
  },
  {
    label: "AVAILABILITY & COMMS",
    value: "Immediate Start · English (Fluent)",
    detail: "Full-Time · Part-Time · Retainer",
  },
] as const;

export const HERO_METRICS = [
  {
    value: "45+",
    label: "9:16 Paid Social Cuts",
    source: "Hackerlily HipSurfer (Germany/AU)",
  },
  {
    value: "< 5s",
    label: "Audit Report Latency",
    source: "Pacs Builders Web Automation",
  },
  {
    value: "1.00",
    label: "Startup Lab Distinction",
    source: "Trailblazer Project Lead (HusAI)",
  },
] as const;

export const FOCUS_COPY: Record<
  FocusMode,
  {
    heroRoleLines: [string, string, string];
    badge: string;
    headline: string;
    subheadline: string;
  }
> = {
  all: {
    heroRoleLines: [
      "Creative Technologist,",
      "Technical VA &",
      "Workflow Builder",
    ],
    badge: "01 // HYBRID EXECUTION",
    headline:
      "High-converting 9:16 video ads, executive remote operations, and sub-5-second web systems.",
    subheadline:
      "One technical partner pairing Alpha VA operations and international D2C ad production with full-stack CS engineering.",
  },
  va: {
    heroRoleLines: [
      "Technical VA,",
      "Operations &",
      "Social Media Strategist",
    ],
    badge: "01 // TECHNICAL VA & REMOTE OPS",
    headline:
      "Executive remote operations, multi-platform social growth, and workflow automation.",
    subheadline:
      "Alpha VA Certified and Freelance Movement trained—running ClickUp sprints, content calendars, and 9:16 reels.",
  },
  creative: {
    heroRoleLines: [
      "Direct-Response",
      "Video Editor &",
      "Creative Strategist",
    ],
    badge: "01 // 9:16 PAID SOCIAL VIDEO",
    headline:
      "High-retention 9:16 paid social video ads engineered to convert cold traffic.",
    subheadline:
      "Beat-synced CapCut Pro cuts, sound-off typography, Foley audio, and rapid A/B hook testing for D2C brands.",
  },
  engineering: {
    heroRoleLines: [
      "Full-Stack",
      "CS Engineer &",
      "AI Product Builder",
    ],
    badge: "01 // FULL-STACK & AI SYSTEMS",
    headline:
      "Sub-5-second internal web platforms, real-time AI voice tools, and 6-OS apps.",
    subheadline:
      "React/Next.js, TypeScript, Electron, Flutter, and Groq/Gemini pipelines built with 1.00-grade SDLC rigor.",
  },
};

export const SERVICES: ServicePillar[] = [
  {
    id: "direct-response-creative",
    number: "01",
    title: "Direct-Response Video & Social Media Growth",
    audience: "D2C brands, founders & marketing teams",
    outcome:
      "Produce 15–40s Meta, TikTok, IG Reels, and Pinterest video ads engineered with A/B-tested hooks, kinetic typography, Foley audio, and consistent content calendars.",
    deliverables: [
      "UGC, Switcher, Launch & Meme Reel Cuts",
      "Sound-Off Mobile Typography Hierarchy",
      "Foley Sound Design & Commercial Mixing",
      "Multi-Platform SMM Scheduling & Trend Research",
    ],
  },
  {
    id: "technical-va-operations",
    number: "02",
    title: "Technical VA & Executive Remote Operations",
    audience: "Busy founders & remote international teams",
    outcome:
      "Run day-to-day executive operations, ClickUp sprint boards, and documentation while using technical automation to eliminate repetitive admin work.",
    deliverables: [
      "Alpha VA Certified Executive Support",
      "ClickUp, Google Workspace & Excel Systems",
      "AI-Assisted Research, Scripting & SOPs",
      "Cross-Timezone Stakeholder Coordination",
    ],
  },
  {
    id: "workflow-engineering",
    number: "03",
    title: "Custom Web & Workflow Engineering",
    audience: "Operations-heavy teams outgrowing spreadsheets",
    outcome:
      "Replace error-prone manual Excel tracking with centralized, role-based web applications and sub-5-second audit reporting.",
    deliverables: [
      "Role-Based Access (Admin / Auditor / Staff)",
      "Automated Audit Trails & Inventory Logs",
      "Sub-5-Second Reporting Dashboards",
      "Intuitive Non-Technical Staff UX",
    ],
  },
  {
    id: "ai-prototyping",
    number: "04",
    title: "AI Integration & Technical Project Leadership",
    audience: "Startups validating AI tools & software products",
    outcome:
      "Guide product concepts from initial SDLC architecture documentation through Groq/Gemini AI integration, QA defect logging, and Vercel/Render launch.",
    deliverables: [
      "LLM & Whisper Voice Pipelines (Groq / Gemini)",
      "React, Next.js & Electron Frontends",
      "Full SDLC Docs, QA Logs & Risk Registers",
      "1.00-Grade Incubation Delivery Discipline",
    ],
  },
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "hackerlily-hipsurfer",
    index: "01",
    code: "CS-01",
    title: "Hackerlily HipSurfer — 9:16 Ad System",
    clientOrContext: "Hackerlily (Germany / International Client)",
    locationTag: "META · TIKTOK · PINTEREST · IG",
    role: "Direct-Response Video Editor & Creative Strategist",
    period: "FEB 2026 – SEP 2026",
    categories: ["creative", "va"],
    primaryMetric: "45+ Cuts",
    primaryMetricLabel: "15–40s A/B Paid Social Reels",
    problem:
      "Cold D2C traffic on Meta, TikTok, and Pinterest requires rapid A/B hook variation to beat ad fatigue.",
    execution:
      "Cut 45+ beat-synced 9:16 reels across Skeptic UGC, Switchers, EOFY Launches, and Trends with Foley sound design.",
    impact:
      "Shipped a complete high-retention 9:16 ad library directly with brand stakeholders in Germany.",
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
      badge: "9:16 PAID SOCIAL // 6 REELS",
      highlight: "Beat-Synced Direct-Response Cuts",
      sublabel: "Meta, TikTok & Pinterest Paid Acquisition",
    },
  },
  {
    id: "husai",
    index: "02",
    code: "GH-01",
    title: "HusAI — Real-Time AI Call Coach",
    clientOrContext: "Trailblazer Startup Lab (1.00 Distinction) · Open Source",
    locationTag: "REACT + ELECTRON + GROQ AI",
    role: "Creator & Project Lead (Final Grade: 1.00)",
    period: "2026",
    categories: ["engineering", "va", "github", "leadership"],
    primaryMetric: "1.00 · 4.0s VAD",
    primaryMetricLabel: "Startup Lab Lead & Live AI Coach",
    problem:
      "Remote VAs take high-stakes international client calls solo without real-time supervisor support.",
    execution:
      "Led full-SDLC delivery (earning USTP's highest 1.00 distinction) and built a React + Electron + Express app firing 3 Groq LLaMA 3.1 replies on a 4.0s Web Audio VAD.",
    impact:
      "Ships as both a web app and desktop shell with dual-channel transcription and post-call Gemini scoring.",
    stack: [
      "React (Vite)",
      "TypeScript / Express",
      "Electron",
      "Web Audio VAD",
      "Groq LLaMA 3.1 & Whisper",
      "Gemini Flash",
      "1.00 SDLC Lead",
    ],
    previewMedia: {
      type: "image",
      src: "/husai/husai-preview.png",
      badge: "HUSAI · REAL-TIME AI COACH",
      highlight: "4.0s Silence VAD -> 3 Instant Smart Replies",
      sublabel: "Web + Electron Desktop · 1.00 Distinction",
    },
    links: {
      repo: "https://github.com/Birky-andrie/HusAI",
      live: "https://hus-ai-five.vercel.app",
    },
  },
  {
    id: "pacs-builders",
    index: "03",
    code: "CS-02",
    title: "Pacs Builders — Material Audit Engine",
    clientOrContext: "Pacs Builders (Engineering Firm)",
    locationTag: "CDO, PH · WORKFLOW AUTOMATION",
    role: "Contract Programmer — Frontend & Workflow Automation",
    period: "AUG 2025 – DEC 2025",
    categories: ["engineering", "va"],
    primaryMetric: "< 5s",
    primaryMetricLabel: "Audit Report Generation",
    problem:
      "Fragmented manual Excel sheets caused data entry errors and 20-minute audit reconciliations.",
    execution:
      "Built a role-based web platform (Admin, Auditor, Staff) with immutable transaction trails and fast queries.",
    impact:
      "Cut material audit report generation from ~20 minutes of manual Excel work to under 5 seconds.",
    stack: ["Python", "HTML/CSS", "Role-Based Auth", "Excel Migration", "Audit Reporting"],
    previewMedia: {
      type: "telemetry",
      badge: "PACS BUILDERS · AUDIT ENGINE",
      highlight: "1.84s Avg Query vs. ~20m Manual Excel",
      sublabel: "Admin · Auditor · Staff Permission Trails",
    },
  },
  {
    id: "financify",
    index: "04",
    code: "GH-03",
    title: "Financify — Cross-Platform Budget & Analysis App",
    clientOrContext: "GitHub Open Source · Flutter / Dart",
    locationTag: "6 OS TARGETS · LIVE TEST RUN",
    role: "Flutter Cross-Platform Developer",
    period: "2025",
    categories: ["engineering", "github"],
    primaryMetric: "6 OS",
    primaryMetricLabel: "Weekly ₱ Budget & Delta App",
    problem:
      "Personal finance trackers often require bloated subscriptions instead of fast offline weekly ₱ budgeting.",
    execution:
      "Built a 625-line Flutter app (lib/main.dart) with BudgetScreen, AnalysisScreen delta trends, and SharedPreferences.",
    impact:
      "Targets 6 OS platforms from one Dart codebase—available to test-run live in the Proof Stage below.",
    stack: ["Flutter", "Dart", "SharedPreferences", "ImagePicker", "6 OS Targets"],
    previewMedia: {
      type: "image",
      src: "/financify/financify-preview.png",
      badge: "FLUTTER LIVE MOBILE TEST RUN",
      highlight: "₱ Weekly Budget · Delta Analysis · 6 OS",
      sublabel: "Interactive lib/main.dart Runner",
    },
    links: {
      repo: "https://github.com/Birky-andrie/Financify",
    },
  },
  {
    id: "remote-va-ops",
    index: "05",
    code: "VA-01",
    title: "Global Remote Operations & SMM Growth",
    clientOrContext: "Alpha VA Certified · Freelance Movement · Brand Ops",
    locationTag: "REMOTE · GLOBAL CLIENTS",
    role: "Technical Virtual Assistant, SMM & Creative Director",
    period: "JAN 2023 – PRESENT",
    categories: ["va", "creative", "leadership"],
    primaryMetric: "3+ Yrs",
    primaryMetricLabel: "Remote VA, SMM & Brand Direction",
    problem:
      "Founders lose hours to fragmented content calendars, manual admin tasks, and inconsistent social publishing.",
    execution:
      "Managed multi-platform SMM calendars, clothing brand art direction, and ClickUp/Workspace ops with AI workflows.",
    impact:
      "Delivered reliable UTC+8 global remote operations alongside a 1.00 academic leadership track.",
    stack: [
      "Alpha VA Certified",
      "Freelance Movement",
      "ClickUp",
      "Google Workspace",
      "Canva / Adobe",
      "AI Workflows",
    ],
    previewMedia: {
      type: "video",
      src: "/videos/hipsurfer-04.mp4",
      poster: "/videos/hipsurfer-04-poster.jpg",
      badge: "ALPHA VA + SMM + BRAND OPS",
      highlight: "Executive Ops · Content Calendars · AI Speed",
      sublabel: "ClickUp · Google Workspace · Multi-Platform SMM",
    },
  },
];

export const TOOLKIT_GROUPS: ToolkitGroup[] = [
  {
    code: "TK-01",
    functionName: "Creative & Direct-Response Video",
    summary: "High-retention 9:16 paid social video production, branding, and visual hierarchy.",
    items: [
      { name: "CapCut Pro", role: "Beat-synced 9:16 ad & reel editing" },
      { name: "Foley & Sound Mixing", role: "Audio polish, VO & pacing retention" },
      { name: "A/B Creative Testing", role: "UGC, Switcher, Launch & Meme hooks" },
      { name: "Figma", role: "UI/UX wireframes & layout systems" },
      { name: "Adobe Ecosystem", role: "Graphic design & brand assets" },
      { name: "Canva", role: "Rapid static ad & social templates" },
      { name: "Remotion", role: "Code-driven React motion graphics" },
    ],
  },
  {
    code: "TK-02",
    functionName: "Technical VA & Remote Operations",
    summary:
      "Executive support, multi-platform SMM management, and structured sprint delivery.",
    items: [
      { name: "ClickUp", role: "Sprint, task & SOP workflow management" },
      { name: "Google Workspace", role: "Inbox, calendar, Drive & docs ops" },
      { name: "MS Office & Excel", role: "Legacy spreadsheet auditing & migration" },
      { name: "Multi-Platform SMM", role: "Meta, TikTok, IG & Pinterest scheduling" },
      { name: "AI Operations (Claude/GPT/Gemini)", role: "Vibe coding, scripting & research" },
      { name: "SDLC & QA Documentation", role: "Specs, defect logs & risk registers" },
      { name: "English / Filipino / Cebuano", role: "Global & local stakeholder comms" },
    ],
  },
  {
    code: "TK-03",
    functionName: "Web, AI & Workflow Engineering",
    summary:
      "Frontend interfaces, internal workflow automation, and AI-assisted full-stack builds.",
    items: [
      { name: "React / Next.js", role: "Production UI & App Router" },
      { name: "Tailwind CSS", role: "Design systems & responsive grids" },
      { name: "TypeScript / JavaScript", role: "Type-safe client & Express APIs" },
      { name: "Python & C++", role: "Backend logic & parallel processing" },
      { name: "Groq / Gemini / Whisper APIs", role: "Real-time LLM & voice pipelines" },
      { name: "Electron & Node.js", role: "Desktop shells & Socket.IO servers" },
      { name: "Vercel / Render / GitHub", role: "CI/CD & cloud deployment" },
    ],
  },
];
