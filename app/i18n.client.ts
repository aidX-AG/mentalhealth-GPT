"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

// NAMESPACES, die du hast (kannst du erweitern, wenn nötig)
const ns = [
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
];

if (!i18n.isInitialized) {
  i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      // Sprachen: erstmal nur en. Wenn de bereit ist: ["en","de"]
      supportedLngs: ["en"],
      fallbackLng: "en",
      defaultNS: "common",
      ns,

      // JSONs werden aus /public/locales/... geladen
      backend: {
        loadPath: "/locales/{{lng}}/{{ns}}.json",
      },

      detection: {
        // Reihenfolge: URL ?lng=, Cookie, localStorage, Browser
        order: ["querystring", "cookie", "localStorage", "navigator"],
        lookupQuerystring: "lng",
        lookupCookie: "lng",
        caches: ["localStorage", "cookie"],
      },

      interpolation: { escapeValue: false },
      debug: process.env.NODE_ENV === "development",
      react: { useSuspense: true },
    });
}

export default i18n;
