import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Field from "@/components/Field";
import { getT } from "@/lib/i18n-runtime";
const t = getT();

type CreateAccountProps = {
  emailPlaceholder: string; // "Email"
  passwordPlaceholder: string; // "Password"
  submitLabel: string; // "Create Account"
  tosPrefix: string; // "By creating an account, you agree to our "
  tosLabel: string; // "Terms of Service"
  andLabel: string; // "and"
  privacyLabel: string; // "Privacy & Cookie Statement"
  tosHref?: string;
  privacyHref?: string;
};

const CreateAccount = ({
  emailPlaceholder,
  passwordPlaceholder,
  submitLabel,
  tosPrefix,
  tosLabel,
  andLabel,
  privacyLabel,
  tosHref = "/",
  privacyHref = "/",
}: CreateAccountProps) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const feedbackRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const scrollToFeedback = () => {
    if (feedbackRef.current) {
      feedbackRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setErrorMessage(null);
    setSignupSuccess(false);

    // 🛡️ Client-seitige Minimal-Validierung
    if (password.length < 12) {
      setErrorMessage(
        t("sign-in.create.error.password_too_short")
      );
      scrollToFeedback();
      return;
    }

    try {
      const apiBase =
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "https://api.mentalhealth-gpt.ch";

      const endpoint = `${apiBase.replace(/\/$/, "")}/auth/signup-email`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("Signup failed", text);

        let parsed: any = null;
        try {
          parsed = JSON.parse(text);
        } catch {
          parsed = null;
        }

        if (parsed?.error === "email_already_registered") {
          setErrorMessage(
            t("sign-in.create.error.email_already_registered")
          );
        } else if (parsed?.error === "password_too_weak") {
          // minLength kommt aus dem Backend, UI-Text bleibt über Key steuerbar
          setErrorMessage(
            t("sign-in.create.error.password_too_weak")
          );
        } else {
          setErrorMessage(
            t("sign-in.create.error.generic")
          );
        }

        scrollToFeedback();
        return;
      }

      console.log("Signup successful");
      setSignupSuccess(true);
      scrollToFeedback();
    } catch (error) {
      console.error("Signup request error", error);
      setErrorMessage(
        t("sign-in.create.error.technical")
      );
      scrollToFeedback();
    }
  };

  const handleWebAuthnSetup = () => {
    if (!email) {
      setErrorMessage(t("sign-in.create.error.technical"));
      return;
    }

    // Extra-Sicherheit & UX: Email minimal validieren
    const trimmedEmail = email.trim();
    if (!trimmedEmail.includes("@") || trimmedEmail.length < 3) {
      setErrorMessage(t("sign-in.create.error.invalid_email"));
      return;
    }

    // Email für URL encodieren
    const encodedEmail = encodeURIComponent(trimmedEmail);
    router.push(`/passkey-setup?email=${encodedEmail}`);
  };

  return (
    <form action="" onSubmit={handleSubmit}>
      <Field
        className="mb-4"
        classInput="dark:bg-n-7 dark:border-n-7 dark:focus:bg-transparent"
        placeholder={emailPlaceholder}
        icon="email"
        type="email"
        value={email}
        onChange={(e: any) => setEmail(e.target.value)}
        required
      />
      <Field
        className="mb-6"  
        classInput="dark:bg-n-7 dark:border-n-7 dark:focus:bg-transparent"
        placeholder={passwordPlaceholder}
        icon="lock"
        type="password"
        value={password}   
        onChange={(e: any) => setPassword(e.target.value)}
        required
      />

      {!signupSuccess && (
        <button className="btn-blue btn-large w-full mb-3" type="submit">
          {submitLabel}
        </button>
      )}
    
      {/* Feedback-Bereich */}
      <div ref={feedbackRef}>
        {errorMessage && (
          <div className="mb-3 text-center caption1 text-red-500">
            {errorMessage}
          </div>
        )}

        {signupSuccess && (
          <div className="mb-4 rounded-xl border border-n-3 bg-n-1/40 px-4 py-3 text-center caption1 dark:bg-n-7/60 dark:border-n-5">
            <div className="mb-2 font-semibold">
              {t("sign-in.create.success.title")}
            </div>
            <div className="mb-3 text-n-4">
              {t("sign-in.create.success.body")}
            </div>
            <button
              type="button"
              onClick={handleWebAuthnSetup}
              className="btn-blue btn-small"
            >
              {t("sign-in.create.success.cta_webauthn")}
            </button>
          </div>
        )}
      </div>

      <div className="text-center caption1 text-n-4">
        {tosPrefix}
        <Link
          className="text-n-5 transition-colors hover:text-n-7 dark:text-n-3 dark:hover:text-n-1"
          href={tosHref}
        >
          {tosLabel}
        </Link>{" "}
        {andLabel}{" "}
        <Link
          className="text-n-5 transition-colors hover:text-n-7 dark:text-n-3 dark:hover:text-n-1"
          href={privacyHref}
        >
          {privacyLabel}
        </Link>
        {t(".")}
      </div>
    </form>
  );
};

export default CreateAccount;
