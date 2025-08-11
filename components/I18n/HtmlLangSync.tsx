"use client";

import { useEffect } from "react";
import i18n from "@/app/i18n.client";

export default function HtmlLangSync() {
  useEffect(() => {
    // beim Start setzen
    const apply = (lng: string) => {
      const base = (lng || "en").toLowerCase().split("-")[0];
      document.documentElement.lang = base;
    };
    apply(i18n.language as string);

    // und bei jedem Wechsel nachziehen
    const onChange = (lng: string) => apply(lng);
    i18n.on("languageChanged", onChange);
    return () => i18n.off("languageChanged", onChange);
  }, []);

  return null;
}
