export type WorkCategory =
  | "all"
  | "va"
  | "creative"
  | "engineering"
  | "leadership"
  | "github";
export type FocusMode = "all" | "va" | "creative" | "engineering";
export type ProofTab = "hackerlily" | "husai" | "pacs";

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
    badge: "HYBRID ADVANTAGE // CREATIVE + TECHNICAL VA + WORKFLOW ENGINEERING",
    headline:
      "Helping global founders and brands scale faster—combining high-converting 9:16 video ads, executive remote operations, and sub-5-second web automation.",
    subheadline:
      "Why hire three separate specialists? I pair Alpha VA Certified remote operations (ClickUp, Google Workspace, SMM calendars) with international D2C paid social production (Hackerlily Germany) and custom CS engineering (HusAI & Pacs Builders).",
  },
  va: {
    heroRoleLines: [
      "Technical VA,",
      "Operations &",
      "Social Media Strategist",
    ],
    badge: "TECHNICAL VA & REMOTE OPS // ALPHA VA CERTIFIED · FREELANCE MOVEMENT",
    headline:
      "Your 1-person remote operations, social media growth, and technical automation partner.",
    subheadline:
      "Trained across Alpha VA and Freelance Movement with a Computer Science foundation—I manage executive schedules, ClickUp workflows, and multi-platform social growth while automating repetitive Excel bottlenecks and editing agency-grade 9:16 reels.",
  },
  creative: {
    heroRoleLines: [
      "Direct-Response",
      "Video Editor &",
      "Creative Strategist",
    ],
    badge: "CREATIVE FOCUS // 9:16 PAID SOCIAL VIDEO & MOTION",
    headline:
      "I engineer high-retention 9:16 paid social video ads and visual systems that convert cold traffic.",
    subheadline:
      "Combining mobile UI/UX typography hierarchy, beat-synced CapCut Pro editing, Foley sound design, and rapid A/B hook testing (Skeptic UGC, Competitor Switchers, Campaign Launches, Meme Reels) for international D2C brands.",
  },
  engineering: {
    heroRoleLines: [
      "Full-Stack",
      "CS Engineer &",
      "AI Product Builder",
    ],
    badge: "ENGINEERING FOCUS // FULL-STACK SYSTEMS & AI PROTOTYPING",
    headline:
      "I build sub-5-second internal web platforms, real-time AI coaching tools, and full-SDLC software.",
    subheadline:
      "Specializing in React/Next.js, TypeScript/Express, Electron, and Groq/Gemini AI pipelines—replacing manual Excel workflows with role-based audit systems and shipping production prototypes with 1.00-grade SDLC rigor.",
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
    primaryMetricLabel: "15–40s A/B-Tested Paid Social Reels",
    problem:
      "International D2C paid acquisition on Meta, TikTok, and Pinterest requires rapid creative iteration across multiple marketing angles to prevent ad fatigue and capture sound-off mobile scrollers.",
    execution:
      "Engineered beat-synced 9:16 video ads across Skeptic UGC, Competitor Switchers, EOFY Campaign Launches, Father's Day promos, and Viral Meme Reels. Applied mobile UI/UX typography hierarchy, Foley sound design, and dynamic review/award badge overlays.",
    impact:
      "Delivered a complete library of high-retention 9:16 paid and organic video assets aligned directly with brand stakeholders in Germany.",
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
    clientOrContext: "USTP Startup Incubation · Open Source",
    locationTag: "REACT + ELECTRON + GROQ AI",
    role: "Creator & Project Lead (Final Grade: 1.00)",
    period: "2026",
    categories: ["engineering", "va", "github", "leadership"],
    primaryMetric: "4.0s VAD",
    primaryMetricLabel: "Live VA Call Coaching & 69/100 Review",
    problem:
      "Filipino Virtual Assistants taking live international client calls (US/UK/AU) on Meet or Zoom work solo without a supervisor—most call tools only analyze recordings after the call has already gone wrong.",
    execution:
      "Built a dual-channel React (Vite) web app, Electron desktop shell, and Express/TypeScript backend. Uses an STT-independent Web Audio AnalyserNode amplitude VAD (4s silence, 8s debounce) to trigger 'The Lifeline' (3 live Smart Replies via Groq llama-3.1-8b-instant) alongside dual-channel transcription and post-call pattern scoring ('The Review' via Gemini Flash).",
    impact:
      "Directly solves remote VA call confidence and client retention—shipping as both a web app and Windows/macOS desktop build with a 60s Remotion product reveal.",
    stack: [
      "React (Vite)",
      "TypeScript / Express",
      "Electron",
      "Web Audio VAD",
      "Groq LLaMA 3.1 & Whisper",
      "Gemini Flash",
    ],
    previewMedia: {
      type: "image",
      src: "/husai/screen-solution.png",
      badge: "HUSAI // BUILT FOR REMOTE VAs",
      highlight: "4.0s Silence VAD -> 3 Instant Smart Replies",
      sublabel: "Localhost :5173 UI + 60s Remotion Reveal",
    },
    links: {
      repo: "https://github.com/Birky-andrie/HusAI",
      live: "https://hus-ai-five.vercel.app",
    },
  },
  {
    id: "remote-va-ops",
    index: "03",
    code: "VA-01",
    title: "Global Remote Operations & SMM Growth",
    clientOrContext: "Alpha VA Certified · Freelance Movement · Clothing Brand",
    locationTag: "REMOTE // GLOBAL CLIENTS",
    role: "Technical Virtual Assistant, SMM & Creative Director",
    period: "JAN 2023 – PRESENT",
    categories: ["va", "creative"],
    primaryMetric: "3+ Yrs",
    primaryMetricLabel: "Remote VA, SMM & Brand Direction",
    problem:
      "Founders and growing brands get bogged down by fragmented content calendars, manual administrative tasks, inbox/file chaos, and inconsistent social media execution.",
    execution:
      "Executed end-to-end social media management (content scheduling, trend/hashtag optimization, dialogue scripting), clothing brand creative direction, and executive virtual assistance across Google Workspace, ClickUp, and MS Office—augmented by AI workflows (ChatGPT, Claude, Gemini).",
    impact:
      "Provided reliable, culturally adaptable remote operations and multi-platform social growth for global clients while maintaining a 1.00 academic leadership track.",
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
  {
    id: "pacs-builders",
    index: "04",
    code: "CS-02",
    title: "Pacs Builders — Material Audit Engine",
    clientOrContext: "Pacs Builders (Engineering Firm)",
    locationTag: "CDO, PH // WORKFLOW AUTOMATION",
    role: "Contract Programmer — Frontend & Workflow Automation",
    period: "AUG 2025 – DEC 2025",
    categories: ["engineering", "va"],
    primaryMetric: "< 5s",
    primaryMetricLabel: "Complex Audit Report Generation",
    problem:
      "Material receipts, site usage, and inventory movements were tracked across fragmented manual Excel sheets, causing human entry errors and slow audit reconciliation.",
    execution:
      "Built the frontend interface and workflow automation for a centralized web platform with role-based permissions (Admin, Auditor, Staff), automated transaction trails, and optimized reporting queries.",
    impact:
      "Eliminated manual spreadsheet reconciliation for non-technical staff and cut data-heavy audit and inventory report generation from ~20 minutes to under 5 seconds.",
    stack: ["Python", "HTML/CSS", "Role-Based Auth", "Excel Migration", "Audit Reporting"],
    previewMedia: {
      type: "telemetry",
      badge: "EXCEL -> WEB AUTOMATION // < 5.0S",
      highlight: "1.84s Avg Query vs. ~20m Manual Excel",
      sublabel: "Admin · Auditor · Staff Permission Trails",
    },
  },
  {
    id: "trailblazer-startup-lab",
    index: "05",
    code: "CS-03",
    title: "Trailblazer Startup Lab — Incubation Lead",
    clientOrContext: "Trailblazer Startup Lab, USTP",
    locationTag: "USTP CDO // FULL SDLC",
    role: "Project Lead",
    period: "JUN 2026 – AUG 2026",
    categories: ["leadership", "va"],
    primaryMetric: "1.00",
    primaryMetricLabel: "Final Grade (Highest Distinction)",
    problem:
      "Translating an early-stage startup concept into a documented, testable, and deployable software product under strict academic and incubation milestones.",
    execution:
      "Led technical scoping, system architecture documentation, ClickUp task prioritization, and end-to-end SDLC coordination from initial design specs to final deployment.",
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
    index: "06",
    code: "GH-02",
    title: "SIAM_CS3B — Real-Time App & QA Suite",
    clientOrContext: "GitHub Open Source · Render",
    locationTag: "NODE.JS + SOCKET.IO + QA",
    role: "Systems & QA Contributor",
    period: "2026",
    categories: ["engineering", "leadership", "github"],
    primaryMetric: "100%",
    primaryMetricLabel: "SDLC & QA Traceability",
    problem:
      "Early-stage web builds often ship without real-time architecture, CI/CD discipline, or formal QA defect tracking.",
    execution:
      "Implemented a Node.js, Express, and Socket.IO client-server application paired with structured Agile sprint backlogs, CI/CD pipeline configs, QA testing defect logs, and risk registers.",
    impact:
      "Demonstrates production-minded engineering and documentation rigor—linking live Socket.IO features with formal verification and release logs.",
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
    index: "07",
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
