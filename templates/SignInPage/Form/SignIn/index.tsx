import { useState } from "react";
import { useTranslation } from 'react-i18next';
import Field from "@/components/Field";
import i18next from "i18next";

type SignInProps = {
    onClick: () => void;
};

const SignIn = ({ onClick }: SignInProps) => {
  const { t: tSign-in } = useTranslation("sign-in");

    const [name, setName] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    return (
        <form action="" onSubmit={() => console.log("Submit")}>
            <Field
                className="mb-4"
                classInput="dark:bg-n-7 dark:border-n-7 dark:focus:bg-transparent"
                placeholder={tSign-in("placeholders.username-or-email", { defaultValue: "Username or email" })}
                icon="email"
                value={name}
                onChange={(e: any) => setName(e.target.value)}
                required
            />
            <Field
                className="mb-2"
                classInput="dark:bg-n-7 dark:border-n-7 dark:focus:bg-transparent"
                placeholder={tSign-in("placeholders.password", { defaultValue: "Password" })}
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
                {tSign-in("misc.forgot-password", { defaultValue: "Forgot password?" })}</button>
            <button className="btn-blue btn-large w-full" type="submit">
                {tSign-in("misc.sign-in-with-brainwave", { defaultValue: "Sign in with Brainwave" })}</button>
        </form>
    );
};

export default SignIn;
