import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { PROFILE, SERVICES } from "@/data/portfolio";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://birky-pacuribot.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Birky Andrie L. Pacuribot — CS Engineer & Creative Technologist",
  description:
    "Custom web & workflow engineering (<5s audit reporting), AI rapid prototyping (HusAI), direct-response video ad production (20–40s A/B cuts), and technical project leadership.",
  openGraph: {
    title: "Birky Andrie L. Pacuribot — CS Engineer & Creative Technologist",
    description:
      "Fast internal web systems and direct-response video assets that drive measurable revenue.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Birky Andrie L. Pacuribot — CS Engineer & Creative Technologist",
    description:
      "Fast internal web systems and direct-response video assets that drive measurable revenue.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        name: PROFILE.name,
        url: siteUrl,
        email: PROFILE.email,
        telephone: PROFILE.phone,
        jobTitle: "CS Engineer & Creative Technologist",
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: "University of Science and Technology of Southern Philippines (USTP CDO)",
        },
        sameAs: [PROFILE.github],
      },
      {
        "@type": "ProfessionalService",
        name: `${PROFILE.name} — Engineering & Direct-Response Creative`,
        url: siteUrl,
        areaServed: "Worldwide",
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Engineering & Creative Services",
          itemListElement: SERVICES.map((s) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: s.title,
              description: s.outcome,
            },
          })),
        },
      },
    ],
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)] antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
