'use client';

import { PropsWithChildren, useEffect, useRef } from 'react';
import { TXProvider, useT } from '@transifex/react';
import { tx, LOCALES, DEFAULT_LOCALE } from '../lib/transifex';

type Props = PropsWithChildren<{ locale?: string }>;

function TBridge() {
  // t aus dem Transifex-React-Kontext holen
  const t = useT();
  // global für getT() im Browser verfügbar machen
  useEffect(() => {
    (window as any).__t = t;
  }, [t]);
  return null;
}

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

  return (
    <TXProvider instance={tx}>
      <TBridge />
      {children}
    </TXProvider>
  );
}
