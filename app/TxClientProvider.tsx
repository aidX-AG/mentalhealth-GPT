// app/TxClientProvider.tsx
'use client';

import { PropsWithChildren, useEffect, useRef } from 'react';
import { TXProvider } from '@transifex/react';
import { tx, LOCALES, DEFAULT_LOCALE } from '../lib/transifex';

type Props = PropsWithChildren<{ locale?: string }>;

export default function TxClientProvider({ children, locale }: Props) {
  const last = useRef<string>();

  useEffect(() => {
    const target =
      locale && LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;

    if (last.current === target) return;
    last.current = target;

    // 1) Transifex-Locale setzen
    tx.setCurrentLocale(target).catch((err) => {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[TX] setCurrentLocale failed', err);
      }
    });

    // 2) <html lang/dir> synchron halten (SEO, a11y)
    if (typeof document !== 'undefined') {
      document.documentElement.lang = target;
      document.documentElement.dir = target === 'ar' ? 'rtl' : 'ltr';
    }
  }, [locale]);

  return <TXProvider instance={tx}>{children}</TXProvider>;
}
