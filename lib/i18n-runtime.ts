// lib/i18n-runtime.ts
// Globale Runtime für Übersetzungen (Server + Client)

type TFn = (s: string) => string;

let currentT: TFn = (s) => s; // Default: Identität

export function setT(fn: TFn) {
  currentT = fn;
}

export function getT(): TFn {
  if (typeof window === "undefined") {
    // Serverseitig → benutze currentT
    return (s: string) => currentT(s);
  }

  // Clientseitig → hole das t, das TxClientProvider auf window.__t gelegt hat
  const wt = (window as any).__t as TFn | undefined;
  return (s: string) => (wt ? wt(s) : s);
}
