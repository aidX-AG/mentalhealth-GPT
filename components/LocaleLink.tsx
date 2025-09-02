// components/LocaleLink.tsx
// v1 — next/link mit automatischem Locale-Prefix

"use client";

import Link, { LinkProps } from "next/link";
import { PropsWithChildren } from "react";
import { getClientLocale, withLocalePath } from "@/lib/locale";

type Props = PropsWithChildren<LinkProps & { className?: string }>;

export default function LocaleLink({ href, children, className, ...rest }: Props) {
  const locale = getClientLocale();

  // Hinweis: In unserem Code verwenden wir href als string.
  // Falls irgendwo UrlObject auftaucht, fällt das hier unmodifiziert durch.
  const target = typeof href === "string" ? withLocalePath(href, locale) : href;

  return (
    <Link href={target} className={className} {...rest}>
      {children}
    </Link>
  );
}
