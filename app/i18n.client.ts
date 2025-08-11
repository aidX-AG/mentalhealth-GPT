"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

// Namespaces zentral
const namespaces = [
  "common",
  "pricing",
  "checkout",
  "applications",
  "audio-transcription",
  "documentation-reports",
  "diagnosis-support",
  "generation-socials-post",
  "home",
  "sign-in",
  "supervision-training",
  "thanks",
  "therapy-support",
  "updates-and-faq",
  "video-analysis",
] as const;

export type I18nNamespaces = (typeof namespaces)[number];

if (!i18n.isInitialized) {
  i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      // Sprachen & Fallback
      supportedLngs: ["de", "fr", "en"],
      fallbackLng: "en",

      // Ländercodes normalisieren (de-CH -> de)
      load: "languageOnly",
      nonExplicitSupportedLngs: true,
      lowerCaseLng: true,
      cleanCode: true,

      // Namespaces
      defaultNS: "common",
      ns: namespaces,
      partialBundledLanguages: true,

      // Dateien laden
      backend: {
        loadPath: "/locales/{{lng}}/{{ns}}.json",
        requestOptions: { cache: "no-store" }, // immer frisch
      },

      // Erkennung: Query > Cookie/LS > Browser
      detection: {
        order: ["querystring", "cookie", "localStorage", "navigator"],
        lookupQuerystring: "lng",
        lookupCookie: "i18nextLng",
        lookupLocalStorage: "i18nextLng",
        caches: ["localStorage", "cookie"],
        convertDetectedLanguage: (lng) => lng.toLowerCase().split("-")[0],
      },

      // React
      interpolation: { escapeValue: false },
      react: {
        useSuspense: true,            // Suspense statt Fallback-EN rendern
        bindI18n: "languageChanged loaded",
        bindI18nStore: "added removed",
      },

      debug: process.env.NODE_ENV === "development",
    })
    .then(() => {
      // Query-Param hart durchsetzen (?lng=de|fr|en)
      if (typeof window !== "undefined") {
        const raw = new URLSearchParams(window.location.search).get("lng");
        if (raw) {
          const lang = raw.toLowerCase().replace("_", "-").split("-")[0];
          if (["de", "fr", "en"].includes(lang)) {
            i18n.changeLanguage(lang);
            try { localStorage.setItem("i18nextLng", lang); } catch {}
            document.cookie = `i18nextLng=${lang}; Max-Age=31536000; path=/`;
          }
        }
      }
    })
    .catch((err) => {
      if (process.env.NODE_ENV === "development") {
        console.error("i18n init failed:", err);
      }
    });
}

export default i18n;
