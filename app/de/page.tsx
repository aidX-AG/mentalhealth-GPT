import PageView from "@/templates/HomePage";

/**
 * ============================================================================
 * DE Root Page
 * Version: v1.3 – 2026-02-17
 * Notes:
 * - Layout provides Providers + dict (single source of truth)
 * - This page stays thin to avoid double loadMessages() + mismatch risk
 * - PageView gets all translations from context
 * ============================================================================
 */

export default function Page() {
  return <PageView />;
}
