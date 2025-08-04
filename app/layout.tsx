import type { Metadata } from "next";
import { Inter, Karla } from "next/font/google";
import "./globals.css";
import WeglotStatic from "../components/WeglotStatic";

const inter = Inter({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const karla = Karla({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-karla",
});

export const metadata: Metadata = {
  title: "mentalhealthGPT",
  description:
    "Expert AI for mental health – secure, private, and scientifically validated",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="invisible" // 🚫 wird durch WeglotStatic entfernt
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content={metadata.description?.toString() ?? ""}
        />
        <meta
          property="og:title"
          content={metadata.title?.toString() ?? ""}
        />
        <meta
          property="og:description"
          content={metadata.description?.toString() ?? ""}
        />
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:url" content="https://mentalhealth-gpt.ch" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="theme-color" content="#ffffff" />
        <link
          rel="alternate"
          hrefLang="en"
          href="https://mentalhealth-gpt.ch"
        />
        <link
          rel="alternate"
          hrefLang="de"
          href="https://de.mentalhealth-gpt.ch"
        />
        <link
          rel="alternate"
          hrefLang="fr"
          href="https://fr.mentalhealth-gpt.ch"
        />
      </head>
      <body
        className={`${karla.variable} ${inter.variable} bg-n-7 font-sans text-[1rem] leading-6 -tracking-[.01em] text-n-7 antialiased md:bg-n-1 dark:text-n-1 dark:md:bg-n-6`}
      >
        <WeglotStatic />
        {children}
      </body>
    </html>
  );
}
