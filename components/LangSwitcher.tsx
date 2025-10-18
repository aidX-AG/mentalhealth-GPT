// components/LangSwitcher.tsx
"use client";

import { Menu } from "@headlessui/react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { usePathname } from "next/navigation";

type Lang = "de" | "fr" | "en" | "es";

function go(lang: Lang) {
  try {
    document.cookie = `lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
  } catch {}
  if (lang === "en") window.location.assign("/");
  else window.location.assign(`/${lang}/`);
}

const LANGS: Lang[] = ["de", "fr", "en", "es"];
const LABEL: Record<Lang, string> = { de: "DE", fr: "FR", en: "EN", es: "ES" };

function getCookieLang(): Lang | null {
  try {
    const m = (document.cookie || "").match(/(?:^|;\s*)lang=([^;]+)/);
    if (!m) return null;
    const v = decodeURIComponent(m[1]).toLowerCase();
    return (["de", "fr", "en", "es"] as const).includes(v as any) ? (v as Lang) : null;
  } catch {
    return null;
  }
}

function useCurrentLocale(): Lang {
  const pathname = (usePathname() || "/").toLowerCase();
  if (pathname === "/") return getCookieLang() ?? "en";
  const m = pathname.match(/^\/(de|fr|es)(?:\/|$)/);
  if (m) return m[1] as Lang;
  return "en";
}

export default function LangSwitcher() {
  const currentLc = useCurrentLocale();

  return (
    <div className="flex items-center justify-start gap-2">
      {/* 🌐 hellblaues Welt-Icon links außerhalb */}
      <Globe
        className="w-6 h-6 text-sky-400"
        strokeWidth={1.8}
        aria-hidden="true"
      />

      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button
          className="btn-stroke-light text-white !h-[36px] !min-h-0 !py-0
                     !px-7 text-[12px] leading-none flex items-center gap-2
                     min-w-[7rem] justify-between"
          aria-label="Language"
          title="Language"
        >
          <span className="uppercase">{LABEL[currentLc]}</span>
          <ChevronDown className="w-4 h-4 text-white" aria-hidden="true" />
        </Menu.Button>

        {/* Drop-up */}
        <Menu.Items className="absolute left-0 bottom-full mb-1 w-36 max-h-60 overflow-auto origin-bottom-left rounded-md bg-n-7 shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
          {LANGS.map((lc) => {
            const isActive = lc === currentLc;
            return (
              <Menu.Item key={lc}>
                {({ active }) => (
                  <button
                    onClick={() => go(lc)}
                    className={`w-full text-left px-3 py-2 text-sm uppercase flex items-center justify-between ${
                      active ? "bg-n-6 text-primary-1" : "text-white"
                    }`}
                  >
                    <span>{LABEL[lc]}</span>
                    {isActive && <Check className="w-4 h-4" aria-hidden="true" />}
                  </button>
                )}
              </Menu.Item>
            );
          })}
        </Menu.Items>
      </Menu>
    </div>
  );
}
