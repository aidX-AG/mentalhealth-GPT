// components/Menu/index.tsx
// --------------------------------------------------------------------------
// [menu-locale] v1.0.1 — 2025-09-04
// CHANGELOG:
// - Behalte LocaleLink (locale-stabile Links).
// - Stelle die ursprüngliche Typografie wieder her: große Schrift via `h6`,
//   keine feste Textfarbe (damit Light/Dark korrekt wechselt).
// - Sonst KEINE weiteren Änderungen.
// --------------------------------------------------------------------------

import LocaleLink from "@/components/LocaleLink";
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
          className="group flex items-center mb-5 p-3.5 border border-n-3 rounded-xl h6 transition-all hover:border-transparent hover:shadow-[0_0_1rem_0.25rem_rgba(0,0,0,0.04),0px_2rem_1.5rem_-1rem_rgba(0,0,0,0.12)] last:mb-0 2xl:p-2.5 lg:p-3.5 dark:border-n-5 dark:hover:border-n-7 dark:hover:bg-n-7"
        >
          <div className="relative flex justify-center items-center w-15 h-15 mr-6">
            <div
              className="absolute inset-0 opacity-20 rounded-xl"
              style={{ backgroundColor: item.color }}
            />
            <Icon className="relative z-1" fill={item.color} name={item.icon} />
          </div>

          {item.title}

          <Icon
            className="ml-auto fill-n-4 transition-colors group-hover:fill-n-7 dark:group-hover:fill-n-4"
            name="arrow-next"
          />
        </LocaleLink>
      ))}
    </div>
  );
};

export default Menu;
