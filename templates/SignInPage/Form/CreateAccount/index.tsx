import { useState } from "react";
import Link from "next/link";
import Field from "@/components/Field";

type CreateAccountProps = {
  emailPlaceholder: string;         // "Email"
  passwordPlaceholder: string;      // "Password"
  submitLabel: string;              // "Create Account"
  tosPrefix: string;                // "By creating an account, you agree to our "
  tosLabel: string;                 // "Terms of Service"
  andLabel: string;                 // "and"
  privacyLabel: string;             // "Privacy & Cookie Statement"
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

  return (
    <form action="" onSubmit={() => console.log("Submit")}>
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
      <button className="btn-blue btn-large w-full mb-6" type="submit">
        {submitLabel}
      </button>
      <div className="text-center caption1 text-n-4">
        {tosPrefix}
        <Link className="text-n-5 transition-colors hover:text-n-7 dark:text-n-3 dark:hover:text-n-1" href={tosHref}>
          {tosLabel}
        </Link>{" "}
        {andLabel}{" "}
        <Link className="text-n-5 transition-colors hover:text-n-7 dark:text-n-3 dark:hover:text-n-1" href={privacyHref}>
          {privacyLabel}
        </Link>
        .
      </div>
    </form>
  );
};

export default CreateAccount;
