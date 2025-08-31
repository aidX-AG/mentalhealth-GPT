'use client';

import { usePathname } from "next/navigation";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import Icon from "@/components/Icon";
import { useT } from "@transifex/react";

type NavigationType = {
  title: string;   // bleibt als Fallback
  icon: string;    // stabile ID für Mapping
  color: string;
  url?: string;
  onClick?: () => void;
};

type NavigationProps = {
  visible?: boolean;
  items: NavigationType[];
};

export default function Navigation({ visible, items }: NavigationProps) {
  const pathname = usePathname();
  const t = useT();

  // Icon -> Übersetztes Label
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
    <div className={visible ? "px-2" : ""}>
      {items.map((item, index) =>
        item.url ? (
          <Link
            key={index}
            href={item.url}
            className={twMerge(
              `flex items-center h-12 base2 font-semibold text-n-3/75 rounded-lg transition-colors hover:text-n-1
               ${pathname === item.url
                 ? "text-n-1 bg-gradient-to-l from-[#323337] to-[rgba(70,79,111,0.3)] shadow-[inset_0px_0.0625rem_0_rgba(255,255,255,0.05),0_0.25rem_0.5rem_0_rgba(0,0,0,0.1)]"
                 : ""} ${visible ? "px-3" : "px-5"}`
            )}
          >
            <Icon className={item.color} name={item.icon} />
            {!visible && <div className="ml-5">{labelFor(item)}</div>}
          </Link>
        ) : (
          <button
            key={index}
            onClick={item.onClick}
            className={`flex items-center w-full h-12 base2 font-semibold text-n-3/75 rounded-lg transition-colors hover:text-n-1 ${visible ? "px-3" : "px-5"}`}
          >
            <Icon className={item.color} name={item.icon} />
            {!visible && <div className="ml-5">{labelFor(item)}</div>}
            {/* Shortcut-Hinweis nur für Search, unverändert (nicht übersetzen) */}
            {item.icon === "search" && !visible && (
              <div className="ml-auto px-2 rounded-md bg-n-4/50 caption1 font-semibold text-n-3">⌘ F</div>
            )}
          </button>
        )
      )}
    </div>
  );
}
