"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import QRCode from "react-qr-code";
import { getT } from "@/lib/i18n-runtime";
import Logo from "@/components/Logo";
import { useColorMode } from "@chakra-ui/color-mode";

const t = getT();

type SetupStatus = "idle" | "starting" | "waiting" | "completed" | "error";

type PasskeyFormProps = {
  email?: string;
  mode?: "setup" | "signin";
  onSuccess?: () => void;
};

const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.mentalhealth-gpt.ch"
).replace(/\/$/, "");

// 🔎 Saubere Email-Validierung
const isValidEmail = (email: string): boolean => {
  const trimmed = email.trim();
  if (!trimmed) return false;
  if (trimmed.length > 254) return false;

  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(trimmed);
};

const PasskeyForm = ({
  email: emailProp,
  mode = "setup",
  onSuccess,
}: PasskeyFormProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { colorMode } = useColorMode();
  const isLightMode = colorMode === "light";

  const emailFromQuery = searchParams.get("email") || "";
  const email = useMemo(
    () => (emailProp ?? emailFromQuery).trim(),
    [emailProp, emailFromQuery]
  );

  const [status, setStatus] = useState<SetupStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [mobileUrl, setMobileUrl] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const isWorking = status === "starting";

  // ✅ Guard: Autostart nur 1× (nur signin)
  const autoStartedRef = useRef(false);

  // ✅ Texte je nach Mode (kein UI-Redesign, nur korrekte Copy)
  const copy = useMemo(() => {
    if (mode === "signin") {
      return {
        title: t("passkey.signin.title") || t("passkey.setup.title"),
        body: t("passkey.signin.body") || t("passkey.setup.body"),
        forEmail: t("passkey.signin.for_email") || t("passkey.setup.for_email"),
        buttonStart:
          t("passkey.signin.button_start") || t("passkey.setup.button_start"),
        buttonWorking:
          t("passkey.signin.button_working") ||
          t("passkey.setup.button_working"),
        qrTitle: t("passkey.signin.qr.title") || t("passkey.setup.qr.title"),
        qrBody: t("passkey.signin.qr.body") || t("passkey.setup.qr.body"),
        qrHint: t("passkey.signin.qr.hint") || t("passkey.setup.qr.hint"),
        waiting:
          t("passkey.signin.status.waiting") ||
          t("passkey.setup.status.waiting"),
        success:
          t("passkey.signin.success.complete") ||
          t("passkey.setup.success.complete"),
        errGeneric:
          t("passkey.signin.error.generic") || t("passkey.setup.error.generic"),
        errTimeout:
          t("passkey.signin.error.timeout") || t("passkey.setup.error.timeout"),
        backPrefix:
          t("passkey.signin.back_to_signin.prefix") ||
          t("passkey.setup.back_to_signin.prefix"),
        backLink:
          t("passkey.signin.back_to_signin.link") ||
          t("passkey.setup.back_to_signin.link"),
        invalidEmail:
          t("sign-in.create.error.invalid_email") ||
          t("passkey.setup.error.generic"),
      };
    }

    // setup (default)
    return {
      title: t("passkey.setup.title"),
      body: t("passkey.setup.body"),
      forEmail: t("passkey.setup.for_email"),
      buttonStart: t("passkey.setup.button_start"),
      buttonWorking: t("passkey.setup.button_working"),
      qrTitle: t("passkey.setup.qr.title"),
      qrBody: t("passkey.setup.qr.body"),
      qrHint: t("passkey.setup.qr.hint"),
      waiting: t("passkey.setup.status.waiting"),
      success: t("passkey.setup.success.complete"),
      errGeneric: t("passkey.setup.error.generic"),
      errTimeout: t("passkey.setup.error.timeout"),
      backPrefix: t("passkey.setup.back_to_signin.prefix"),
      backLink: t("passkey.setup.back_to_signin.link"),
      invalidEmail: t("sign-in.create.error.invalid_email"),
    };
  }, [mode]);

  const handleStartPasskey = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!isValidEmail(email)) {
      setErrorMessage(copy.invalidEmail);
      setStatus("error");
      return;
    }

    try {
      setStatus("starting");

      // ✅ Best-of-class: Mode entscheidet den Start-Endpunkt
      const endpoint =
        mode === "signin"
          ? `${API_BASE}/auth/webauthn/cross-device/login/start`
          : `${API_BASE}/auth/webauthn/cross-device/start`;

      // ✅ Body: signin => nur email, setup => email + flow=register
      const body =
        mode === "signin" ? { email } : { email, flow: "register" as const };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        let payload: any = null;
        try {
          payload = await res.json();
        } catch {
          // ignore
        }

        console.error(
          mode === "signin"
            ? "cross-device/login/start failed"
            : "cross-device/start failed",
          payload || (await res.text().catch(() => ""))
        );

        setErrorMessage(copy.errGeneric);
        setStatus("error");
        return;
      }

      const data = await res.json();

      const sessionIdFromApi = data.session_id ?? data.sessionId;
      const mobileUrlFromApi = data.mobile_url ?? data.mobileUrl;

      if (!mobileUrlFromApi || !sessionIdFromApi) {
        console.error(
          mode === "signin"
            ? "cross-device/login/start missing fields"
            : "cross-device/start missing fields",
          data
        );
        setErrorMessage(copy.errGeneric);
        setStatus("error");
        return;
      }

      setMobileUrl(mobileUrlFromApi);
      setSessionId(sessionIdFromApi);
      setStatus("waiting");
    } catch (error) {
      console.error(
        mode === "signin"
          ? "Passkey cross-device/login/start error"
          : "Passkey cross-device/start error",
        error
      );
      setErrorMessage(copy.errGeneric);
      setStatus("error");
    }
  };

  // ✅ AUTO-START nur bei SIGNIN: keine zweite Interaktion nötig → QR kommt direkt
  useEffect(() => {
    if (mode !== "signin") return;
    if (autoStartedRef.current) return;
    if (status !== "idle") return;
    if (!email || !isValidEmail(email)) return;

    autoStartedRef.current = true;
    handleStartPasskey();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, status, email]);

  // 🛰️ Polling mit Exponential Backoff + Max Attempts
  useEffect(() => {
    if (status !== "waiting" || !sessionId) return;

    let cancelled = false;
    let attempt = 0;
    const maxAttempts = 30;

    const poll = async () => {
      if (cancelled || attempt >= maxAttempts) {
        if (!cancelled && attempt >= maxAttempts) {
          setErrorMessage(copy.errTimeout);
          setStatus("error");
        }
        return;
      }

      try {
        const res = await fetch(
          `${API_BASE}/auth/webauthn/cross-device/status?session_id=${encodeURIComponent(
            sessionId
          )}`
        );

        if (res.ok) {
          const data = await res.json();
          if (cancelled) return;

          if (data?.status === "completed") {
            setStatus("completed");
            setErrorMessage(null);
            setSuccessMessage(copy.success);
            return;
          }
        } else {
          console.warn("cross-device/status not ok", res.status);
        }
      } catch (err) {
        if (!cancelled) console.warn("cross-device/status error", err);
      }

      attempt += 1;
      const delay = Math.min(1000 * Math.pow(1.5, attempt), 10000);
      if (!cancelled) setTimeout(poll, delay);
    };

    poll();
    return () => {
      cancelled = true;
    };
  }, [status, sessionId, copy.errTimeout, copy.success]);

  // ✅ Nach Erfolg: setup → /sign-in, signin → onSuccess()
  useEffect(() => {
    if (status !== "completed") return;

    const timeoutId = setTimeout(() => {
      if (mode === "signin") onSuccess?.();
      else router.push("/sign-in");
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [status, router, mode, onSuccess]);

  return (
    <div className="w-full max-w-[31.5rem] m-auto">
      <Logo className="max-w-[11.875rem] mx-auto mb-6" dark={isLightMode} />

      <div className="mb-6 text-center">
        <h2 className="mb-2 h5 text-n-1">{copy.title}</h2>
        <p className="text-lg leading-relaxed text-n-1">{copy.body}</p>

        {email && (
          <p className="mt-2 text-base leading-relaxed text-n-1">
            {copy.forEmail} <span className="font-medium text-n-1">{email}</span>
          </p>
        )}
      </div>

      <div className="h-8 mb-3 flex justify-center items-center">
        {isWorking && (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-1 dark:border-primary-1/70" />
        )}
      </div>

      {/* Button bleibt (kein neues UI). Bei signin wird QR aber autostartend erscheinen. */}
      <button
        type="button"
        onClick={handleStartPasskey}
        className="btn-blue btn-large w-full mb-4"
        disabled={isWorking || status === "waiting"}
        aria-label={isWorking ? copy.buttonWorking : copy.buttonStart}
        aria-busy={isWorking}
      >
        {isWorking ? copy.buttonWorking : copy.buttonStart}
      </button>

      {mobileUrl && (
        <div className="mt-2 rounded-xl border border-n-3 bg-n-1/40 px-4 py-4 text-center caption1 dark:bg-n-7/60 dark:border-n-5">
          <div className="mb-2 font-semibold">{copy.qrTitle}</div>
          <div className="mb-4 text-n-4/80">{copy.qrBody}</div>
          <div className="flex justify-center">
            <div className="w-40 h-40 p-2 bg-white rounded flex items-center justify-center">
              <QRCode value={mobileUrl} className="w-full h-auto" />
            </div>
          </div>
          <div className="mt-3 text-n-4/70">{copy.qrHint}</div>
        </div>
      )}

      <div
        className="mt-4 space-y-2 text-center caption1"
        role="status"
        aria-live="polite"
      >
        {status === "waiting" && !successMessage && !errorMessage && (
          <div className="text-n-4/80">{copy.waiting}</div>
        )}

        {errorMessage && <div className="text-red-500">{errorMessage}</div>}

        {successMessage && (
          <div className="text-emerald-500 dark:text-emerald-400">
            {successMessage}
          </div>
        )}

        <div className="mt-4 text-n-4/80">
          {copy.backPrefix}{" "}
          <a className="text-primary-1 hover:text-primary-1/90" href="/sign-in">
            {copy.backLink}
          </a>
        </div>
      </div>
    </div>
  );
};

export default PasskeyForm;
