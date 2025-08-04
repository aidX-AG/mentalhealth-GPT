import type { Metadata } from "next";
import { Providers } from "./providers";
import { Inter, Karla } from "next/font/google";
import "./globals.css";
import WeglotScript from "../components/WeglotScript"; // ⬅️ Client-Komponente

const inter = Inter({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  display: "block",
  variable: "--font-inter",
});

const karla = Karla({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "block",
  variable: "--font-karla",
});

export const metadata: Metadata = {
  title: "mentalhealthGPT",
  description: "Expert AI for mental health – secure, private, and scientifically validated",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* 🔍 SEO + OG Metadata */}
        <meta name="description" content={metadata.description ?? ""} />
        <meta property="og:title" content={metadata.title ?? ""} />
        <meta property="og:description" content={metadata.description ?? ""} />
        <meta property="og:image" content="/Logo_V_4_0.png" />
        <meta property="og:url" content="https://www.mentalhealth-gpt.ch" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* 🌍 hreflang Links */}
        <link rel="alternate" hrefLang="en" href="https://mentalhealth-gpt.ch" />
        <link rel="alternate" hrefLang="de" href="https://de.mentalhealth-gpt.ch" />
        <link rel="alternate" hrefLang="fr" href="https://fr.mentalhealth-gpt.ch" />
      </head>
      <body
        className={`${karla.variable} ${inter.variable} bg-n-7 font-sans text-[1rem] leading-6 -tracking-[.01em] text-n-7 antialiased md:bg-n-1 dark:text-n-1 dark:md:bg-n-6`}
      >
        <WeglotScript /> {/* 🌐 Sprache: Initialisierung nach Hydration */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
