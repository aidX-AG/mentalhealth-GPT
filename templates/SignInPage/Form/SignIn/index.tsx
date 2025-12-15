"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Field from "@/components/Field";
import PasskeyForm from "../../PasskeyForm";
import { getT } from "@/lib/i18n-runtime";

const t = getT();

type SignInProps = {
  usernamePlaceholder: string;
  passwordPlaceholder: string;
  forgotPasswordLabel: string;
  submitLabel: string;
};

const SignIn = ({
  usernamePlaceholder,
  passwordPlaceholder,
  forgotPasswordLabel,
  submitLabel,
}: SignInProps) => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPasskey, setShowPasskey] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage("missing_credentials");
      return;
    }

    try {
      setIsLoading(true);

      const apiBase =
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "https://api.mentalhealth-gpt.ch";

      const res = await fetch(
        `${apiBase.replace(/\/$/, "")}/auth/login-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      if (!res.ok) {
        setErrorMessage("invalid_credentials");
        setIsLoading(false);
        return;
      }

      // ✅ Credentials korrekt → jetzt Passkey erzwingen
      setShowPasskey(true);
      setIsLoading(false);
    } catch (err) {
      console.error("login error", err);
      setErrorMessage("login_failed");
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Field
          className="mb-4"
          classInput="dark:bg-n-7 dark:border-n-7 dark:focus:bg-transparent"
          placeholder={usernamePlaceholder}
          icon="email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          required
        />

        <Field
          className="mb-2"
          classInput="dark:bg-n-7 dark:border-n-7 dark:focus:bg-transparent"
          placeholder={passwordPlaceholder}
          icon="lock"
          type="password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          required
        />

        <button
          type="button"
          className="mb-6 base2 text-primary-1 transition-colors hover:text-primary-1/90"
        >
          {forgotPasswordLabel}
        </button>

        <button
          className="btn-blue btn-large w-full"
          type="submit"
          disabled={isLoading || showPasskey}
        >
          {submitLabel}
        </button>
      </form>

      {/* 🔐 Passkey Schritt – erscheint DIREKT darunter */}
      {showPasskey && (
        <div className="mt-6">
          <PasskeyForm
            email={email}
            mode="signin"
            onSuccess={() => {
              // ✅ Nach erfolgreichem Passkey → Startseite
              router.push("/");
            }}
          />
        </div>
      )}

      {errorMessage && (
        <div className="mt-4 text-sm text-red-500 text-center">
          {errorMessage === "missing_credentials"
            ? t("sign-in.error.missing_credentials")
            : errorMessage === "invalid_credentials"
              ? t("sign-in.error.invalid_credentials")
              : t("sign-in.error.login_failed")}
        </div>
      )}
    </>
  );
};

export default SignIn;
