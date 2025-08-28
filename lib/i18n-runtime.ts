// lib/i18n-runtime.ts
// Einfache globale Runtime für serverseitige Übersetzungen.
// getT() liefert eine Identitätsfunktion, falls setT(t) noch nicht aufgerufen wurde.
// ⚠️ In Next-SSR wird dieses Modul gecached. Wir setzen t pro Layout/Locale neu.

let currentT: ((s: string) => string) | null = null;

export function setT(fn: (s: string) => string) {
  currentT = fn;
}

// Fallback: Identität -> UI bleibt sichtbar, auch wenn setT() noch nicht gesetzt ist
export function getT(): (s: string) => string {
  return currentT ?? ((s: string) => s);
}
