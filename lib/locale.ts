// lib/locale.ts
// --------------------------------------------------------------------------
// [locale-utils] v1.3.0 — 2025-10-18
// CHANGELOG:
// - v1.2.0: EN bekommt KEIN Prefix (/en) mehr. EN bleibt Root "/".
//           Fix für statisches Hosting, damit Links wie /pricing in EN
//           nicht auf /en/pricing zeigen.
// - v1.3.0: ES hinzugefügt
// --------------------------------------------------------------------------

export const SUPPORTED_LOCALES = ["de", "fr", "en", "es"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

/** Client-only: nimmt <html lang> als Quelle (setzen wir in TxClientProvider) */
export function getClientLocale(): Locale {
  if (typeof document !== "undefined") {
    const lang = (document.documentElement.getAttribute("lang") || "").toLowerCase();
    if (SUPPORTED_LOCALES.includes(lang as Locale)) return lang as Locale;
  }
  return DEFAULT_LOCALE;
}

/** Fügt dem Pfad den aktuellen Locale-Prefix hinzu (idempotent). */
export function withLocalePath(path: string, locale: Locale): string {
  // Normalize eingehenden Pfad
  const raw = path || "/";
  const normalized = raw.startsWith("/") ? raw : `/${raw}`;

  // Wenn schon ein Locale-Präfix vorhanden ist, unverändert lassen
  const firstSeg = normalized.replace(/^\/+/, "").split("/")[0];
  if (SUPPORTED_LOCALES.includes(firstSeg as Locale)) return normalized;

  // ⚠️ EN ist Root, daher KEIN Präfix für EN
  if (locale === "en") return normalized === "/"
    ? "/"          // root bleibt root
    : normalized;  // z.B. "/pricing" bleibt "/pricing"

  // Für DE/FR/ES präfixen
  if (normalized === "/") return `/${locale}/`;
  return `/${locale}${normalized}`;
}
