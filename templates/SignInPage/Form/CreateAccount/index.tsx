import { useState } from "react";
import { useTranslation } from 'react-i18next';
import Link from "next/link";
import Field from "@/components/Field";
import i18next from "i18next";

type CreateAccountProps = {};

const CreateAccount = ({}: CreateAccountProps) => {
  const { t: tSign-in } = useTranslation("sign-in");

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    return (
        <form action="" onSubmit={() => console.log("Submit")}>
            <Field
                className="mb-4"
                classInput="dark:bg-n-7 dark:border-n-7 dark:focus:bg-transparent"
                placeholder={tSign-in("placeholders.email", { defaultValue: "Email" })}
                icon="email"
                type="email"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                required
            />
            <Field
                className="mb-6"
                classInput="dark:bg-n-7 dark:border-n-7 dark:focus:bg-transparent"
                placeholder={tSign-in("placeholders.password", { defaultValue: "Password" })}
                icon="lock"
                type="password"
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                required
            />
            <button className="btn-blue btn-large w-full mb-6" type="submit">
                {tSign-in("buttons.create-account", { defaultValue: "Create Account" })}</button>
            <div className="text-center caption1 text-n-4">
                {tSign-in("text.by-creating-account", { defaultValue: "By creating an account, you agree to our" })}{" "}
                <Link
                    className="text-n-5 transition-colors hover:text-n-7 dark:text-n-3 dark:hover:text-n-1"
                    href="/"
                >
                    {tSign-in("sections.terms-of-service", { defaultValue: "Terms of Service" })}</Link>{" "}
                {tSign-in("text.and", { defaultValue: "and" })}{" "}
                <Link
                    className="text-n-5 transition-colors hover:text-n-7 dark:text-n-3 dark:hover:text-n-1"
                    href="/"
                >
                    {tSign-in("sections.privacy-cookie", { defaultValue: "Privacy & Cookie Statement" })}</Link>
                {tSign-in("text.period", { defaultValue: "." })}</div>
        </form>
    );
};

export default CreateAccount;
