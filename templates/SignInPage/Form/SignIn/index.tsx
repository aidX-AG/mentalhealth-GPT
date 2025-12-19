"use client";

import { useState } from "react";
import Field from "@/components/Field";
import { getT } from "@/lib/i18n-runtime";
import { useRouter } from "next/navigation";

const t = getT();

type SignInProps = {
  onForgotPassword: () => void;
  usernamePlaceholder: string;
  passwordPlaceholder: string;
  forgotPasswordLabel: string;
  submitLabel: string;
};

const SignIn = ({
  onForgotPassword,
  usernamePlaceholder,
  passwordPlaceholder,
  forgotPasswordLabel,
  submitLabel,
}: SignInProps) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

      const res = await fetch(`${apiBase.replace(/\/$/, "")}/auth/login-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!res.ok) {
        setErrorMessage("invalid_credentials");
        setIsLoading(false);
        return;
      }

      // ✅ Login erfolgreich → weiterer Flow passiert außerhalb
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
          onClick={onForgotPassword}
        >
          {forgotPasswordLabel}
        </button>

        <button
          type="button"
          className="btn-blue btn-large w-full"
          onClick={() =>
            router.push(`/passkey-signin?email=${encodeURIComponent(email)}`)
          }
          disabled={isLoading}
        >
          {submitLabel}
        </button>
      </form>

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
