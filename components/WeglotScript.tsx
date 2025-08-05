"use client";

import { useEffect } from "react";

// ✅ Globale Typen für Weglot
declare global {
  interface Window {
    Weglot?: {
      initialize: (config: {
        api_key: string;
        auto_switch?: boolean;
        dynamic_loading?: boolean;
        cache?: boolean;
        custom_domain?: Record<string, string>;
        exclude_blocks?: { css: string }[];
      }) => void;
      on?: (event: string, callback: () => void) => void;
      switchTo?: (lang: string) => void;
    };
  }
}

export default function WeglotStatic() {
  useEffect(() => {
    const initWeglot = () => {
      if (!window.Weglot) return;

      window.Weglot.initialize({
        api_key: "wg_d9cb54c80d40ded6bb70278dc06ee7f97",
        auto_switch: false,
        dynamic_loading: true,
        cache: false,
        exclude_blocks: [{ css: ".no-translate" }],
        custom_domain: {
          en: "mentalhealth-gpt.ch",
          de: "de.mentalhealth-gpt.ch",
          fr: "fr.mentalhealth-gpt.ch",
        },
      });

      window.Weglot.on?.("languageChanged", () => {
        document.documentElement.classList.remove("invisible");
      });
    };

    // ⏳ Script laden, wenn nicht bereits da
    if (typeof window.Weglot === "undefined") {
      const script = document.createElement("script");
      script.src = "https://cdn.weglot.com/weglot.min.js";
      script.async = true;
      script.onload = initWeglot;
      script.onerror = () => {
        console.error("Weglot failed to load");
        document.documentElement.classList.remove("invisible");
      };
      document.head.appendChild(script);
    } else {
      initWeglot();
    }

    // 🚫 Seite verstecken bis Weglot geladen ist
    document.documentElement.classList.add("invisible");

    // ⏱ Fallback, falls Weglot hängt
    const fallback = setTimeout(() => {
      document.documentElement.classList.remove("invisible");
    }, 4000);

    // 🌐 Sprache über Subdomain erzwingen
    const subdomain = window.location.hostname.split(".")[0];
    if (["de", "fr"].includes(subdomain)) {
      setTimeout(() => {
        window.Weglot?.switchTo?.(subdomain);
      }, 1000);
    }

    return () => {
      clearTimeout(fallback);
      document.head.querySelector('script[src*="weglot"]')?.remove();
    };
  }, []);

  return null;
}
