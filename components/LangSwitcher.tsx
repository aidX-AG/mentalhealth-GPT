// components/LangSwitcher.tsx
// v1.1 — Schriftfarbe fixiert: immer weiß, unabhängig vom Theme

"use client";

type Lang = "de" | "fr" | "en";

function go(lang: Lang) {
  try {
    document.cookie = `lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
  } catch {}
  if (lang === "en") {
    window.location.assign("/"); // EN = Root
  } else {
    window.location.assign(`/${lang}/`);
  }
}

export default function LangSwitcher() {
  return (
    <div className="flex gap-2">
      <button
        className="btn-stroke-light btn-small text-white"
        onClick={() => go("de")}
      >
        DE
      </button>
      <button
        className="btn-stroke-light btn-small text-white"
        onClick={() => go("fr")}
      >
        FR
      </button>
      <button
        className="btn-stroke-light btn-small text-white"
        onClick={() => go("en")}
      >
        EN
      </button>
    </div>
  );
}
