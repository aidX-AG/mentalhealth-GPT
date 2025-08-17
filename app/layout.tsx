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

        {/* ✅ NEU: Frühzeitiger Redirect auf Subdirectory, bevor React hydriert */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  // 1) Letzte Sprache ans <html>-Tag schreiben (kosmetisch)
                  var stored = localStorage.getItem('weglot_language');
                  if (stored && stored !== 'en') {
                    document.documentElement.lang = stored;
                  }

                  // 2) Protected Pfade NICHT umleiten (Assets, APIs, etc.)
                  var path = location.pathname;
                  var protectedPrefixes = [
                    '/api/', '/_next/', '/favicon', '/images/', '/sitemap'
                  ];
                  var isProtected = protectedPrefixes.some(function (p) {
                    return path.startsWith(p);
                  });

                  // 3) Falls Sprache ≠ en und wir noch nicht auf /{lang} sind → harte Navigation
                  if (stored && stored !== 'en' && !isProtected) {
                    var targetPrefix = '/' + stored;
                    var alreadyOnLang = (path === targetPrefix) || path.startsWith(targetPrefix + '/');
                    if (!alreadyOnLang) {
                      var rest = path + location.search + location.hash;
                      location.replace(targetPrefix + rest.replace(/^\\//, '/'));
                    }
                  }
                } catch (e) {}
              })();
            `,
          }}
        />

        {/* Weglot – NACH Hydration laden + Auswahl merken/anwenden */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                // 1) Konfiguration
                window.WeglotConfig = {
                  api_key: "${process.env.WEGLOT_API_KEY ?? ""}",
                  wait_transition: true,
                  auto_switch: false
                };

                // 2) Script erst nach vollständigem Seiten-Load laden
                window.addEventListener('load', function () {
                  var s = document.createElement('script');
                  s.type = 'text/javascript';
                  s.async = true;
                  s.src = 'https://cdn.weglot.com/weglot.min.js';
                  s.onload = function () {
                    try {
                      if (window.Weglot && window.Weglot.initialize) {
                        window.Weglot.initialize(window.WeglotConfig);
                      }

                      // 3) Letzte Sprache wiederherstellen
                      window.addEventListener('weglot:initialized', function () {
                        try {
                          var stored = localStorage.getItem('weglot_language');
                          var current = window.Weglot.getCurrentLang && window.Weglot.getCurrentLang();
                          if (stored && stored !== current && window.Weglot.switchTo) {
                            window.Weglot.switchTo(stored);
                          }
                        } catch (e) { console.warn('Weglot restore lang failed', e); }
                      });

                      // 4) Sprachänderung speichern
                      window.addEventListener('weglot:languagechanged', function (e) {
                        try {
                          var lang = (e && e.detail) || (window.Weglot.getCurrentLang && window.Weglot.getCurrentLang());
                          if (lang) localStorage.setItem('weglot_language', lang);
                        } catch (e) { console.warn('Weglot store lang failed', e); }
                      });
                    } catch (e) { console.warn('Weglot init error', e); }
                  };
                  document.head.appendChild(s);
                });
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
