import { redirect } from "next/navigation";

/**
 * ============================================================================
 * Homepage Redirect
 * Version: v1.0 – 2026-02-17
 * Notes:
 * - Avoid duplicate route without Providers
 * - Single source of truth: "/" for EN default
 * ============================================================================
 */

export default function Page() {
  redirect("/");
}
