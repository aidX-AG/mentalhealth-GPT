'use client';

import { PropsWithChildren, useEffect, useRef } from 'react';
import { TXProvider } from '@transifex/react';
import { tx, LOCALES, DEFAULT_LOCALE } from '../lib/transifex';

type Props = PropsWithChildren<{ locale?: string }>;

/** Locale-Autodetect (Pfad → <html lang> → Browserlanguage) */
function detectLocale(): string {
  try {
    // 1) /de | /fr aus dem Pfad
    const seg = (typeof location !== 'undefined'
      ? (location.pathname.split('/')[1] || '').toLowerCase()
      : '');
    if (seg === 'de' || seg === 'fr') return seg;

    // 2) <html lang>
    const htmlLang = (typeof document !== 'undefined'
      ? (document.documentElement.getAttribute('lang') || '').toLowerCase()
      : '');
    if (htmlLang && LOCALES.includes(htmlLang)) return htmlLang;

    // 3) Browser-Locale
    const nav = (typeof navigator !== 'undefined' ? navigator.language : '') || '';
    const lc = nav.toLowerCase();
    if (lc.startsWith('de')) return 'de';
    if (lc.startsWith('fr')) return 'fr';

    return DEFAULT_LOCALE; // 'en'
  } catch {
    return DEFAULT_LOCALE;
  }
}

export default function TxClientProvider({ children, locale }: Props) {
  const last = useRef<string>();

  useEffect(() => {
    const candidate = (locale && LOCALES.includes(locale)) ? locale : detectLocale();
    const target = LOCALES.includes(candidate) ? candidate : DEFAULT_LOCALE;

    if (last.current === target) return;
    last.current = target;

    // Nicht blockieren: Promise starten, aber sofort rendern lassen
    tx.setCurrentLocale(target).catch((err) => {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[TX] setCurrentLocale failed', err);
      }
    });

    // <html lang/dir> synchronisieren (hilft SEO/a11y & Fallbacks)
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', target);
      document.documentElement.setAttribute('dir', target === 'ar' ? 'rtl' : 'ltr');
    }
  }, [locale]);

  return <TXProvider instance={tx}>{children}</TXProvider>;
}
