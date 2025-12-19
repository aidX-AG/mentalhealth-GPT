// ============================================================================
// 📱 Mobile Passkey Flow — Cross-Device Login/Register (Health-Grade, Cookie-Safe)
// Datei: app/mobile-auth/page.tsx
// Version: v1.0.1 — 2025-12-18
//
// CHANGELOG v1.0.1
// - ✅ CRITICAL: Passkey-Verify fetch() calls senden jetzt credentials: "include"
//   → damit akzeptiert der Browser das Set-Cookie (mhgpt_session) vom API-Host.
// - ✅ CRITICAL: fetchWithTimeout() setzt cache: "no-store" nur als Default,
//   aber überschreibt NICHT mehr bewusst gesetzte init.cache Werte.
//
// NOTE (wichtig):
// - Sonst KEINE Logik-/UI-Änderungen. Nur die minimal nötigen Punkte.
// ============================================================================

"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { startRegistration, startAuthentication } from "@simplewebauthn/browser";
import { loadMessages, makeT } from "@/lib/i18n-static";

// API-Base für Production (kommt aus env)
const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.mentalhealth-gpt.ch"
).replace(/\/$/, "");

// Timeout-Helfer für Fetch (Health-Grade)
async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit = {},
  timeoutMs = 30_000
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(input, {
      ...init,
      signal: controller.signal,

      // ✅ Health-Grade Default: nur setzen, wenn init.cache NICHT definiert ist
      //    (damit überschreiben wir keine bewusst gesetzten Werte)
      cache: init.cache ?? "no-store",
    });
    return res;
  } finally {
    clearTimeout(id);
  }
}

type Phase =
  | "idle"
  | "loadingOptions"
  | "awaitingBiometric"
  | "verifying"
  | "success"
  | "error";

export default function Page() {
  const pathname = usePathname();

  const locale = useMemo((): string => {
    const path = pathname || "";

    // 1) Priorität: Sprache aus dem URL-Pfad
    if (path.startsWith("/de/")) return "de";
    if (path.startsWith("/fr/")) return "fr";
    if (path.startsWith("/es/")) return "es";

    // 2) Fallback: Browser-Sprache (nur für Basispfade ohne Präfix)
    const browserLang =
      typeof navigator !== "undefined"
        ? navigator.language?.split("-")[0] || "en"
        : "en";

    const supported = ["de", "fr", "es", "en"];
    return supported.includes(browserLang) ? browserLang : "en";
  }, [pathname]);

  // 🔤 i18n wie in deinen anderen Pages
  const messages = loadMessages(locale);
  const t = makeT(messages);

  const searchParams = useSearchParams();

  // Backend kommt mit ?session_id=... im mobile_url
  const sessionId =
    searchParams.get("session_id") ?? searchParams.get("sessionId") ?? "";

  // ✅ PROFESSIONAL: Flow deterministisch aus URL (mobile_url enthält ?flow=login)
  //    - verhindert "Setup-UI" beim Login-Link
  //    - Backend darf weiter data.flow liefern, aber UI bleibt konsistent
  const urlFlowRaw = (searchParams.get("flow") ?? "").toLowerCase();
  const urlFlow: "login" | "register" =
    urlFlowRaw === "login" ? "login" : "register";

  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  // ✅ Health-Super-Guard: Flow nur 1× starten
  const startedRef = useRef(false);

  // ✅ NEU: iOS/Safari braucht User-Geste → Flow erst nach Button
  const [awaitingUserGesture, setAwaitingUserGesture] = useState(true);

  // Zentraler Flow: Optionen holen → Passkey erstellen → Verify
  const runFlow = useCallback(async () => {
    if (!sessionId) {
      setErrorMessage(t("passkey.mobile.error.no_session"));
      return;
    }

    try {
      setErrorMessage(null);
      setStatusMessage(null);
      setCompleted(false);
      setLoading(true);

      // 1) Optionen laden
      setPhase("loadingOptions");

      // ✅ Flow-spezifischer Status-Text (kein "Setup" beim Login)
      setStatusMessage(
        urlFlow === "login"
          ? t("passkey.signin.status.waiting")
          : t("passkey.mobile.status.loading_options")
      );

      const optionsUrl = `${API_BASE}/auth/webauthn/cross-device/options?session_id=${encodeURIComponent(
        sessionId
      )}`;

      let res: Response;

      try {
        // (unverändert) Options-Call braucht kein Cookie-Write
        res = await fetchWithTimeout(optionsUrl, {}, 30_000);
      } catch (err: any) {
        if (err?.name === "AbortError") {
          setErrorMessage(t("passkey.mobile.error.timeout_options"));
        } else {
          setErrorMessage(t("passkey.mobile.error.options_failed"));
        }
        setPhase("error");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setErrorMessage(t("passkey.mobile.error.options_failed"));
        setPhase("error");
        setLoading(false);
        return;
      }

      const data = await res.json();

      // ✅ PROFESSIONAL: Flow-Entscheid ist URL-first (deterministisch),
      //    Backend darf "login" liefern, aber UI darf nicht falsch sein.
      const flow: "login" | "register" =
        data?.flow === "login" || urlFlow === "login" ? "login" : "register";

      const registrationOptions = data?.registration_options;
      const assertionOptions = data?.assertion_options;

      if (flow === "login") {
        if (!assertionOptions) {
          setErrorMessage(t("passkey.signin.error.timeout"));
          setPhase("error");
          setLoading(false);
          return;
        }

        // 2) Passkey Login (WebAuthn) — MUSS aus User-Geste kommen
        setPhase("awaitingBiometric");
        setStatusMessage(t("passkey.signin.status.waiting"));

        let assertionResponse;
        try {
          assertionResponse = await startAuthentication(assertionOptions);
        } catch (err: any) {
          console.error("MobileAuth startAuthentication error:", err);
          setErrorMessage(t("passkey.signin.error.verify_failed"));
          setPhase("error");
          setLoading(false);
          return;
        }

        // 3) Ergebnis an Backend senden (Login)
        setPhase("verifying");
        setStatusMessage(t("passkey.mobile.login.status.verifying"));

        let verifyRes: Response;

        try {
          verifyRes = await fetchWithTimeout(
            `${API_BASE}/auth/webauthn/assertion/verify`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },

              // ✅ CRITICAL: Damit Browser Set-Cookie vom API-Host akzeptiert
              credentials: "include",

              body: JSON.stringify({
                session_id: sessionId,
                assertionResponse,
              }),
            },
            30_000
          );
        } catch (err: any) {
          if (err?.name === "AbortError") {
            setErrorMessage(t("passkey.signin.error.timeout"));
          } else {
            setErrorMessage(t("passkey.signin.error.verify_failed"));
          }
          setPhase("error");
          setLoading(false);
          return;
        }

        if (!verifyRes.ok) {
          setErrorMessage(t("passkey.signin.error.verify_failed"));
          setPhase("error");
          setLoading(false);
          return;
        }

        const verifyData = await verifyRes.json();

        if (!verifyData.success) {
          setErrorMessage(t("passkey.signin.error.verify_failed"));
          setPhase("error");
          setLoading(false);
          return;
        }

        // 4) Erfolgreich
        setCompleted(true);
        setPhase("success");
        setStatusMessage(t("passkey.mobile.login.success"));
        setLoading(false);
        return;
      }

      // register
      if (!registrationOptions) {
        setErrorMessage(t("passkey.mobile.error.invalid_or_expired"));
        setPhase("error");
        setLoading(false);
        return;
      }

      // 2) Passkey erstellen (WebAuthn) — MUSS aus User-Geste kommen
      setPhase("awaitingBiometric");
      setStatusMessage(t("passkey.mobile.status.awaiting_biometric"));

      let attestationResponse;
      try {
        attestationResponse = await startRegistration(registrationOptions);
      } catch (err: any) {
        console.error("MobileAuth startRegistration error:", err);
        setErrorMessage(t("passkey.mobile.error.registration_failed"));
        setPhase("error");
        setLoading(false);
        return;
      }

      // 3) Ergebnis an Backend senden (Register)
      setPhase("verifying");
      setStatusMessage(t("passkey.mobile.status.verifying"));

      let verifyRes: Response;

      try {
        verifyRes = await fetchWithTimeout(
          `${API_BASE}/auth/webauthn/cross-device/verify`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },

            // ✅ CRITICAL: Auch hier Cookie-Write erlauben (Set-Cookie)
            credentials: "include",

            body: JSON.stringify({
              session_id: sessionId,
              attestationResponse,
            }),
          },
          30_000
        );
      } catch (err: any) {
        if (err?.name === "AbortError") {
          setErrorMessage(t("passkey.mobile.error.timeout_verify"));
        } else {
          setErrorMessage(t("passkey.mobile.error.verify_failed"));
        }
        setPhase("error");
        setLoading(false);
        return;
      }

      if (!verifyRes.ok) {
        setErrorMessage(t("passkey.mobile.error.verify_failed"));
        setPhase("error");
        setLoading(false);
        return;
      }

      const verifyData = await verifyRes.json();

      if (!verifyData.success) {
        setErrorMessage(t("passkey.mobile.error.verify_failed"));
        setPhase("error");
        setLoading(false);
        return;
      }

      // 4) Erfolgreich
      setCompleted(true);
      setPhase("success");
      setStatusMessage(t("passkey.mobile.success"));
      setLoading(false);
    } catch (err) {
      console.error("MobileAuth unexpected error:", err);
      setErrorMessage(t("passkey.mobile.error.unknown"));
      setPhase("error");
      setLoading(false);
    }
  }, [sessionId, t, urlFlow]);

  // ⚠️ WICHTIG: KEIN Auto-Start mehr (sonst flackert iOS weg)
  useEffect(() => {
    if (!sessionId) {
      setErrorMessage(t("passkey.mobile.error.no_session"));
      return;
    }
  }, [sessionId, t]);

  const handleStart = () => {
    if (!sessionId) {
      setErrorMessage(t("passkey.mobile.error.no_session"));
      return;
    }

    // Start nur 1×
    if (startedRef.current) return;
    startedRef.current = true;

    setAwaitingUserGesture(false);
    runFlow();
  };

  // Retry-Handler
  const handleRetry = () => {
    if (!sessionId) return;

    startedRef.current = false;
    setAwaitingUserGesture(true);

    setPhase("idle");
    setStatusMessage(null);
    setErrorMessage(null);
    setCompleted(false);
    setLoading(false);
  };

  const showRetry = phase === "error" && !!sessionId && !completed;

  return (
    <div className="w-full max-w-md mx-auto mt-10 p-6 rounded-xl bg-white dark:bg-n-7 shadow-lg">
      <h1 className="text-xl font-semibold mb-4 text-center">
        {urlFlow === "login"
          ? t("passkey.signin.title")
          : t("passkey.mobile.title")}
      </h1>

      {/* ✅ NEU: User-Geste erforderlich */}
      {awaitingUserGesture && !completed && (
        <div className="mb-4 text-center">
          <div className="text-sm text-n-4 mb-3">
            {urlFlow === "login"
              ? t("passkey.signin.status.waiting")
              : t("passkey.mobile.status.awaiting_biometric")}
          </div>
          <button
            type="button"
            onClick={handleStart}
            className="px-4 py-2 text-sm rounded-lg bg-primary-1 text-white hover:bg-primary-1/90 w-full"
          >
            {urlFlow === "login"
              ? t("passkey.signin.mobile.button_continue")
              : t("passkey.mobile.action.start")}
          </button>
        </div>
      )}

      {/* Spinner + Status */}
      {loading && (
        <div className="flex flex-col items-center gap-2 mb-4">
          <div className="h-6 w-6 rounded-full border-2 border-n-4 border-t-transparent animate-spin" />
          <div className="text-center text-sm text-n-4">
            {statusMessage || t("passkey.mobile.status.loading_generic")}
          </div>
        </div>
      )}

      {!loading && statusMessage && !errorMessage && (
        <div className="text-center text-sm text-emerald-600 dark:text-emerald-400 mb-4">
          {statusMessage}
        </div>
      )}

      {errorMessage && (
        <div className="text-center text-sm text-red-500 mb-4">
          {errorMessage}
        </div>
      )}

      {completed && (
        <div className="text-center text-sm mt-3 text-n-6 dark:text-n-3">
          {t("passkey.mobile.success_close_window")}
        </div>
      )}

      {showRetry && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={handleRetry}
            className="px-4 py-2 text-sm rounded-lg border border-n-4 hover:bg-n-1/60 dark:border-n-5 dark:hover:bg-n-6"
          >
            {t("passkey.mobile.action.retry")}
          </button>
        </div>
      )}
    </div>
  );
}
