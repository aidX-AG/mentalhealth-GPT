// lib/i18n/_.ts
// Isomorphic helper: safe on server and client.
// - Server: returns the input (server pages translate via makeT/loadMessages).
// - Client: uses the injected dict from window.__I18N__, falls back to sync load.

import { loadMessages, type Locale } from "@/lib/i18n-static";

export function _(input: string): string {
  // Server-side: do NOT translate here. Pages/components using SSR should use makeT().
  if (typeof window === "undefined") return input;

  // Client: prefer injected dictionary from RootLayout
  const injected = (window as any).__I18N__;
  if (injected?.dict) {
    const hit = injected.dict[input];
    return typeof hit === "string" ? hit : input;
  }

  // Fallback (should rarely run): detect lang, sync-load messages, cache them
  const htmlLang = (document.documentElement.getAttribute("lang") || "en").toLowerCase();
  const locale: Locale = htmlLang.startsWith("de")
    ? "de"
    : htmlLang.startsWith("fr")
    ? "fr"
    : "en";

  try {
    const dict = loadMessages(locale);
    (window as any).__I18N__ = { locale, dict };
    return dict[input] ?? input;
  } catch {
    return input;
  }
}
