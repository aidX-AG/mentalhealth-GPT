"use client";

import PageView from "@/templates/HomePage";
import { makeNavigation } from "@/constants/navigation";
import { useTranslation } from "@/lib/i18n/I18nContext";

/**
 * ============================================================================
 * ES /homepage Page
 * Version: v1.0 – 2026-02-17
 * Notes:
 * - Same as /es root, but kept if route is required
 * - Uses Provider context (no loadMessages)
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
