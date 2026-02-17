"use client";

import { useMemo } from "react";
import Layout from "@/components/Layout";
import Main from "./Main";
import { useTranslation } from "@/lib/i18n/I18nContext";
import { makeNavigation } from "@/constants/navigation";

/**
 * ============================================================================
 * HomePage Template
 * Version: v1.4 – 2026-02-17
 * Notes:
 * - Client component: i18n comes from context (no SSR props required)
 * - Single source of truth: Layout's Provider
 * - Avoid "children=" anti-pattern → use <Layout>...</Layout>
 * - Memoize derived UI props for stability/performance
 * ============================================================================
 */

const HomePage = () => {
  const t = useTranslation();

  const heroTitle = useMemo(() => t("homepage.sections.brand"), [t]);
  const heroSubtitle = useMemo(() => t("homepage.sections.tagline"), [t]);
  const inputPlaceholder = useMemo(() => t("homepage.input.placeholder"), [t]);

  // Navigation depends on t() and should not be re-created every render
  const navigationItems = useMemo(() => makeNavigation(t), [t]);

  return (
    <Layout>
      <Main
        heroTitle={heroTitle}
        heroSubtitle={heroSubtitle}
        items={navigationItems}
        inputPlaceholder={inputPlaceholder}
      />
    </Layout>
  );
};

export default HomePage;
