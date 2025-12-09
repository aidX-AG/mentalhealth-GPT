// ============================================================================
// 🔐 useSession – Health-Grade Session Hook (Best of Breed)
// Datei: hooks/useSession.ts
// Version: v2.2 – 2025-12-07
//
// Features:
//   - Fragt /auth/session am Backend ab (Cookie-basiert)
//   - Client-Side Cache in localStorage (nur isAuthenticated, kein PII)
//   - Auto-Retry mit Exponential Backoff (nur bei Netzwerkfehlern)
//   - Multi-Tab-Sync via BroadcastChannel + storage-Event
//   - Defensive Response-Validierung (kein Blindvertrauen)
//   - Typed Subscription- und Plan-Status für Feature-Gating
//
// API:
//   const {
//     isAuthenticated,
//     isLoading,
//     error,
//     email,
//     subscriptionStatus,
//     planType,
//     remainingFreePrompts,
//     refetch,
//   } = useSession();
// ============================================================================

import { useCallback, useEffect, useRef, useState } from "react";

// ----------------------
// 🎫 Typen
// ----------------------

// Subscription-Status, wie wir ihn im Backend/DB vorgesehen haben
export type SubscriptionStatus = "none" | "trial" | "active" | "expired" | "canceled";

// Plan-Typen für Feature-Gating (Upload etc.)
// Du kannst hier später deine realen Plannamen ergänzen (z.B. "founding", "starter")
export type PlanType =
  | "free"
  | "basic"
  | "premium"
  | "institution"
  | "enterprise"
  | "founding"
  | null;

type SessionState = {
  isAuthenticated: boolean | null;
  isLoading: boolean;
  error: string | null;
  email: string | null;
  subscriptionStatus: SubscriptionStatus;
  planType: PlanType;
  remainingFreePrompts: number | null;
};

type CachedSession = {
  isAuthenticated: boolean;
  updatedAt: number;
};

const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://api.mentalhealth-gpt.ch"
).replace(/\/$/, "");

const SESSION_CACHE_KEY = "mhgpt_session_state_v1";

// Cache gilt z.B. 5 Minuten
const MAX_CACHE_AGE_MS = 5 * 60 * 1000;

// Auto-Retry bei Netzfehlern: max 3 Versuche (1s, 2s, 4s)
const MAX_RETRIES = 3;

// ============================================================================
// 🔧 Helpers
// ============================================================================

// Fetch mit Timeout
async function fetchWithTimeout(
  input: RequestInfo,
  init: RequestInit & { timeoutMs?: number } = {},
): Promise<Response> {
  const { timeoutMs = 10000, ...rest } = init;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(input, {
      ...rest,
      signal: controller.signal,
    });
    return res;
  } finally {
    clearTimeout(id);
  }
}

// localStorage read (nur isAuthenticated)
function readCachedSession(): CachedSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedSession;
    if (
      typeof parsed?.isAuthenticated === "boolean" &&
      typeof parsed?.updatedAt === "number"
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

// localStorage write – wir cachen nur das Auth-Flag, nicht PII / keine Meta
function writeCachedSession(isAuthenticated: boolean) {
  if (typeof window === "undefined") return;
  try {
    const payload: CachedSession = {
      isAuthenticated,
      updatedAt: Date.now(),
    };
    window.localStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(payload));
  } catch {
    // Ignorieren – Cache ist nur ein Bonus
  }
}

// Response defensiv interpretieren (nur authenticated-Flag)
function parseSessionAuthenticated(data: any): boolean {
  if (data && typeof data.authenticated === "boolean") {
    return data.authenticated;
  }
  // Health-Grade Default: lieber "false" als "true" bei Unsicherheit
  return false;
}

// Metadaten aus der Response extrahieren – defensiv & typisiert
function extractSessionMeta(data: any): {
  email: string | null;
  subscriptionStatus: SubscriptionStatus;
  planType: PlanType;
  remainingFreePrompts: number | null;
} {
  const email =
    data && typeof data.email === "string" ? data.email : null;

  let subscriptionStatus: SubscriptionStatus = "none";
  if (data && typeof data.subscriptionStatus === "string") {
    const raw = data.subscriptionStatus as string;
    // Nur bekannte Werte akzeptieren, alles andere → "none"
    if (["none", "trial", "active", "expired", "canceled"].includes(raw)) {
      subscriptionStatus = raw as SubscriptionStatus;
    }
  }

  let planType: PlanType = null;
  if (data && typeof data.planType === "string") {
    const raw = data.planType as string;
    if (
      [
        "free",
        "basic",
        "premium",
        "institution",
        "enterprise",
        "founding",
      ].includes(raw)
    ) {
      planType = raw as PlanType;
    } else {
      // Unbekannter Plan → sicherste Variante: wie "free" behandeln
      planType = "free";
    }
  }

  const remainingFreePrompts =
    data && typeof data.remainingFreePrompts === "number"
      ? data.remainingFreePrompts
      : null;

  return { email, subscriptionStatus, planType, remainingFreePrompts };
}

// ============================================================================
// 🔁 Hook
// ============================================================================

export function useSession() {
  const [state, setState] = useState<SessionState>({
    isAuthenticated: null,
    isLoading: true,
    error: null,
    email: null,
    subscriptionStatus: "none",
    planType: null,
    remainingFreePrompts: null,
  });

  const inFlightRef = useRef<boolean>(false);
  const retryCountRef = useRef<number>(0);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unmountedRef = useRef<boolean>(false);

  // --------------------------------------------------------------------------
  // 🔁 Session-Check-Funktion
  //    background = true: kein globales Loading, nur stiller Refresh
  // --------------------------------------------------------------------------
  const checkSession = useCallback(
    async (opts: { background?: boolean; resetRetries?: boolean } = {}) => {
      if (unmountedRef.current) return;
      if (inFlightRef.current) return;

      const { background = false, resetRetries = false } = opts;

      if (resetRetries) {
        retryCountRef.current = 0;
        if (retryTimeoutRef.current) {
          clearTimeout(retryTimeoutRef.current);
          retryTimeoutRef.current = null;
        }
      }

      inFlightRef.current = true;
      if (!background) {
        setState((prev) => ({
          ...prev,
          isLoading: true,
          error: null,
        }));
      }

      try {
        const res = await fetchWithTimeout(
          `${API_BASE}/auth/session`,
          {
            method: "GET",
            credentials: "include", // 🔐 wichtige Option
            timeoutMs: 10000,
          },
        );

        if (!res.ok) {
          // Backend sagt "nicht ok" → als nicht eingeloggt behandeln
          if (unmountedRef.current) return;
          const isAuth = false;
          writeCachedSession(isAuth);
          setState({
            isAuthenticated: isAuth,
            isLoading: false,
            error: null,
            email: null,
            subscriptionStatus: "none",
            planType: null,
            remainingFreePrompts: null,
          });
          return;
        }

        const data = await res.json();
        const isAuth = parseSessionAuthenticated(data);
        const meta = extractSessionMeta(data);

        if (unmountedRef.current) return;

        writeCachedSession(isAuth);
        retryCountRef.current = 0;
        if (retryTimeoutRef.current) {
          clearTimeout(retryTimeoutRef.current);
          retryTimeoutRef.current = null;
        }

        setState({
          isAuthenticated: isAuth,
          isLoading: false,
          error: null,
          email: meta.email,
          subscriptionStatus: meta.subscriptionStatus,
          planType: meta.planType,
          remainingFreePrompts: meta.remainingFreePrompts,
        });
      } catch (err: any) {
        if (unmountedRef.current) return;

        const isTimeout = err?.name === "AbortError";

        // Auto-Retry nur bei Netzwerkproblemen / Timeout
        const currentRetries = retryCountRef.current;
        if (currentRetries < MAX_RETRIES) {
          const delay = Math.pow(2, currentRetries) * 1000; // 1s, 2s, 4s

          retryCountRef.current = currentRetries + 1;

          if (retryTimeoutRef.current) {
            clearTimeout(retryTimeoutRef.current);
          }

          retryTimeoutRef.current = setTimeout(() => {
            checkSession({ background: true });
          }, delay);
        }

        setState({
          isAuthenticated: false,
          isLoading: false,
          error: isTimeout
            ? "Session check timed out"
            : "Could not reach authentication service",
          email: null,
          subscriptionStatus: "none",
          planType: null,
          remainingFreePrompts: null,
        });
      } finally {
        inFlightRef.current = false;
      }
    },
    [],
  );

  // --------------------------------------------------------------------------
  // 🧠 Initiales Verhalten:
  //   1. Cache lesen → sofortiger Zustand (stale-while-revalidate)
  //   2. Hintergrund-Refresh starten
  // --------------------------------------------------------------------------
  useEffect(() => {
    unmountedRef.current = false;

    const cached = readCachedSession();
    const now = Date.now();

    if (cached && now - cached.updatedAt < MAX_CACHE_AGE_MS) {
      // Cache noch frisch → direkt anzeigen, aber im Hintergrund verifizieren
      setState((prev) => ({
        ...prev,
        isAuthenticated: cached.isAuthenticated,
        isLoading: false,
        error: null,
      }));
      checkSession({ background: true, resetRetries: true });
    } else {
      // Kein oder alter Cache → normaler Check mit Loading
      checkSession({ background: false, resetRetries: true });
    }

    return () => {
      unmountedRef.current = true;
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [checkSession]);

  // --------------------------------------------------------------------------
  // 📡 Multi-Tab Sync:
  //   - BroadcastChannel: direkte Kommunikation zwischen Tabs
  //   - storage-Event: Fallback, wenn BroadcastChannel nicht verfügbar
  //   - Wichtig: Wir broadcasten nur Gating-Infos (kein E-Mail)
// --------------------------------------------------------------------------
  useEffect(() => {
    if (typeof window === "undefined") return;

    let channel: BroadcastChannel | null = null;

    // Listener-Funktion
    const handleMessage = (payload: any) => {
      if (!payload) return;
      if (payload.type !== "mhgpt-session-changed") return;

      const data = payload.payload;
      if (!data) return;

      const isAuth = !!data.isAuthenticated;

      setState((prev) => ({
        ...prev,
        isAuthenticated: isAuth,
        subscriptionStatus:
          typeof data.subscriptionStatus === "string"
            ? (data.subscriptionStatus as SubscriptionStatus)
            : prev.subscriptionStatus,
        planType:
          typeof data.planType === "string"
            ? (data.planType as PlanType)
            : prev.planType,
        remainingFreePrompts:
          typeof data.remainingFreePrompts === "number"
            ? data.remainingFreePrompts
            : prev.remainingFreePrompts,
        error: null,
      }));
    };

    // BroadcastChannel (wenn verfügbar)
    if ("BroadcastChannel" in window) {
      channel = new BroadcastChannel("mhgpt-session");
      channel.onmessage = (event) => {
        handleMessage(event.data);
      };
    }

    // Fallback über storage-Event (nur Auth-Flag aus Cache)
    const storageHandler = (event: StorageEvent) => {
      if (event.key !== SESSION_CACHE_KEY) return;

      const cached = readCachedSession();
      if (!cached) return;

      setState((prev) => ({
        ...prev,
        isAuthenticated: cached.isAuthenticated,
        error: null,
      }));
    };

    window.addEventListener("storage", storageHandler);

    return () => {
      if (channel) {
        channel.close();
      }
      window.removeEventListener("storage", storageHandler);
    };
  }, []);

  // --------------------------------------------------------------------------
  // 🛰️ Broadcast unserer eigenen Änderungen (für andere Tabs)
// --------------------------------------------------------------------------
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (state.isAuthenticated === null) return;

    if (!("BroadcastChannel" in window)) return;

    const channel = new BroadcastChannel("mhgpt-session");
    channel.postMessage({
      type: "mhgpt-session-changed",
      payload: {
        isAuthenticated: state.isAuthenticated,
        subscriptionStatus: state.subscriptionStatus,
        planType: state.planType,
        remainingFreePrompts: state.remainingFreePrompts,
      },
    });
    channel.close();
  }, [state.isAuthenticated, state.subscriptionStatus, state.planType, state.remainingFreePrompts]);

  // --------------------------------------------------------------------------
  // 🔁 Öffentliche API – manueller Retry
  // --------------------------------------------------------------------------
  const refetch = useCallback(() => {
    checkSession({ background: false, resetRetries: true });
  }, [checkSession]);

  return {
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    email: state.email,
    subscriptionStatus: state.subscriptionStatus,
    planType: state.planType,
    remainingFreePrompts: state.remainingFreePrompts,
    refetch,
  };
}
