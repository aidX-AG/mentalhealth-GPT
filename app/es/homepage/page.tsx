import { redirect } from "next/navigation";

/**
 * ============================================================================
 * ES /homepage Redirect
 * Version: v1.0 – 2026-02-17
 * Notes:
 * - Avoid duplicate route - redirect to /es
 * ============================================================================
 */

export default function Page() {
  redirect("/es");
}
