// components/LangSwitcher.tsx
"use client";

type Lang = "de" | "fr" | "en" | "es";

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
    <div className={stack ? "flex flex-col gap-1" : "flex gap-1"}>
      {["de","fr","en","es"].map((lc) => (
        <button
          key={lc}
          className="btn-stroke-light btn-small text-white !px-2 !py-1 text-[10px] leading-none"
          onClick={() => go(lc as Lang)}
          aria-label={lc.toUpperCase()}
          title={lc.toUpperCase()}
        >
          {lc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
