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
    .use(HttpBackend)        // JSON via HTTP
    .use(LanguageDetector)   // Sprache erkennen
    .use(initReactI18next)   // React-Bindung
    .init({
      // Erlaubte Sprachen
      supportedLngs: ["de", "fr", "en"],

      // Standard-Fallback (lass "en", oder stell auf "de", wenn du willst)
      fallbackLng: "en",

      // WICHTIG: Normalisierung von de-CH -> de, FR -> fr, etc.
      load: "languageOnly",
      nonExplicitSupportedLngs: true,
      lowerCaseLng: true,
      cleanCode: true,

      defaultNS: "common",
      ns,

      backend: {
        loadPath: "/locales/{{lng}}/{{ns}}.json",
      },

      // Querystring hat Vorrang
      detection: {
        order: ["querystring", "localStorage", "cookie", "navigator"],
        lookupQuerystring: "lng", // ?lng=de
        lookupCookie: "lng",
        caches: ["localStorage", "cookie"],
      },

      interpolation: { escapeValue: false },
      react: { useSuspense: true },
      // debug: process.env.NODE_ENV === "development",
    })
    .then(() => {
      // URL-Parameter hart durchsetzen (überstimmt alte Caches sicher)
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const raw = params.get("lng");
        if (raw) {
          const lang = raw.toLowerCase().replace("_", "-").split("-")[0]; // "de-CH" -> "de"
          if (["de", "fr", "en"].includes(lang)) {
            i18n.changeLanguage(lang);
            try {
              localStorage.setItem("i18nextLng", lang);
            } catch {}
            document.cookie = `lng=${lang}; Max-Age=31536000; path=/`;
          }
        }
      }
    });
}

export default i18n;
