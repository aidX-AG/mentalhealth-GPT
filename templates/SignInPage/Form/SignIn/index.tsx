import { useState } from "react";
import Field from "@/components/Field";

type SignInProps = {
  onClick: () => void;
  usernamePlaceholder: string;   // "Username or email"
  passwordPlaceholder: string;   // "Password"
  forgotPasswordLabel: string;   // "Forgot password?"
  submitLabel: string;           // "Sign in with Brainwave"
};

const SignIn = ({ onClick, usernamePlaceholder, passwordPlaceholder, forgotPasswordLabel, submitLabel }: SignInProps) => {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  return (
    <form action="" onSubmit={() => console.log("Submit")}>
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
