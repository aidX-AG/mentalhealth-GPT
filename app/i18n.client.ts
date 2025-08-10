"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

// ---- Deine Namespaces (unverändert) ----
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
    .use(HttpBackend)                // lädt JSONs via HTTP
    .use(LanguageDetector)           // erkennt Sprache (Query, Cookie, localStorage, Browser)
    .use(initReactI18next)           // bindet an react-i18next
    .init({
      // ⬇️ WELCHE Sprachen sind erlaubt:
      supportedLngs: ["de", "fr", "en"],

      // ⬇️ Fallback, wenn erkannte Sprache/Datei fehlt (sicher auf EN lassen)
      //    Wenn du *Deutsch als Standard* willst, setze hier "de".
      fallbackLng: "en",

      // ⬇️ NUR Basis-Sprachen nutzen (de statt de-CH, fr statt fr-CH)
      load: "languageOnly",
      nonExplicitSupportedLngs: true,
      lowerCaseLng: true,            // "DE" -> "de"
      cleanCode: true,               // "de-CH" -> "de"

      defaultNS: "common",
      ns,

      // ⬇️ Wo liegen die JSON-Dateien
      backend: {
        loadPath: "/locales/{{lng}}/{{ns}}.json",
      },

      // ⬇️ Reihenfolge der Erkennung – Query hat oberste Priorität
      detection: {
        order: ["querystring", "localStorage", "cookie", "navigator"],
        lookupQuerystring: "lng",    // ?lng=de
        lookupCookie: "lng",
        caches: ["localStorage", "cookie"],  // gemerkte Wahl speichern
      },

      interpolation: { escapeValue: false },
      // zum Debuggen kurz aktivieren, danach wieder aus:
      // debug: process.env.NODE_ENV === "development",
      react: { useSuspense: true },
    });
}

export default i18n;
