// lib/i18n-runtime.ts
// Globale Runtime für SSR + Client.
// - Auf dem Server: setT(makeT(dict)) setzt currentT für die SSR.
// - Auf dem Client: wenn window.__I18N__.dict vorhanden ist, liefert getT()
//   eine Lookup-Funktion darauf (damit bleiben Client-Komponenten übersetzt).

let currentT: ((s: string) => string) | null = null;

// Server-seitig vom Layout gesetzt (pro Request/Locale)
export function setT(fn: (s: string) => string) {
  currentT = fn;
}

// Client-Helper: Wörterbuch direkt vom Window lesen (vom Layout injiziert)
function getClientT(): ((s: string) => string) | null {
  if (typeof window === 'undefined') return null;
  const g: any = window as any;
  const dict = g.__I18N__?.dict;
  if (dict && typeof dict === 'object') {
    return (s: string) => (s in dict ? dict[s] : s);
  }
  return null;
}

// Hauptzugriff: bevorzugt Server currentT, sonst Client-Map, sonst Identität
export function getT(): (s: string) => string {
  return currentT ?? getClientT() ?? ((s: string) => s);
}
