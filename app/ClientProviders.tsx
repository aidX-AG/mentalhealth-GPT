'use client';

import './i18n.client';                         // ⚡ i18n einmalig initialisieren
import i18n from './i18n.client';               // ⬅ nötig, um auf languageChanged zu hören
import { Suspense, useEffect, useState } from 'react';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  // 1) Beim Mount aktuelle Sprache (basis, z.B. de aus de-CH) übernehmen
  const [lng, setLng] = useState(() => (i18n.language || 'de').split('-')[0].toLowerCase());

  // 2) Auf Sprachwechsel reagieren → Remount triggern
  useEffect(() => {
    const handler = (newLng: string) => {
      const base = (newLng || 'de').split('-')[0].toLowerCase();
      setLng(base);
      // <html lang> wird bereits in i18n.client beim Wechsel gesetzt
    };
    i18n.on('languageChanged', handler);
    return () => i18n.off('languageChanged', handler);
  }, []);

  // 3) Vermeidet SSR/FOUC, bis Client bereit
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return null;

  // 4) WICHTIG: key={lng} erzwingt Remount des gesamten Subtrees bei Sprachwechsel
  return (
    <Suspense fallback={null}>
      <div key={lng}>{children}</div>
    </Suspense>
  );
}
