import type { ReactNode } from "react";
import type { Metadata } from "next";
import { loadMessages, makeT } from "@/lib/i18n-static";
import { Providers } from "../providers";

/**
 * ============================================================================
 * German Layout
 * Version: v1.2 – 2026-02-17
 * Notes:
 * - Provides DE-specific metadata (overrides root layout)
 * - CRITICAL: Wrap children with <Providers> so useTranslation()/useI18n() works
 * - Dict is loaded ONCE per request in layout and passed to Providers
 * ============================================================================
 */

export function generateMetadata(): Metadata {
  const messages = loadMessages("de");
  const t = makeT(messages);

  return {
    title: {
      default: t("homepage.sections.brand"),
      template: `%s | ${t("homepage.sections.brand")}`,
    },
    description: t("homepage.sections.tagline"),
    alternates: {
      languages: { de: "/de", fr: "/fr", en: "/" },
    },
    openGraph: {
      title: t("homepage.sections.brand"),
      description: t("homepage.sections.tagline"),
      url: "https://www.mentalhealth-gpt.ch/de",
      type: "website",
      images: ["/images/logo.webp"],
    },
  };
}

export default function GermanLayout({ children }: { children: ReactNode }) {
  const messages = loadMessages("de");

  return (
    <Providers locale="de" dict={messages} children={children} />
  );
}
