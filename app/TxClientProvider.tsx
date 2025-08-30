'use client';

/**
 * TxClientProvider
 * - Setzt die aktuelle Locale für die Transifex-React-Runtime (Client-Seite)
 * - Hält <html lang/dir> synchron (SEO, a11y)
 * - Wrappt die App mit <TXProvider>
 *
 * Wichtig:
 *  - KEIN useTranslate/useT hier importieren/verwenden.
 *  - Nur TXProvider + tx.setCurrentLocale().
 */

import { PropsWithChildren, useEffect, useRef } from 'react';
import { TXProvider } from '@transifex/react'; // <-- einzig korrekter Import
import { tx, LOCALES, DEFAULT_LOCALE } from '../lib/transifex';

type Props = PropsWithChildren<{ locale?: string }>;

export default function TxClientProvider({ children, locale }: Props) {
  const last = useRef<string>();

  useEffect(() => {
    // Ziel-Locale bestimmen (nur erlaubte LOCALES, sonst Fallback)
    const target =
      locale && LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;

    if (last.current === target) return;
    last.current = target;

    // 1) Transifex-Locale setzen (Client)
    tx.setCurrentLocale(target).catch((err) => {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[TX] setCurrentLocale failed', err);
      }
    });

    // 2) <html lang/dir> synchron halten
    if (typeof document !== 'undefined') {
      document.documentElement.lang = target;
      document.documentElement.dir = target === 'ar' ? 'rtl' : 'ltr';
    }
  }, [locale]);

  // TXProvider stellt useT() & <T> in allen Client-Komponenten bereit
  return <TXProvider instance={tx}>{children}</TXProvider>;
}
