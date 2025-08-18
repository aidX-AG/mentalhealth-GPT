'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function WeglotRefresh() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Zugriff auf Weglot defensiv, damit TS bis zum Typ-Schritt nicht meckert
    const WG = (typeof window !== 'undefined') ? window.Weglot : undefined;

    // Debug-Helper nur in Dev
    const debug = (msg: string) => {
      if (process.env.NODE_ENV === 'development') {
        try {
          const lang = WG?.getCurrentLang?.();
          // eslint-disable-next-line no-console
          console.log(`[WeglotRefresh] ${msg}`, { path: typeof window !== 'undefined' ? window.location.pathname : '', lang });
        } catch {}
      }
    };

    // 1) schneller Refresh kurz nach Hydration
    const t1 = setTimeout(() => {
      try {
        WG?.refresh?.();
        debug('Erster Refresh (150ms)');
      } catch {}
    }, 150);

    // 2) Fallback-Refresh etwas später (für langsame Teile / dynamische DOM-Updates)
    const t2 = setTimeout(() => {
      try {
        WG?.refresh?.();
        debug('Fallback Refresh (400ms)');

        // <html lang> angleichen (kosmetisch, hilft SEO/Switcher)
        const currentLang = WG?.getCurrentLang?.();
        if (currentLang && typeof document !== 'undefined' && document.documentElement.lang !== currentLang) {
          document.documentElement.lang = currentLang;
        }
      } catch {}
    }, 400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname, searchParams]); // bei Route- oder Query-Wechsel erneut refreshen

  return null;
}
