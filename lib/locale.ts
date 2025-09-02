// lib/locale.ts
// v1.1 — 2025-09-02
// - EN nie prefixen (EN = Root, kein /en/)
// - Externe/Hash/Mailto/Tel/Javascript-Links unverändert durchlassen
// - Idempotent: bereits /de|/fr bleibt wie es ist

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

function isExternalish(path: string): boolean {
  return (
    /^(https?:)?\/\//i.test(path) ||
    path.startsWith("#") ||
    path.startsWith("mailto:") ||
    path.startsWith("tel:") ||
    path.startsWith("javascript:")
  );
}

/** Fügt dem Pfad den aktuellen Locale-Prefix hinzu (idempotent, EN = kein Prefix). */
export function withLocalePath(path: string, locale: Locale): string {
  if (!path) return locale === "en" ? "/" : `/${locale}`;

  // normalisieren (führenden Slash sicherstellen)
  const clean = path.startsWith("/") ? path : `/${path}`;

  // externe/sonder-Links nicht anfassen
  if (isExternalish(clean)) return path;

  // bereits mit Locale?
  const seg = clean.replace(/^\//, "").split("/")[0];
  if (SUPPORTED_LOCALES.includes(seg as Locale)) return clean;

  // EN nie prefixen (EN = Root)
  if (locale === "en") {
    return clean; // z.B. "/pricing" bleibt "/pricing"
  }

  // Root speziell
  if (clean === "/") return `/${locale}/`;

  return `/${locale}${clean}`;
}
