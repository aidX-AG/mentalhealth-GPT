import { redirect } from "next/navigation";

/**
 * ============================================================================
 * DE /homepage Redirect
 * Version: v1.0 – 2026-02-17
 * Notes:
 * - Avoid duplicate route - redirect to /de
 * ============================================================================
 */

export default function Page() {
  redirect("/de");
}
