// lib/locale.ts
// v1 — helpers to read current locale on both server & client

export const SUPPORTED_LOCALES = ["de", "fr", "en"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

/** Client-only: nimmt <html lang> als Quelle (setzen wir in TxClientProvider / layout.tsx) */
export function getClientLocale(): Locale {
  if (typeof document !== "undefined") {
    const lang = (document.documentElement.getAttribute("lang") || "").toLowerCase();
    if (SUPPORTED_LOCALES.includes(lang as Locale)) return lang as Locale;
  }
  return DEFAULT_LOCALE;
}

/** Fügt dem Pfad den aktuellen Locale-Prefix hinzu (idempotent). */
export function withLocalePath(path: string, locale: Locale): string {
  if (!path) return `/${locale}`;
  // schon ein Prefix?
  const seg = path.replace(/^\//, "").split("/")[0];
  if (SUPPORTED_LOCALES.includes(seg as Locale)) return path; // bereits /de/... /fr/... /en/...
  // Sonderfall root
  if (path === "/") return `/${locale}/`;
  return `/${locale}${path.startsWith("/") ? "" : "/"}${path}`;
}
