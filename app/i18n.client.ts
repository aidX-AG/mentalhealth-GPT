"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

const namespaces = [
  "common","pricing","checkout","applications","audio-transcription",
  "documentation-reports","diagnosis-support","generation-socials-post",
  "home","sign-in","supervision-training","thanks","therapy-support",
  "updates-and-faq","video-analysis",
] as const;

if (!i18n.isInitialized) {
  i18n
    .use(HttpBackend)
    .use(LanguageDetector)              // ✅ Browser-Detektion
    .use(initReactI18next)
    .init({
      // Keine feste Sprache — Browser/Storage entscheidet
      fallbackLng: "de",
      supportedLngs: ["de","fr","en"],

      // de-CH -> de, saubere Codes
      load: "languageOnly",
      cleanCode: true,
      nonExplicitSupportedLngs: true,
      lowerCaseLng: true,

      defaultNS: "common",
      ns: namespaces,
      partialBundledLanguages: true,

      backend: {
        loadPath: "/locales/{{lng}}/{{ns}}.json",
        requestOptions: {}, // Caching regelt Nginx (ETag/Cache-Control)
      },

      detection: {
        order: ["localStorage","cookie","htmlTag","navigator","querystring"],
        caches: ["localStorage","cookie"],
        lookupQuerystring: "lang",
        cookieMinutes: 60 * 24 * 30,
      },

      interpolation: { escapeValue: false },
      react: { useSuspense: true },
      // debug: true,
    })
    .then(() => {
      // 🔹 WICHTIG: Überall wird direkt i18next.t(...) genutzt → Namespaces upfront laden
      i18n.loadNamespaces([...namespaces]);
    });

  // <html lang="..."> aktuell halten
  i18n.on("languageChanged", (lng) => {
    if (typeof document !== "undefined") {
      const base = (lng || "de").split("-")[0].toLowerCase();
      document.documentElement.lang = base;
    }
  });

  // Für DevTools-Tests (Konsole): i18next.language / i18next.changeLanguage('fr')
  if (typeof window !== "undefined") {
    (window as any).i18next = i18n;
  }
}

export default i18n;
