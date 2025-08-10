"use client";

import { useEffect, useMemo, useState } from "react";
import i18n from "@/app/i18n.client";

const SEEN_KEY = "mhgpt_lang_seen_at";
const COOLDOWN_MS = 1000 * 24 * 60 * 60 * 1000; // ~1000 Tage

export default function LanguagePrompt() {
  const [open, setOpen] = useState(false);

  // Browser-Sprache grob (de, fr, en)
  const browserLng = useMemo(() => {
    if (typeof navigator === "undefined") return "en";
    return (navigator.language || "en").slice(0, 2).toLowerCase();
  }, []);

  const currentLng = i18n.language?.slice(0, 2) || "en";

  const suggestedLng = useMemo(() => {
    if (["de", "fr"].includes(browserLng)) return browserLng;
    return "en";
  }, [browserLng]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const seenAt = Number(localStorage.getItem(SEEN_KEY) || 0);
    const tooSoon = Date.now() - seenAt < COOLDOWN_MS;

    // Nur anzeigen, wenn Sprache nicht passt und lange her ist
    if (!tooSoon && suggestedLng !== currentLng) {
      setOpen(true);
    }
  }, [currentLng, suggestedLng]);

  if (!open) return null;

  const labels: Record<string, { title: string; switch: string; keep: string }> = {
    de: {
      title: "Diese Seite ist auf Deutsch verfügbar.",
      switch: "Auf Deutsch wechseln",
      keep: "Bei Englisch bleiben",
    },
    fr: {
      title: "Ce site est disponible en français.",
      switch: "Passer en français",
      keep: "Rester en anglais",
    },
    en: {
      title: "This site is available in English.",
      switch: "Switch to English",
      keep: "Stay on current",
    },
  };

  const L = labels[suggestedLng] || labels.en;

  const closeForAWhile = () => {
    localStorage.setItem(SEEN_KEY, String(Date.now()));
    setOpen(false);
  };

  const switchToSuggested = async () => {
    await i18n.changeLanguage(suggestedLng);
    localStorage.setItem("i18nextLng", suggestedLng);
    closeForAWhile();
  };

  return (
    <div className="fixed bottom-4 right-4 z-[1000] max-w-[22rem] p-4 rounded-xl shadow-lg bg-n-1 text-n-7 dark:bg-n-7 dark:text-n-1 border border-n-3/40 dark:border-n-6/60">
      <div className="font-semibold mb-2">{L.title}</div>
      <div className="flex gap-2">
        <button
          onClick={switchToSuggested}
          className="btn-blue px-3 py-2 rounded-md"
        >
          {L.switch}
        </button>
        <button
          onClick={closeForAWhile}
          className="px-3 py-2 rounded-md bg-n-3 hover:bg-n-4 dark:bg-n-6 dark:hover:bg-n-5 transition-colors"
        >
          {L.keep}
        </button>
      </div>
    </div>
  );
}
