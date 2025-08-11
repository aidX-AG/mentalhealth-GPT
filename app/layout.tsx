import type { Metadata } from "next";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Providers } from "./providers";
import { Inter, Karla } from "next/font/google";
import "./globals.css";
import I18nProvider from "./i18n-provider";

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

// Client-only laden (nutzt navigator.*) → kein SSR
const LanguagePrompt = dynamic(() => import("@/components/I18n/LanguagePrompt"), { ssr: false });

export const metadata: Metadata = {
  title: "mentalhealthGPT",
  description: "Expert AI for mental health – secure, private, and scientifically validated",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="description" content="Expert AI for mental health – secure, private, and scientifically validated" />
        <meta property="og:title" content="mentalhealthGPT" />
        <meta property="og:description" content="Expert AI for mental health – secure, private, and scientifically validated" />
        <meta property="og:image" content="https://www.mentalhealth-gpt.ch/images/logo-960w.webp" />
        <meta property="og:image:width" content="960" />
        <meta property="og:image:height" content="960" />
        <meta property="og:image:type" content="image/webp" />
        <meta property="og:url" content="https://www.mentalhealth-gpt.ch" />
        <meta property="og:type" content="website" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>

      <body className={`${karla.variable} ${inter.variable} bg-n-1 dark:bg-n-7 font-sans text-[1rem] leading-6 -tracking-[.01em] text-n-7 dark:text-n-1`}>
        {/* Suspense verhindert Flash-of-English, bis i18n-JSONs geladen sind */}
        <Suspense fallback={<div className="p-6 text-center opacity-70">Loading…</div>}>
          <I18nProvider>
            <Providers>{children}</Providers>
          </I18nProvider>
          <LanguagePrompt />
        </Suspense>
      </body>
    </html>
  );
}
