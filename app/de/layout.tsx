import type { ReactNode } from "react";
import type { Metadata } from "next";
import { loadMessages, makeT } from "@/lib/i18n-static";

/**
 * ============================================================================
 * German Layout
 * Version: v1.1 – 2026-02-17
 * Notes:
 * - Provides DE-specific metadata (overrides root layout)
 * - Pages under /de own SSR i18n + Providers
 * ============================================================================
 */

export function generateMetadata(): Metadata {
  const t = makeT(loadMessages("de"));

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
  return children;
}
