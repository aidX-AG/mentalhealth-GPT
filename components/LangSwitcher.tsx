// components/LangSwitcher.tsx
// v1.2 — Schriftfarbe fixiert (immer weiß) + optional Stack im Collapsed-Sidebar-Modus
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

export default function LangSwitcher({ stack = false }: { stack?: boolean }) {
  return (
    <div className={stack ? "flex flex-col gap-2" : "flex gap-2"}>
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
