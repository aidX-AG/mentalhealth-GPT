// ============================================================================
// 🧠 useAuth Hook – Session Status via /auth/me (Static-Export kompatibel)
// Datei: hooks/useAuth.ts
// Version: v1.0 – 2025-12-18
//
// Ziel:
// - Frontend kann zuverlässig "logged-in vs logged-out" erkennen
// - Kein Next.js API Route nötig (kompatibel mit output: export)
// - Health-grade: cache:no-store, credentials: include, minimale Daten
// ============================================================================

"use client";

import { useCallback, useEffect, useState } from "react";

type AuthMeResponse =
  | { authenticated: false }
  | { authenticated: true; user: { id: number | string; email?: string; displayName?: string | null } };

const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.mentalhealth-gpt.ch"
).replace(/\/$/, "");

async function fetchAuthMe(signal?: AbortSignal): Promise<AuthMeResponse> {
  const res = await fetch(`${API_BASE}/auth/me`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
    headers: { "Accept": "application/json" },
    signal,
  });

  if (!res.ok) {
    // 401 = normal wenn nicht eingeloggt
    return { authenticated: false };
  }

  return (await res.json()) as AuthMeResponse;
}

export function useAuth() {
  const [data, setData] = useState<AuthMeResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refresh = useCallback(async () => {
    const controller = new AbortController();
    try {
      setIsLoading(true);
      const d = await fetchAuthMe(controller.signal);
      setData(d);
    } catch {
      setData({ authenticated: false });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        setIsLoading(true);
        const d = await fetchAuthMe(controller.signal);
        setData(d);
      } catch {
        setData({ authenticated: false });
      } finally {
        setIsLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  return {
    user: data && "user" in data ? data.user : null,
    isAuthenticated: data?.authenticated === true,
    isLoading,
    refresh,
  };
}
