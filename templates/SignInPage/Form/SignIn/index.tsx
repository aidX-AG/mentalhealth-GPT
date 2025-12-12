import { useState } from "react";
import Field from "@/components/Field";

type SignInProps = {
  onClick: () => void;
  usernamePlaceholder: string;   // "Username or email"
  passwordPlaceholder: string;   // "Password"
  forgotPasswordLabel: string;   // "Forgot password?"
  submitLabel: string;           // "Sign in with aidX"
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

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
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
          email: name,   // Backend erwartet "email"
          password,
        }),
      });

      if (!res.ok) {
        console.error("Login failed", await res.text());
        return;
      }

      console.log("Login OK");
      // später: Redirect auf /dashboard o.ä.
    } catch (error) {
      console.error("Login request error", error);
    }
  };

  return (
    <form action="" onSubmit={handleSubmit}>
      <Field
        className="mb-4"
        classInput="dark:bg-n-7 dark:border-n-7 dark:focus:bg-transparent"
        placeholder={usernamePlaceholder}
        icon="email"
        value={name}
        onChange={(e: any) => setName(e.target.value)}
        required
      />
      <Field
        className="mb-2"
        classInput="dark:bg-n-7 dark:border-n-7 dark:focus:bg-transparent"
        placeholder={passwordPlaceholder}
        icon="lock"
        type="password"
        value={password}
        onChange={(e: any) => setPassword(e.target.value)}
        required
      />
      <button
        className="mb-6 base2 text-primary-1 transition-colors hover:text-primary-1/90"
        type="button"
        onClick={onClick}
      >
        {forgotPasswordLabel}
      </button>
      <button className="btn-blue btn-large w-full" type="submit">
        {submitLabel}
      </button>
    </form>
  );
};

export default SignIn;
