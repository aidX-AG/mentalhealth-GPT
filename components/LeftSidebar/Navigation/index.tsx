// components/LeftSidebar/Navigation/index.tsx
// ----------------------------------------------------------------------------
// [i18n-path-prefixing] v1.0.2 — 2025-09-02
// CHANGELOG:
// - v1.0.2: href via withLocalePath(...) normalisiert (DE/FR bleiben im Prefix,
//           EN bleibt Root). Sonst NICHTS geändert.
// - v1.0.1: Locale-bewusste Navigation via LocaleLink (nur Ergänzungen)
//           + Active-State-Vergleich gegen mit Locale gepräfixten Pfad
//           + Keine sonstigen Strukturänderungen
// WICHTIG (Images):
// - Bilder-Pfade bitte absolut referenzieren: "/images/...". In EN fehlen sie,
//   wenn irgendwo relative Pfade wie "./images/..." verwendet werden.
// ----------------------------------------------------------------------------

import { usePathname } from "next/navigation";
import Link from "next/link"; // [ALT] bleibt importiert (kein breaking change)
import { twMerge } from "tailwind-merge";
import Icon from "@/components/Icon";
import { useT } from "@transifex/react"; // ⬅️ nur hier neu

// [NEU - i18n helper] LocaleLink + withLocalePath/getClientLocale
//   -> sorgt dafür, dass interne Links automatisch das aktuelle /de|/fr|/en Prefix bekommen
import LocaleLink from "@/components/LocaleLink"; // [NEU]
import { getClientLocale, withLocalePath } from "@/lib/locale"; // [NEU]

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

  // [NEU] aktuelle Locale aus <html lang> lesen (clientseitig stabil)
  const locale = getClientLocale(); // "de" | "fr" | "en"

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
          // [GEÄNDERT: nur Komponente] Link -> LocaleLink
          //   href jetzt VORAB normalisiert ("/de/...", "/fr/..." bzw. EN = Root)
          <LocaleLink
            className={twMerge(
              `flex items-center h-12 base2 font-semibold text-n-3/75 rounded-lg transition-colors hover:text-n-1 ${
                // [NEU: Active-State robust]
                // vorher: pathname === item.url (funktioniert nicht bei /de/... vs "/pricing")
                // jetzt: vergleiche gegen den mit Locale normalisierten Zielpfad
                pathname === withLocalePath(item.url, locale) &&
                "text-n-1 bg-gradient-to-l from-[#323337] to-[rgba(70,79,111,0.3)] shadow-[inset_0px_0.0625rem_0_rgba(255,255,255,0.05),0_0.25rem_0.5rem_0_rgba(0,0,0,0.1)]"
              } ${visible ? "px-3" : "px-5"}`
            )}
            href={withLocalePath(item.url, locale)} // ⬅️ EINZIGE FUNKTIONALE ÄNDERUNG
            key={index}
          >
            <Icon className={item.color} name={item.icon} />
            {!visible && <div className="ml-5">{labelFor(item)}</div>}
          </LocaleLink>
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
