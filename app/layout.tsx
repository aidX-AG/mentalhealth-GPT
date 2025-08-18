// app/layout.tsx
import type { Metadata } from "next";
import { Providers } from "./providers";
import { Inter, Karla } from "next/font/google";
import "./globals.css";
import WeglotRefresh from "./WeglotRefresh";
import { Suspense } from "react";

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
  description:
    "Expert AI for mental health – secure, private, and scientifically validated",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* SEO + OG Metadata */}
        <meta
          name="description"
          content="Expert AI for mental health – secure, private, and scientifically validated"
        />
        <meta property="og:title" content="mentalhealthGPT" />
        <meta
          property="og:description"
          content="Expert AI for mental health – secure, private, and scientifically validated"
        />
        <meta property="og:image" content="/images/logo.webp" />
        <meta property="og:url" content="https://www.mentalhealth-gpt.ch" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Weglot – Initialisierung + Laden des Scripts */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  // Sprache aus URL oder LocalStorage ableiten
                  var seg = (location.pathname.split('/')[1]||'').toLowerCase();
                  var stored = null;
                  try { stored = localStorage.getItem('weglot_language'); } catch(e){}
                  var lang = (seg==='de'||seg==='fr') ? seg : (stored || 'en');
                  if (lang) document.documentElement.lang = lang;

                  // Weglot-Konfiguration
                  window.WeglotConfig = {
                    api_key: "${process.env.WEGLOT_API_KEY ?? ""}",
                    auto_switch: false,
                    dynamic: { enabled: true, observe: true, refreshOnLoad: true },
                    exclude_selectors: ['.notranslate']
                  };

                  // Weglot-Script laden (ohne async, damit früh greift)
                  var s = document.createElement('script');
                  s.type = 'text/javascript';
                  s.src = 'https://cdn.weglot.com/weglot.min.js';
                  s.onload = function () {
                    try {
                      // Sprache aus URL erzwingen (falls vorhanden)
                      if (seg === 'de' || seg === 'fr') {
                        if (window.Weglot && window.Weglot.switchTo) {
                          window.Weglot.switchTo(seg);
                        }
                        try { localStorage.setItem('weglot_language', seg); } catch(e){}
                      }
                    } catch (e) {}
                  };
                  document.head.appendChild(s);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${karla.variable} ${inter.variable} bg-n-7 font-sans text-[1rem] leading-6 -tracking-[.01em] text-n-1 antialiased`}
      >
        <Suspense fallback={null}>
          <WeglotRefresh />
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  );
}
