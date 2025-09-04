// components/LocaleLink.tsx
// --------------------------------------------------------------------------
// [locale-link] v1.2.0 — 2025-09-04
// CHANGELOG:
// - v1.2.0: Locale primär aus aktuellem Pfad (usePathname) abgeleitet.
//           Fallback getClientLocale() → DEFAULT_LOCALE ("en").
//           Ziel-Hrefs werden mit withLocalePath(...) idempotent normalisiert.
// - v1.1.0: (alt) nur getClientLocale() verwendet (abhängig von <html lang>).
// - v1.0.0: Initiale Version.
// --------------------------------------------------------------------------

"use client";

import Link, { LinkProps } from "next/link";
import { PropsWithChildren } from "react";
import { usePathname } from "next/navigation";
import { getClientLocale, withLocalePath, SUPPORTED_LOCALES, type Locale, DEFAULT_LOCALE } from "@/lib/locale";

type Props = PropsWithChildren<LinkProps & { className?: string }>;

// Locale aus aktuellem Pfad ableiten: /de/... | /fr/... | sonst "en"
function inferLocaleFromPath(pathname: string): Locale {
  const first = (pathname || "/").replace(/^\/+/, "").split("/")[0];
  return (SUPPORTED_LOCALES.includes(first as Locale) ? (first as Locale) : DEFAULT_LOCALE);
}

export default function LocaleLink({ href, children, className, ...rest }: Props) {
  const pathname = usePathname() || "/";
  // 1) robust: vom Pfad ableiten
  let locale = inferLocaleFromPath(pathname);
  // 2) Fallback: falls aus irgendeinem Grund nötig, Client-Locale heranziehen
  if (!locale) locale = getClientLocale();

  // Hinweis: In unserem Code verwenden wir href als string.
  // Falls irgendwo UrlObject auftaucht, fällt das hier unmodifiziert durch.
  const target =
    typeof href === "string"
      ? withLocalePath(href, locale) // idempotent; EN bleibt Root
      : href;

  return (
    <Link href={target} className={className} {...rest}>
      {children}
    </Link>
  );
}
