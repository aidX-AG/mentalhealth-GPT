// components/Menu/index.tsx
// --------------------------------------------------------------------------
// [menu-locale] v1.0.0 — 2025-09-02
// CHANGELOG:
// - Verwende LocaleLink statt Link, damit Kacheln die aktuelle Sprache im Pfad halten.
// - Sonst keine Logikänderung (nur Formatierung/Lesbarkeit).
// --------------------------------------------------------------------------

import LocaleLink from "@/components/LocaleLink"; // ⬅️ NEU: locale-stabiler Link
import Icon from "@/components/Icon";

export type MenuItem = {
  title: string;
  icon: string;
  color: string;
  url: string; // neutraler Pfad wie "/therapy-support"
};

type MenuProps = {
  className?: string;
  items: MenuItem[];
};

const Menu = ({ className, items }: MenuProps) => {
  return (
    <div className={className}>
      {items.map((item, index) => (
        <LocaleLink
          key={index}
          href={item.url} // LocaleLink präfixt /de|/fr automatisch; EN bleibt Root
          className="group flex items-center mb-5 p-3.5 border border-n-3 rounded-2xl transition-colors hover:border-n-4 dark:border-n-5"
        >
          <div className="relative flex justify-center items-center w-15 h-15 mr-6">
            <div
              className="absolute inset-0 opacity-20 rounded-xl"
              style={{ backgroundColor: item.color }}
            />
            <Icon className="relative z-10" fill={item.color} name={item.icon} />
          </div>

          <span className="base2 font-semibold text-n-1">{item.title}</span>

          <Icon
            className="ml-auto fill-n-4 transition-colors group-hover:fill-n-7 dark:group-hover:fill-n-1"
            name="arrow-right"
          />
        </LocaleLink>
      ))}
    </div>
  );
};

export default Menu;
