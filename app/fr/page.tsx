"use client";

import PageView from "@/templates/HomePage";
import { makeNavigation } from "@/constants/navigation";
import { useTranslation } from "@/lib/i18n/I18nContext";

/**
 * ============================================================================
 * FR Root Page
 * Version: v1.0 – 2026-02-17
 * Notes:
 * - CRITICAL FIX: No loadMessages here (dict comes from app/fr/layout.tsx Providers)
 * - Uses Provider context for deterministic SSR + hydration stability
 * ============================================================================
 */

export default function Page() {
  const t = useTranslation();

  return (
    <PageView
      heroTitle={t("homepage.sections.brand")}
      heroSubtitle={t("homepage.sections.tagline")}
      navigationItems={makeNavigation(t)}
      inputPlaceholder={t("homepage.input.placeholder")}
    />
  );
}
