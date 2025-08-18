'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

declare global {
  interface Window {
    Weglot?: {
      refresh?: () => void;
      getCurrentLang?: () => string;
      switchTo?: (lang: string) => void;
    };
  }
}

const WG = typeof window !== 'undefined' ? window.Weglot : undefined;

export default function WeglotRefresh() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 1) Language from URL (/de, /fr → else en)
    const langFromPath =
      pathname?.startsWith('/de') ? 'de' :
      pathname?.startsWith('/fr') ? 'fr' : 'en';

    // 2) Force Weglot to that lang (prevents EN override after hydration)
    const forceLanguage = () => {
      const current = WG?.getCurrentLang?.();
      if (WG?.switchTo && langFromPath && current !== langFromPath) {
        WG.switchTo(langFromPath);
      }
    };

    // 3) First quick refresh
    const t1 = setTimeout(() => {
      forceLanguage();
      WG?.refresh?.();
      if (process.env.NODE_ENV === 'development') {
        console.log('[WeglotRefresh] first refresh @150ms', { langFromPath, current: WG?.getCurrentLang?.() });
      }
    }, 150);

    // 4) Fallback refresh (a bit later)
    const t2 = setTimeout(() => {
      forceLanguage();
      WG?.refresh?.();
      // Sync <html lang>
      const current = WG?.getCurrentLang?.();
      if (current && document.documentElement.lang !== current) {
        document.documentElement.lang = current;
      }
      if (process.env.NODE_ENV === 'development') {
        console.log('[WeglotRefresh] fallback refresh @400ms', { langFromPath, current });
      }
    }, 400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname, searchParams]);

  return null;
}
