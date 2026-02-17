import type { ReactNode } from "react";
import type { Metadata } from "next";
import { loadMessages, makeT } from "@/lib/i18n-static";

/**
 * ============================================================================
 * Spanish Layout
 * Version: v1.1 – 2026-02-17
 * Notes:
 * - Provides ES-specific metadata (overrides root layout)
 * - Pages under /es own SSR i18n + Providers
 * ============================================================================
 */

export function generateMetadata(): Metadata {
  const t = makeT(loadMessages("es"));

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
  return children;
}
