import type { ReactNode } from "react";

/**
 * ============================================================================
 * German Layout (Pass-through)
 * Version: v1.0 – 2026-02-17
 * Notes:
 * - CRITICAL: No loadMessages() here
 * - CRITICAL: No <Providers> here
 * - Pages under /de own SSR i18n + Providers, matching root pattern
 * ============================================================================
 */

export default function GermanLayout({ children }: { children: ReactNode }) {
  return children;
}
