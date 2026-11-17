# Birky Andrie L. Pacuribot — Portfolio

Brutalist-minimalist, Swiss-grid editorial portfolio built with **Next.js 15 (App Router)**, **React 19**, **Tailwind CSS v4**, and **TypeScript**.

## Architecture & Features

- **Swiss-Grid Editorial System:** High-contrast architectural paper palette (`#F7F7F4` / `#EFEFEA` / `#111111` / `#D9381E` signal accent), `1px` hairline borders, `Space Grotesk` + `JetBrains Mono` (`tabular-nums`).
- **Live Timezone & `⌘K` Command Palette:** Real-time `PHT (UTC+8)` clock and keyboard-driven navigation index (`Ctrl+K` / `⌘K`).
- **Interactive Proof Lab:**
  - `01 // HusAI Call Coach` — Live 4.0s pause detector and Groq LLaMA 3.1 response angle simulator.
  - `02 // Pacs Builders Audit Engine` — Legacy Excel (`~20 min`) vs. centralized RBAC web app (`< 5s`) benchmark.
  - `03 // Hackerlily 9:16 Ad Anatomy` — Timestamped direct-response video breakdown (`00–03s Hook` through `25–35s CTA`).
- **Vercel Production Routes:**
  - Dynamic Edge OpenGraph card (`src/app/opengraph-image.tsx`)
  - Custom Swiss monogram SVG favicon (`src/app/icon.svg`)
  - Serverless Project Brief API (`src/app/api/contact/route.ts`) with optional `RESEND_API_KEY` integration
  - `sitemap.xml` and `robots.txt` (`src/app/sitemap.ts`, `src/app/robots.ts`)

## Local Development

```bash
npm install
npm run dev
```

## Vercel Deployment

1. Import this repository (`Birky-andrie/Birky-Andrie-Pacuribot`) in [Vercel](https://vercel.com/new).
2. Optional Environment Variables:
   - `NEXT_PUBLIC_SITE_URL`: Your production URL (e.g., `https://birky-pacuribot.vercel.app`)
   - `RESEND_API_KEY`: Optional Resend API key for direct server-side email delivery from `/api/contact`
