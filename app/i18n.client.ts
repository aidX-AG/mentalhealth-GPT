"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";

const namespaces = [
  "common","pricing","checkout","applications","audio-transcription",
  "documentation-reports","diagnosis-support","generation-socials-post",
  "home","sign-in","supervision-training","thanks","therapy-support",
  "updates-and-faq","video-analysis",
] as const;

if (!i18n.isInitialized) {
  i18n
    .use(HttpBackend)
    .use(initReactI18next)
    .init({
      // 👉 HART auf Deutsch
      lng: "de",
      fallbackLng: "de",
      supportedLngs: ["de", "fr", "en"],

      // 👉 explizit nur Basis-Sprachen (de statt de-CH)
      load: "languageOnly",
      cleanCode: true,
      nonExplicitSupportedLngs: true,
      lowerCaseLng: true,

      defaultNS: "common",
      ns: namespaces,
      partialBundledLanguages: true,

      backend: {
        loadPath: "/locales/{{lng}}/{{ns}}.json",
        requestOptions: { cache: "no-store" }, // zieh frisch
      },

      // 👉 Detector AUS für den Test
      detection: undefined as any,

      interpolation: { escapeValue: false },
      react: { useSuspense: true },
      // debug: true,
    });
}

export default i18n;
