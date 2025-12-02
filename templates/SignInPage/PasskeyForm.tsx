"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { getT } from "@/lib/i18n-runtime";

const t = getT();

// Zentrale API-Basis, trailing Slash wird entfernt
const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://api.mentalhealth-gpt.ch"
).replace(/\/$/, "");

// Hilfsfunktionen für Base64URL ⇆ ArrayBuffer
const base64UrlToUint8Array = (base64Url: unknown): Uint8Array => {
  if (typeof base64Url !== "string") {
    console.error("Expected base64url string for WebAuthn, got:", base64Url);
    return new Uint8Array();
  }

  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const padLength = (4 - (base64.length % 4)) % 4;
  const padded = base64 + "=".repeat(padLength);
  const binary = typeof window !== "undefined" ? atob(padded) : "";
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

const bufferToBase64Url = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
};

const PasskeyForm = () => {
  const [isWorking, setIsWorking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");

  const handleStartPasskey = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email) {
      setErrorMessage(t("passkey.setup.error.generic"));
      return;
    }

    if (
      typeof window === "undefined" ||
      typeof PublicKeyCredential === "undefined"
    ) {
      setErrorMessage(t("passkey.setup.error.generic"));
      return;
    }

    setIsWorking(true);

    try {
      // 1) Registrierung-Optionen vom Backend holen
      const optionsRes = await fetch(`${API_BASE}/auth/webauthn/register-options`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!optionsRes.ok) {
        console.error("register-options failed", await optionsRes.text());
        setErrorMessage(t("passkey.setup.error.generic"));
        return;
      }

      const optionsJson: any = await optionsRes.json();
      const publicKey: any = optionsJson.publicKey ?? optionsJson;

      // 2) Base64URL-Felder in ArrayBuffer wandeln
      const challengeBytes = base64UrlToUint8Array(publicKey.challenge);
      if (!challengeBytes.length) {
        setErrorMessage(t("passkey.setup.error.generic"));
        return;
      }
      publicKey.challenge = challengeBytes;

      if (publicKey.user && typeof publicKey.user.id === "string") {
        publicKey.user.id = base64UrlToUint8Array(publicKey.user.id);
      }

      if (Array.isArray(publicKey.excludeCredentials)) {
        publicKey.excludeCredentials = publicKey.excludeCredentials.map(
          (cred: any) => ({
            ...cred,
            id:
              typeof cred.id === "string"
                ? base64UrlToUint8Array(cred.id)
                : cred.id,
          })
        );
      }

      // 3) WebAuthn im Browser starten
      const credential = (await navigator.credentials.create({
        publicKey,
      })) as PublicKeyCredential | null;

      if (!credential) {
        setErrorMessage(t("passkey.setup.error.generic"));
        return;
      }

      const response = credential.response as AuthenticatorAttestationResponse;

      const finishPayload = {
        email,
        id: credential.id,
        rawId: bufferToBase64Url(credential.rawId),
        type: credential.type,
        response: {
          clientDataJSON: bufferToBase64Url(response.clientDataJSON),
          attestationObject: bufferToBase64Url(response.attestationObject),
        },
        clientExtensionResults:
          credential.getClientExtensionResults?.() ?? {},
      };

      // 4) Ergebnis an Backend zurücksenden
      const finishRes = await fetch(`${API_BASE}/auth/webauthn/register-finish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finishPayload),
      });

      if (!finishRes.ok) {
        console.error("register-finish failed", await finishRes.text());
        setErrorMessage(t("passkey.setup.error.generic"));
        return;
      }

      // ✅ Erfolg: Meldung + Redirect zurück zum Login
      setSuccessMessage(t("passkey.setup.success.complete"));

      setTimeout(() => {
        router.push("/sign-in");
      }, 2000);
    } catch (error) {
      console.error("WebAuthn-Setup error", error);

      // Spezifischere UX für abgebrochene Vorgänge
      if (error instanceof DOMException) {
        if (error.name === "NotAllowedError") {
          setErrorMessage(t("passkey.setup.error.user_cancelled"));
          setIsWorking(false);
          return;
        }
        if (error.name === "SecurityError") {
          setErrorMessage(t("passkey.setup.error.security"));
          setIsWorking(false);
          return;
        }
      }

      setErrorMessage(t("passkey.setup.error.generic"));
    } finally {
      setIsWorking(false);
    }
  };

  return (
    <div className="w-full max-w-[31.5rem] m-auto">
      <div className="mb-6">
        <h1 className="h4 mb-2">{t("passkey.setup.title")}</h1>
        <p className="body2 text-n-4">
          {t("passkey.setup.subtitle")}
        </p>
        {email && (
          <p className="mt-2 caption1 text-n-4/70">
            {email}
          </p>
        )}
      </div>

      {/* Spinner bei laufendem Prozess */}
      {isWorking && (
        <div className="flex justify-center mb-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-n-4" />
        </div>
      )}

      {/* Spinner-Bereich */}
      <div className="h-8 mb-3 flex justify-center items-center">
        {isWorking && (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-1 dark:border-primary-1/70" />
        )}
      </div>

      <button
        type="button"
        onClick={handleStartPasskey}
        className="btn-blue btn-large w-full mb-3"
        disabled={isWorking}
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

      {errorMessage && (
        <div className="mb-3 text-center caption1 text-red-500">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="mb-3 text-center caption1 text-emerald-600">
          {successMessage}
        </div>
      )}

      <p className="mt-6 text-center text-xs text-n-4/60">
        <Link href="/sign-in" className="underline">
          {t("passkey.setup.back_to_sign_in")}
        </Link>
      </p>
    </div>
  );
};

export default PasskeyForm;
