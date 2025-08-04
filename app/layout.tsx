import type { Metadata } from "next";
import { Providers } from "./providers";
import { Inter, Karla } from "next/font/google";
import "./globals.css";

// Font-Konfiguration
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

// Metadaten
export const metadata: Metadata = {
  title: "mentalhealthGPT",
  description: "Expert AI for mental health – secure, private, and scientifically validated",
};

// Weglot-Typen für TypeScript
declare global {
  interface Window {
    Weglot?: {
      initialize: (config: {
        api_key: string;
        auto_switch?: boolean;
        dynamic_loading?: boolean;
        cache?: boolean;
        exclude_blocks?: { css: string }[];
      }) => void;
      on?: (event: string, callback: () => void) => void;
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Basis-Metadaten */}
        <meta charSet="utf-8" />
        <meta name="description" content={metadata.description?.toString() ?? ""} />
        
        {/* OG-Tags */}
        <meta property="og:title" content={metadata.title?.toString() ?? ""} />
        <meta property="og:description" content={metadata.description?.toString() ?? ""} />
        <meta property="og:image" content="/Logo_V_4_0.png" />
        <meta property="og:url" content="https://www.mentalhealth-gpt.ch" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="theme-color" content="#ffffff" />

        {/* hreflang Links */}
        <link rel="alternate" hrefLang="en" href="https://mentalhealth-gpt.ch" />
        <link rel="alternate" hrefLang="de" href="https://de.mentalhealth-gpt.ch" />
        <link rel="alternate" hrefLang="fr" href="https://fr.mentalhealth-gpt.ch" />

        {/* Weglot-Integration mit erweiterten Einstellungen */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.weglotInit = function() {
                if (typeof Weglot !== 'undefined') {
                  Weglot.initialize({
                    api_key: "wg_d9cb54c80d40ded6bb70278dc06ee7f97",
                    auto_switch: false,
                    dynamic_loading: true,
                    cache: false,
                    exclude_blocks: [{ css: ".no-translate" }],
                    custom_domain: {
                      "de": "de.mentalhealth-gpt.ch",
                      "fr": "fr.mentalhealth-gpt.ch",
                      "en": "mentalhealth-gpt.ch"
                    }
                  });
                  
                  // Verhindert Flash von Originaltext
                  Weglot.on('languageChanged', function() {
                    document.documentElement.style.visibility = 'visible';
                  });
                  
                  document.documentElement.style.visibility = 'hidden';
                }
              };
              document.addEventListener('DOMContentLoaded', window.weglotInit);
            `
          }}
        />
        <script src="https://cdn.weglot.com/weglot.min.js" async />
      </head>
      <body
        className={`${karla.variable} ${inter.variable} bg-n-7 font-sans text-[1rem] leading-6 -tracking-[.01em] text-n-7 antialiased md:bg-n-1 dark:text-n-1 dark:md:bg-n-6`}
        style={{ visibility: 'hidden' }} // Initial verstecken
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
