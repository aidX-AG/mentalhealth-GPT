// components/LangSwitcher.tsx
// v1.0 — super simple Switcher: setzt Cookie & geht auf Sprach-Root

"use client";

type Lang = "de" | "fr" | "en";

function go(lang: Lang) {
  try {
    document.cookie = `lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
  } catch {}
  if (lang === "en") {
    window.location.assign("/");       // EN = Root
  } else {
    window.location.assign(`/${lang}/`);
  }
}

export default function LangSwitcher() {
  return (
    <div className="flex gap-2">
      <button className="btn-stroke-light btn-small" onClick={() => go("de")}>DE</button>
      <button className="btn-stroke-light btn-small" onClick={() => go("fr")}>FR</button>
      <button className="btn-stroke-light btn-small" onClick={() => go("en")}>EN</button>
    </div>
  );
}
