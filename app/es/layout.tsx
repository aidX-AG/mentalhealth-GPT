import type { ReactNode } from "react";

/**
 * ============================================================================
 * Spanish Layout (Pass-through)
 * Version: v1.0 – 2026-02-17
 * Notes:
 * - CRITICAL: No loadMessages() here
 * - CRITICAL: No <Providers> here
 * - Pages under /es own SSR i18n + Providers, matching root pattern
 * ============================================================================
 */

export default function SpanishLayout({ children }: { children: ReactNode }) {
  return children;
}
