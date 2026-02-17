import type { ReactNode } from "react";
import type { Metadata } from "next";
import { loadMessages, makeT } from "@/lib/i18n-static";

/**
 * ============================================================================
 * French Layout
 * Version: v1.1 – 2026-02-17
 * Notes:
 * - Provides FR-specific metadata (overrides root layout)
 * - Pages under /fr own SSR i18n + Providers
 * ============================================================================
 */

export function generateMetadata(): Metadata {
  const t = makeT(loadMessages("fr"));

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
      url: "https://www.mentalhealth-gpt.ch/fr",
      type: "website",
      images: ["/images/logo.webp"],
    },
  };
}

export default function FrenchLayout({ children }: { children: ReactNode }) {
  return children;
}
