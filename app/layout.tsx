// app/layout.tsx
import type { Metadata } from "next";
import { Providers } from "./providers";
import { Inter, Karla } from "next/font/google";
import "./globals.css";

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

{/* Weglot: Subdirectory + Client-Fix gegen Hydration-Reset */}
<script
  dangerouslySetInnerHTML={{
    __html: `
      (function () {
        // 0) Sprache aus URL-Präfix ableiten und sofort setzen (vor Hydration)
        try {
          var prefix = (location.pathname.split('/')[1] || '').toLowerCase();
          var supported = { en:1, de:1, fr:1 };
          var pathLang = supported[prefix] ? prefix : 'en';
          document.documentElement.setAttribute('lang', pathLang);
          localStorage.setItem('weglot_language', pathLang);
          document.cookie = 'weglot_language=' + pathLang + '; path=/; max-age=' + (365*24*60*60);
        } catch (e) {}

        // 1) Weglot-Konfiguration
        window.WeglotConfig = {
          api_key: "${process.env.WEGLOT_API_KEY ?? ""}",
          wait_transition: true,
          auto_switch: false,
          // Präferenz persistent halten
          persistence: 'localstorage',
          save_preference: true,
          // WICHTIG: React-Root beobachten → re-translate nach Hydration/DOM-Updates
          dynamic: '#__next'
        };

        // 2) Weglot-Script laden
        function loadWeglot() {
          var s = document.createElement('script');
          s.type = 'text/javascript';
          s.async = true;
          s.src = 'https://cdn.weglot.com/weglot.min.js';
          s.onload = function () {
            try {
              if (window.Weglot && window.Weglot.initialize) {
                window.Weglot.initialize(window.WeglotConfig);
              }

              // 3) Gespeicherte Sprache wiederherstellen
              window.addEventListener('weglot:initialized', function () {
                try {
                  var stored = localStorage.getItem('weglot_language') || 'en';
                  var current = window.Weglot.getCurrentLang && window.Weglot.getCurrentLang();
                  if (stored && current && stored !== current && window.Weglot.switchTo) {
                    window.Weglot.switchTo(stored);
                  }
                } catch (e) { console.warn('Weglot restore lang failed', e); }
              });

              // 4) Sicherheitsnetz: bei Komplett-Ladeende einmal refresh
              var reapply = function () {
                try { window.Weglot.refresh && window.Weglot.refresh(); } catch(e){}
              };
              document.addEventListener('readystatechange', function(){
                if (document.readyState === 'complete') { reapply(); }
              });

              // 5) Sprachwechsel persistent halten
              window.addEventListener('weglot:languagechanged', function (e) {
                try {
                  var lang = (e && e.detail) || (window.Weglot.getCurrentLang && window.Weglot.getCurrentLang());
                  if (lang) {
                    localStorage.setItem('weglot_language', lang);
                    document.cookie = 'weglot_language=' + lang + '; path=/; max-age=' + (365*24*60*60);
                  }
                } catch (e) { console.warn('Weglot store lang failed', e); }
              });
            } catch (e) { console.warn('Weglot init error', e); }
          };
          document.head.appendChild(s);
        }

        // 3) Möglichst früh nach DOM bereit laden
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', loadWeglot);
        } else {
          loadWeglot();
        }
      })();
    `,
  }}
/>

      </head>
      <body
        className={`${karla.variable} ${inter.variable} bg-n-7 font-sans text-[1rem] leading-6 -tracking-[.01em] text-n-1 antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
