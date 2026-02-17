import PageView from "@/templates/HomePage";
import { loadMessages, makeT } from "@/lib/i18n-static";
import { makeNavigation, NAV_KEYS } from "@/constants/navigation";
import { Providers } from "@/app/providers";

/**
 * ============================================================================
 * DE Root Page (SSR pre-translated)
 * Version: v1.1 – 2026-02-17
 * Notes:
 * - EXACTLY matches "/" pattern: NO Suspense, Server Component, Providers wrap
 * - Providers receive the SAME dict instance used for rendering props
 * ============================================================================
 */

export default function Page() {
  const messages = loadMessages("de");
  const t = makeT(messages);

  NAV_KEYS.forEach((k) => t(k));

  return (
    <Providers locale="de" dict={messages}>
      <PageView
        heroTitle={t("homepage.sections.brand")}
        heroSubtitle={t("homepage.sections.tagline")}
        navigationItems={makeNavigation(t)}
        inputPlaceholder={t("homepage.input.placeholder")}
      />
    </Providers>
  );
}
