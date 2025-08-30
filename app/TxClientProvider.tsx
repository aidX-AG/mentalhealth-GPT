'use client';

import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { TXProvider } from '@transifex/react';
import { tx, LOCALES, DEFAULT_LOCALE } from '../lib/transifex';

type Props = PropsWithChildren<{ locale?: string }>;

/** Locale-Autodetect (Pfad → <html lang> → Browserlanguage) */
function detectLocale(): string {
  try {
    const seg = (typeof location !== 'undefined'
      ? (location.pathname.split('/')[1] || '').toLowerCase()
      : '');
    if (seg === 'de' || seg === 'fr') return seg;

    const htmlLang = (typeof document !== 'undefined'
      ? (document.documentElement.getAttribute('lang') || '').toLowerCase()
      : '');
    if (htmlLang && LOCALES.includes(htmlLang)) return htmlLang;

    const nav = (typeof navigator !== 'undefined' ? navigator.language : '') || '';
    const lc = nav.toLowerCase();
    if (lc.startsWith('de')) return 'de';
    if (lc.startsWith('fr')) return 'fr';
    return DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

export default function TxClientProvider({ children, locale }: Props) {
  const last = useRef<string>();
  const [ready, setReady] = useState(false); // ⬅️ wichtig: erst rendern, wenn Locale gesetzt

  useEffect(() => {
    const candidate = (locale && LOCALES.includes(locale)) ? locale : detectLocale();
    const target = LOCALES.includes(candidate) ? candidate : DEFAULT_LOCALE;

    // Wenn Ziel gleich bleibt und wir schon ready sind → nichts tun
    if (last.current === target && ready) return;

    let cancelled = false;
    (async () => {
      try {
        // Transifex-Locale setzen (wartet bewusst ab)
        await tx.setCurrentLocale(target);
        if (cancelled) return;

        // <html lang/dir> synchron halten
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('lang', target);
          document.documentElement.setAttribute('dir', target === 'ar' ? 'rtl' : 'ltr');
        }
      } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('[TX] setCurrentLocale failed', err);
        }
      } finally {
        if (!cancelled) {
          last.current = target;
          setReady(true); // ⬅️ jetzt darf UI rendern
        }
      }
    })();

    return () => { cancelled = true; };
  }, [locale, ready]);

  // ⚠️ WICHTIG: Kinder erst rendern, wenn setCurrentLocale() fertig ist,
  // sonst sieht man den ersten Render in EN und Teile bleiben englisch.
  if (!ready) return null;

  return <TXProvider instance={tx}>{children}</TXProvider>;
}
