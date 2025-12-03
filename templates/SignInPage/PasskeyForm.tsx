"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import QRCode from "react-qr-code";
import { getT } from "@/lib/i18n-runtime";

const t = getT();

type SetupStatus = "idle" | "starting" | "waiting" | "completed" | "error";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://api.mentalhealth-gpt.ch"
).replace(/\/$/, "");

// 🔎 Saubere Email-Validierung
const isValidEmail = (email: string): boolean => {
  const trimmed = email.trim();
  if (!trimmed) return false;
  if (trimmed.length > 254) return false;

  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(trimmed);
};

const PasskeyForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const emailFromQuery = searchParams.get("email") || "";
  const email = useMemo(() => emailFromQuery.trim(), [emailFromQuery]);

  const [status, setStatus] = useState<SetupStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [mobileUrl, setMobileUrl] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const isWorking = status === "starting";

  const handleStartPasskey = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!isValidEmail(email)) {
      setErrorMessage(t("sign-in.create.error.invalid_email"));
      setStatus("error");
      return;
    }

    try {
      setStatus("starting");

      const res = await fetch(`${API_BASE}/auth/webauthn/mobile/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        let payload: any = null;
        try {
          payload = await res.json();
        } catch {
          // ignorieren, fallback auf text
        }

        console.error(
          "mobile/start failed",
          payload || (await res.text().catch(() => ""))
        );
        setErrorMessage(t("passkey.setup.error.generic"));
        setStatus("error");
        return;
      }

      const data = await res.json();

      if (!data?.mobileUrl || !data?.sessionId) {
        console.error("mobile/start missing fields", data);
        setErrorMessage(t("passkey.setup.error.generic"));
        setStatus("error");
        return;
      }

      setMobileUrl(data.mobileUrl);
      setSessionId(data.sessionId);
      setStatus("waiting");
    } catch (error) {
      console.error("Passkey mobile/start error", error);
      setErrorMessage(t("passkey.setup.error.generic"));
      setStatus("error");
    }
  };

  // 🛰️ Polling mit Exponential Backoff + Max Attempts
  useEffect(() => {
    if (status !== "waiting" || !sessionId) return;

    let cancelled = false;
    let attempt = 0;
    const maxAttempts = 30; // ~ einige Minuten, je nach Backoff

    const poll = async () => {
      if (cancelled || attempt >= maxAttempts) {
        if (!cancelled && attempt >= maxAttempts) {
          setErrorMessage(t("passkey.setup.error.timeout"));
          setStatus("error");
        }
        return;
      }

      try {
        const res = await fetch(
          `${API_BASE}/auth/webauthn/mobile/status?sessionId=${encodeURIComponent(
            sessionId
          )}`
        );

        if (res.ok) {
          const data = await res.json();
          if (cancelled) return;

          if (data?.status === "completed") {
            setStatus("completed");
            setErrorMessage(null);
            setSuccessMessage(t("passkey.setup.success.complete"));
            return;
          }
        } else {
          console.warn("mobile/status not ok", res.status);
        }
      } catch (err) {
        if (!cancelled) {
          console.warn("mobile/status error", err);
        }
      }

      attempt += 1;
      const delay = Math.min(1000 * Math.pow(1.5, attempt), 10000);

      if (!cancelled) {
        setTimeout(poll, delay);
      }
    };

    poll();

    return () => {
      cancelled = true;
    };
  }, [status, sessionId]);

  // ✅ Nach erfolgreichem Setup automatisch zur Sign-in-Seite
  useEffect(() => {
    if (status !== "completed") return;

    const timeoutId = setTimeout(() => {
      router.push("/sign-in");
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [status, router]);

  return (
    <div className="w-full max-w-[31.5rem] m-auto">
      {/* Kopfbereich – Erklärung */}
      <div className="mb-6 text-center">
        <h2 className="mb-2 h5 text-n-7 dark:text-n-1">
          {t("passkey.setup.title")}
        </h2>
        <p className="text-sm text-n-4/80">
          {t("passkey.setup.body")}
        </p>
        {email && (
          <p className="mt-2 text-xs text-n-4/70">
            {t("passkey.setup.for_email")}{" "}
            <span className="font-medium text-n-7 dark:text-n-1">
              {email}
            </span>
          </p>
        )}
      </div>

      {/* Spinner-Bereich – reservierter Platz, kein Layout-Sprung */}
      <div className="h-8 mb-3 flex justify-center items-center">
        {isWorking && (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-1 dark:border-primary-1/70" />
        )}
      </div>

      {/* Haupt-Button */}
      <button
        type="button"
        onClick={handleStartPasskey}
        className="btn-blue btn-large w-full mb-4"
        disabled={isWorking || status === "waiting"}
        aria-label={
          isWorking
            ? t("passkey.setup.button_working")
            : t("passkey.setup.button_start")
        }
        aria-busy={isWorking}
      >
        {isWorking
          ? t("passkey.setup.button_working")
          : t("passkey.setup.button_start")}
      </button>

      {/* QR-Code-Bereich */}
      {mobileUrl && (
        <div className="mt-2 rounded-xl border border-n-3 bg-n-1/40 px-4 py-4 text-center caption1 dark:bg-n-7/60 dark:border-n-5">
          <div className="mb-2 font-semibold">
            {t("passkey.setup.qr.title")}
          </div>
          <div className="mb-4 text-n-4/80">
            {t("passkey.setup.qr.body")}
          </div>
          <div className="flex justify-center">
            <div className="w-40 h-40 p-2 bg-white rounded flex items-center justify-center">
              <QRCode value={mobileUrl} className="w-full h-auto" />
            </div>
          </div>
          <div className="mt-3 text-n-4/70">
            {t("passkey.setup.qr.hint")}
          </div>
        </div>
      )}

      {/* Status-/Fehler-/Erfolgs-Meldungen – Screenreader-freundlich */}
      <div
        className="mt-4 space-y-2 text-center caption1"
        role="status"
        aria-live="polite"
      >
        {status === "waiting" && !successMessage && !errorMessage && (
          <div className="text-n-4/80">
            {t("passkey.setup.status.waiting")}
          </div>
        )}

        {errorMessage && (
          <div className="text-red-500">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="text-emerald-600 dark:text-emerald-400">
            {successMessage}
          </div>
        )}
      </div>

      {/* Fallback-Link zurück zur Sign-in-Seite */}
      <div className="mt-6 text-center text-xs text-n-4/70">
        {t("passkey.setup.back_to_signin.prefix")}{" "}
        <button
          type="button"
          onClick={() => router.push("/sign-in")}
          className="underline underline-offset-2 hover:text-n-7 dark:hover:text-n-1"
        >
          {t("passkey.setup.back_to_signin.link")}
        </button>
      </div>
    </div>
  );
};

export default PasskeyForm;
