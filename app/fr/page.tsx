import { Suspense } from "react";
import PageView from "@/templates/HomePage";
import { loadMessages, makeT } from "@/lib/i18n-static";
import { makeNavigation, NAV_KEYS } from "@/constants/navigation";
import { Providers } from "@/app/providers";
import GlobalLoading from "@/app/GlobalLoading";

/**
 * ============================================================================
 * FR Root Page (SSR pre-translated)
 * Version: v1.0 – 2026-02-17
 * Notes:
 * - Matches "/" pattern: Server loads dict, pre-translates strings
 * - Providers receive the SAME dict instance used for rendering props
 * - Prevents hydration mismatch (dict1/dict2)
 * ============================================================================
 */

export default function Page() {
  const messages = loadMessages("fr");
  const t = makeT(messages);

  NAV_KEYS.forEach((k) => t(k));

  return (
    <Suspense fallback={<GlobalLoading />}>
      <Providers locale="fr" dict={messages}>
        <PageView
          heroTitle={t("homepage.sections.brand")}
          heroSubtitle={t("homepage.sections.tagline")}
          navigationItems={makeNavigation(t)}
          inputPlaceholder={t("homepage.input.placeholder")}
        />
      </Providers>
    </Suspense>
  );
}
