"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

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
      // <-- HIER aktivieren wir de & fr
      supportedLngs: ["en", "de", "fr"],
      fallbackLng: "en",
      defaultNS: "common",
      ns,

      backend: {
        loadPath: "/locales/{{lng}}/{{ns}}.json",
      },

      detection: {
        // Behalte deine Reihenfolge & 'lng' Query-Param bei
        order: ["querystring", "cookie", "localStorage", "navigator"],
        lookupQuerystring: "lng",   // ?lng=de
        lookupCookie: "lng",
        caches: ["localStorage", "cookie"],
      },

      interpolation: { escapeValue: false },
      debug: process.env.NODE_ENV === "development",
      react: { useSuspense: true },
    });
}

export default i18n;
