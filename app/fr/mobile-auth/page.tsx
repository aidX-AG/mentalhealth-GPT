"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { startRegistration } from "@simplewebauthn/browser";
import { loadMessages, makeT } from "@/lib/i18n-static";

// API-Base für Production (kommt aus env)
const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://api.mentalhealth-gpt.ch"
).replace(/\/$/, "");

// Timeout-Helfer für Fetch (Health-Grade)
async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit = {},
  timeoutMs = 30_000,
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(input, {
      ...init,
      signal: controller.signal,
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
  // 🔤 i18n wie in deinen anderen Pages
  const messages = loadMessages("fr");
  const t = makeT(messages);

  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") || "";

  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

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
      setStatusMessage(t("passkey.mobile.status.loading_options"));

      const optionsUrl = `${API_BASE}/auth/webauthn/cross-device/options?session_id=${encodeURIComponent(
        sessionId,
      )}`;

      let res: Response;

      try {
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

      if (data.status !== "ok" || !data.registration_options) {
        setErrorMessage(t("passkey.mobile.error.invalid_or_expired"));
        setPhase("error");
        setLoading(false);
        return;
      }

      // 2) Passkey erstellen (WebAuthn)
      setPhase("awaitingBiometric");
      setStatusMessage(t("passkey.mobile.status.awaiting_biometric"));

      let attestationResponse;
      try {
        attestationResponse = await startRegistration(
          data.registration_options,
        );
      } catch (err: any) {
        console.error("MobileAuth startRegistration error:", err);
        setErrorMessage(t("passkey.mobile.error.registration_failed"));
        setPhase("error");
        setLoading(false);
        return;
      }

      // 3) Ergebnis an Backend senden
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
            body: JSON.stringify({
              session_id: sessionId,
              attestationResponse,
            }),
          },
          30_000,
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
  }, [sessionId, t]);

  // Initialer Start beim Laden
  useEffect(() => {
    if (!sessionId) {
      setErrorMessage(t("passkey.mobile.error.no_session"));
      return;
    }
    runFlow();
  }, [sessionId, runFlow, t]);

  // Retry-Handler
  const handleRetry = () => {
    if (!sessionId) return;
    runFlow();
  };

  const showRetry =
    phase === "error" && !!sessionId && !completed;

  return (
    <div className="w-full max-w-md mx-auto mt-10 p-6 rounded-xl bg-white dark:bg-n-7 shadow-lg">
      <h1 className="text-xl font-semibold mb-4 text-center">
        {t("passkey.mobile.title")}
      </h1>

      {/* Spinner + Status */}
      {loading && (
        <div className="flex flex-col items-center gap-2 mb-4">
          <div className="h-6 w-6 rounded-full border-2 border-n-4 border-t-transparent animate-spin" />
          <div className="text-center text-sm text-n-4">
            {statusMessage ||
              t("passkey.mobile.status.loading_generic")}
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
