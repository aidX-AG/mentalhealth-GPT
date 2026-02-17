// ============================================================================
// Root Page (EN default)
// Version: v1.3 – 2026-02-17
// Notes:
// - Root route "/" must be wrapped with <Providers> (otherwise useTranslation() fails)
// - Thin pattern: no props passed to PageView (gets i18n from context)
// - PageView v1.4 uses useTranslation() hook + useMemo for derived values
// ============================================================================

import PageView from "@/templates/HomePage";
import { loadMessages } from "@/lib/i18n-static";
import { Providers } from "./providers";

export default function Page() {
  const messages = loadMessages("en");

  return (
    // eslint-disable-next-line react/no-children-prop
    <Providers locale="en" dict={messages} children={<PageView />} />
  );
}
