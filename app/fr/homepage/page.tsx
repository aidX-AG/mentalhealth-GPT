import { redirect } from "next/navigation";

/**
 * ============================================================================
 * FR /homepage Redirect
 * Version: v1.0 – 2026-02-17
 * Notes:
 * - Avoid duplicate route - redirect to /fr
 * ============================================================================
 */

export default function Page() {
  redirect("/fr");
}
