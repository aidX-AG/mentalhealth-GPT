"use client";

import { useState } from "react";
import Field from "@/components/Field";
import { getT } from "@/lib/i18n-runtime";

const t = getT();

type SignInProps = {
  onClick: () => void;                 // Forgot password
  usernamePlaceholder: string;         // "Username or email"
  passwordPlaceholder: string;         // "Password"
  forgotPasswordLabel: string;         // "Forgot password?"
  submitLabel: string;                 // "Sign in with mentalhealthGPT"
};

const SignIn = ({
  onClick,
  usernamePlaceholder,
  passwordPlaceholder,
  forgotPasswordLabel,
  submitLabel,
}: SignInProps) => {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!name || !password) {
      setError(t("sign-in.error.missing_credentials"));
      return;
    }

    try {
      setIsLoading(true);

      const apiBase =
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "https://api.mentalhealth-gpt.ch";

      const endpoint = `${apiBase.replace(/\/$/, "")}/auth/login-email`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: name,
          password,
        }),
      });

      if (!res.ok) {
        setError(t("sign-in.error.login_failed"));
        setIsLoading(false);
        return;
      }

      // Erfolg → Session-Cookie wird gesetzt
      // Redirect erfolgt später zentral (z.B. via session-check)
      setIsLoading(false);
    } catch (err) {
      console.error("Login request error", err);
      setError(t("sign-in.error.technical"));
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Field
        className="mb-4"
        classInput="dark:bg-n-7 dark:border-n-7 dark:focus:bg-transparent"
        placeholder={usernamePlaceholder}
        icon="email"
        value={name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setName(e.target.value)
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
        className="mb-6 base2 text-primary-1 transition-colors hover:text-primary-1/90"
        type="button"
        onClick={onClick}
      >
        {forgotPasswordLabel}
      </button>

      {error && (
        <div className="mb-4 text-sm text-red-500 text-center">
          {error}
        </div>
      )}

      <button
        className="btn-blue btn-large w-full"
        type="submit"
        disabled={isLoading}
        aria-busy={isLoading}
      >
        {isLoading
          ? t("sign-in.button.loading")
          : submitLabel}
      </button>
    </form>
  );
};

export default SignIn;
