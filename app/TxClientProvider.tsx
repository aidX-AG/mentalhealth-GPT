'use client';

import { PropsWithChildren, useEffect, useRef } from 'react';
import { TXProvider } from '@transifex/react';
import { tx, LOCALES, DEFAULT_LOCALE } from '../lib/transifex';

/**
 * TxClientProvider
 * - Setzt die Transifex-Locale im Browser (Client).
 * - Robust gegen fehlendes props.locale (z.B. bei Nginx/SPA-Serving).
 *   Erkennung in dieser Reihenfolge:
 *   1) explizites props.locale (falls gesetzt)
 *   2) Pfadpräfix /de oder /fr (location.pathname)
 *   3) <html lang="..."> (document.documentElement.lang)
 *   4) navigator.language Heuristik → 'de' | 'fr' | 'en'
 * - Aktualisiert <html lang> (SEO/a11y) synchron zur TX-Locale.
 */
type Props = PropsWithChildren<{ locale?: string }>;

function detectLocale(): string {
  try {
    // 1) Pfadpräfix /de /fr prüfen
    const seg = (typeof location !== 'undefined'
      ? (location.pathname.split('/')[1] || '').toLowerCase()
      : '');
    if (seg === 'de' || seg === 'fr') return seg;

    // 2) <html lang> prüfen
    const htmlLang = (typeof document !== 'undefined'
      ? (document.documentElement.getAttribute('lang') || '').toLowerCase()
      : '');
    if (htmlLang && LOCALES.includes(htmlLang)) return htmlLang;

    // 3) Browser-Locale heuristisch mappen
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
    // Gewünschte Locale bestimmen (prop oder Autodetect)
    const candidate = (locale && LOCALES.includes(locale)) ? locale : detectLocale();
    const target = LOCALES.includes(candidate) ? candidate : DEFAULT_LOCALE;

    // Nur bei Wechsel ausführen
    if (last.current === target) return;
    last.current = target;

    // 1) Transifex Locale setzen
    tx.setCurrentLocale(target).catch((err) => {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[TX] setCurrentLocale failed', err);
      }
    });

    // 2) <html lang/dir> synchron halten (SEO/a11y)
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', target);
      document.documentElement.setAttribute('dir', target === 'ar' ? 'rtl' : 'ltr');
    }
  }, [locale]); // prop-locale bleibt weiterhin ein Trigger, falls doch gesetzt

  return <TXProvider instance={tx}>{children}</TXProvider>;
}
