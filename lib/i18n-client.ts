// lib/i18n-client.ts
"use client";

type Dict = Record<string, string>;

declare global {
  interface Window {
    __I18N__?: { locale: string; dict: Dict };
  }
}

/**
 * Minimaler Client-Hook, der NUR aus window.__I18N__ liest.
 * Keine Importe von "@/locales". Keine Async-Calls. Keine State-Magie.
 */
export function useI18n() {
  // window kann auf dem Server undefined sein – daher guards:
  const w = typeof window !== "undefined" ? window : ({} as any);
  const dict: Dict = w.__I18N__?.dict ?? {};
  const locale: string = w.__I18N__?.locale ?? "en";

  const t = (key: string) => (key in dict ? dict[key] : key);

  return { t, locale, dict };
}

/**
 * Optional: Kurzform – falls du wie bisher `_` nutzen willst.
 * (Zieht direkt aus window.__I18N__; kein React nötig.)
 */
export const _ = (key: string) => {
  const w = typeof window !== "undefined" ? window : ({} as any);
  const dict: Dict = w.__I18N__?.dict ?? {};
  return key in dict ? dict[key] : key;
};
