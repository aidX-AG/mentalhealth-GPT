"use client";

// ============================================================================
// 🔐 useAuth – Health-Grade Session Hook (Client Source of Truth)
// Datei: src/hooks/useAuth.ts
// Version: v2.0 – 2025-12-20
//
// Ziel:
// - Single Source of Truth für "logged-in vs logged-out" im UI
// - refresh() erzwingt echten Re-Fetch (no-store) und verarbeitet 401 sauber
// - Kein SWR, kein Fake-State: Status kommt ausschließlich von /auth/me
// - Robust gegen Race-Conditions (nur letzter Request gewinnt)
// ============================================================================

import { useCallback, useEffect, useRef, useState } from "react";

type AuthUser = {
  id?: string | number;
  email?: string;
  displayName?: string | null;
};

type AuthMeResponse =
  | { authenticated: true; user: AuthUser }
  | { authenticated: false };

type UseAuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

function getApiBase(): string {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
    "https://api.mentalhealth-gpt.ch"
  );
}

export function useAuth() {
  const [state, setState] = useState<UseAuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // ✅ Race-Guard: Nur der letzte Request darf den State setzen
  const seqRef = useRef(0);

  const fetchAuthMe = useCallback(async () => {
    const seq = ++seqRef.current;

    setState((s) => ({ ...s, isLoading: true }));

    try {
      const apiBase = getApiBase();

      const res = await fetch(`${apiBase}/auth/me`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      });

      // Wenn ein neuerer Request gestartet wurde: abbrechen
      if (seq !== seqRef.current) return;

      if (res.status === 401) {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
        return;
      }

      if (!res.ok) {
        // Health-grade: bei Fehler nicht "eingeloggt" behaupten
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
        return;
      }

      const data = (await res.json()) as AuthMeResponse;

      if (data && "authenticated" in data && data.authenticated === true) {
        setState({
          user: data.user ?? null,
          isAuthenticated: true,
          isLoading: false,
        });
        return;
      }

      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch {
      // Network/Fetch error => sicherer Default: logged-out
      if (seq !== seqRef.current) return;

      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchAuthMe();
  }, [fetchAuthMe]);

  // Exposed API
  const refresh = useCallback(async () => {
    await fetchAuthMe();
  }, [fetchAuthMe]);

  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    refresh,
  };
}
