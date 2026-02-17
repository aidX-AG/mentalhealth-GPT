import type { ReactNode } from "react";
import type { Metadata } from "next";
import { loadMessages, makeT } from "@/lib/i18n-static";
import { Providers } from "../providers";

/**
 * ============================================================================
 * Spanish Layout
 * Version: v1.2 – 2026-02-17
 * Notes:
 * - Provides ES-specific metadata (overrides root layout)
 * - CRITICAL: Wrap children with <Providers> so useTranslation()/useI18n() works
 * - Dict is loaded ONCE per request in layout and passed to Providers
 * ============================================================================
 */

export function generateMetadata(): Metadata {
  const messages = loadMessages("es");
  const t = makeT(messages);

  return {
    title: {
      default: t("homepage.sections.brand"),
      template: `%s | ${t("homepage.sections.brand")}`,
    },
    description: t("homepage.sections.tagline"),
    alternates: {
      languages: { de: "/de", fr: "/fr", es: "/es", en: "/" },
    },
    openGraph: {
      title: t("homepage.sections.brand"),
      description: t("homepage.sections.tagline"),
      url: "https://www.mentalhealth-gpt.ch/es",
      type: "website",
      images: ["/images/logo.webp"],
    },
  };
}

export default function SpanishLayout({ children }: { children: ReactNode }) {
  const messages = loadMessages("es");

  return (
    // eslint-disable-next-line react/no-children-prop
    <Providers locale="es" dict={messages} children={children} />
  );
}
