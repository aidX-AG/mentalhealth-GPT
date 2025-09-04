// components/LeftSidebar/Navigation/index.tsx
// ----------------------------------------------------------------------------
// [i18n-path-prefixing] v1.0.3 — 2025-09-04
// CHANGELOG:
// - v1.0.3: Mini-Patch: Eingehende URLs, die fälschlich mit "/en/..." beginnen,
//           lokal neutralisieren ("/en/foo" → "/foo") und DANN withLocalePath()
//           anwenden. So greifen DE/FR korrekt, EN bleibt Root.
//           ➜ Nur diese Änderung; ansonsten alles unverändert.
// - v1.0.2: href via withLocalePath(...) normalisiert (DE/FR bleiben im Prefix,
//           EN bleibt Root). Sonst NICHTS geändert.
// - v1.0.1: Locale-bewusste Navigation via LocaleLink (nur Ergänzungen)
//           + Active-State-Vergleich gegen mit Locale gepräfixten Pfad
//           + Keine sonstigen Strukturänderungen
// ----------------------------------------------------------------------------

import { usePathname } from "next/navigation";
import Link from "next/link"; // [ALT] bleibt importiert (kein breaking change)
import { twMerge } from "tailwind-merge";
import Icon from "@/components/Icon";
import { useT } from "@transifex/react";

// [i18n helper]
import LocaleLink from "@/components/LocaleLink";
import { getClientLocale, withLocalePath } from "@/lib/locale";

type NavigationType = {
  title: string;
  icon: string;
  color: string;
  url?: string;
  onClick?: () => void;
};

type NavigationProps = {
  visible?: boolean;
  items: NavigationType[];
};

const Navigation = ({ visible, items }: NavigationProps) => {
  const pathname = usePathname();
  const t = useT();

  // aktuelle Locale aus <html lang>
  const locale = getClientLocale(); // "de" | "fr" | "en"

  // ⬇️ Mini-Helper (nur lokal hier):
  // Wenn Items irrtümlich "/en/..." enthalten, neutralisieren wir das zu "/..."
  // bevor withLocalePath(...) greift. So ist EN=Root, DE/FR bekommen Prefix.
  const neutralizeEnPrefix = (path?: string) => {
    if (!path) return path;
    const p = path.startsWith("/") ? path : `/${path}`;
    return p.replace(/^\/en(\/|$)/, "/");
  };

  // stabile Übersetzungen anhand des Icon-Namens
  const labelFor = (item: NavigationType) => {
    switch (item.icon) {
      case "chat":     return t("Chats");
      case "search":   return t("Search");
      case "card":     return t("Manage subscription");
      case "barcode":  return t("Updates & FAQ");
      case "settings": return t("Settings");
      default:         return item.title; // Fallback
    }
  };

  return (
    <div className={`${visible && "px-2"}`}>
      {items.map((item, index) =>
        item.url ? (
          (() => {
            // ⬇️ EINZIGE FUNKTIONALE ÄNDERUNG ggü. v1.0.2:
            // 1) "/en/..." → "/..."
            // 2) dann locale-sicher machen
            const neutral = neutralizeEnPrefix(item.url);
            const target = withLocalePath(neutral || "", locale);

            return (
              <LocaleLink
                className={twMerge(
                  `flex items-center h-12 base2 font-semibold text-n-3/75 rounded-lg transition-colors hover:text-n-1 ${
                    // Active-State gegen das selbe Ziel vergleichen
                    pathname === target &&
                    "text-n-1 bg-gradient-to-l from-[#323337] to-[rgba(70,79,111,0.3)] shadow-[inset_0px_0.0625rem_0_rgba(255,255,255,0.05),0_0.25rem_0.5rem_0_rgba(0,0,0,0.1)]"
                  } ${visible ? "px-3" : "px-5"}`
                )}
                href={target}
                key={index}
              >
                <Icon className={item.color} name={item.icon} />
                {!visible && <div className="ml-5">{labelFor(item)}</div>}
              </LocaleLink>
            );
          })()
        ) : (
          <button
            className={`flex items-center w-full h-12 base2 font-semibold text-n-3/75 rounded-lg transition-colors hover:text-n-1 ${
              visible ? "px-3" : "px-5"
            }`}
            key={index}
            onClick={item.onClick}
          >
            <Icon className={item.color} name={item.icon} />
            {!visible && <div className="ml-5">{labelFor(item)}</div>}
            {/* ⌘ F unverändert, NICHT übersetzen */}
            {item.icon === "search" && !visible && (
              <div className="ml-auto px-2 rounded-md bg-n-4/50 caption1 font-semibold text-n-3">⌘ F</div>
            )}
          </button>
        )
      )}
    </div>
  );
};

export default Navigation;

