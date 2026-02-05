// ============================================================================
// 🔓 logout — Health-Grade Logout Helper (Frontend)
// Datei: lib/auth/logout.ts
// Version: v1.0 – 2025-12-20
//
// Zweck:
// - Ruft Backend POST /auth/logout auf (HTTP-only Cookie Session revoke + clear)
// - Kein Redirect (User bleibt auf aktueller Seite)
// - Caller aktualisiert UI-State (z.B. via useAuth().refresh)
//
// Security/Robustheit:
// - credentials: "include" (Cookie muss mitgehen)
// - cache: "no-store"
// - idempotent: auch ohne Session/Cookie soll Logout "ok" sein
// ============================================================================

const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.mentalhealth-gpt.ch"
).replace(/\/$/, "");

export async function logout(): Promise<{ ok: boolean }> {
  try {
    const res = await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      cache: "no-store",
    });

    // Health-grade: 204 ist erwartet, aber ok/2xx ist ebenfalls akzeptabel.
    if (res.status === 204 || res.ok) {
      return { ok: true };
    }

    return { ok: false };
  } catch {
    return { ok: false };
  }
}
