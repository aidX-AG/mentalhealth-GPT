'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Lokaler, kompatibler Typ – KEIN global declare
type WeglotAPI = {
  refresh?: () => void;
  getCurrentLang?: () => string;
  switchTo?: (lang: string) => void;
};

export default function WeglotRefresh() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Defensiver Zugriff, ohne Window global zu erweitern
    const WG: WeglotAPI | undefined =
      typeof window !== 'undefined' ? (window as any).Weglot : undefined;

    // 1) schneller Refresh kurz nach Hydration
    const t1 = setTimeout(() => {
      try {
        WG?.refresh?.();
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.log('[WeglotRefresh] Erster Refresh (150ms)', {
            path: typeof window !== 'undefined' ? window.location.pathname : '',
            lang: WG?.getCurrentLang?.(),
          });
        }
      } catch {}
    }, 150);

    // 2) Fallback-Refresh etwas später (für langsame Teile / dynamische DOM-Updates)
    const t2 = setTimeout(() => {
      try {
        WG?.refresh?.();
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.log('[WeglotRefresh] Fallback Refresh (400ms)', {
            path: typeof window !== 'undefined' ? window.location.pathname : '',
            lang: WG?.getCurrentLang?.(),
          });
        }

        // <html lang> angleichen (kosmetisch, hilft SEO/Switcher)
        const currentLang = WG?.getCurrentLang?.();
        if (
          currentLang &&
          typeof document !== 'undefined' &&
          document.documentElement.lang !== currentLang
        ) {
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
