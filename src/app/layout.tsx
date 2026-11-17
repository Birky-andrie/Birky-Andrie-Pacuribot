import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://birky-pacuribot.vercel.app"
  ),
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
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)] antialiased">
        {children}
      </body>
    </html>
  );
}
