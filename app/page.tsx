// ============================================================================
// Root Page (EN default)
// Version: v1.1 – 2026-02-17
// Notes:
// - Root route "/" must be wrapped with <Providers> (otherwise useTranslation() fails)
// - Keep server-side i18n-static (loadMessages/makeT) for deterministic SSR
// ============================================================================

import PageView from "@/templates/HomePage";
import { loadMessages, makeT } from "@/lib/i18n-static";
import { makeNavigation, NAV_KEYS } from "@/constants/navigation";
import { Providers } from "./providers";

export default function Page() {
  const messages = loadMessages("en");
  const t = makeT(messages);

  // Pre-warm navigation keys (ensures dict keys are touched during SSR)
  NAV_KEYS.forEach((k) => t(k));

  return (
    <Providers locale="en" dict={messages}>
      <PageView
        heroTitle={t("homepage.sections.brand")}
        heroSubtitle={t("homepage.sections.tagline")}
        navigationItems={makeNavigation(t)}
        inputPlaceholder={t("homepage.input.placeholder")}
      />
    </Providers>
  );
}
