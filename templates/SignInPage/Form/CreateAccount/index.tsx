import { useState } from "react";
import Link from "next/link";
import Field from "@/components/Field";
import i18next from "i18next";

type CreateAccountProps = {};

const CreateAccount = ({}: CreateAccountProps) => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    return (
        <form action="" onSubmit={() => console.log("Submit")}>
            <Field
                className="mb-4"
                classInput="dark:bg-n-7 dark:border-n-7 dark:focus:bg-transparent"
                placeholder={i18next.t("sign-in.placeholders.email", { defaultValue: "Email" })}
                icon="email"
                type="email"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                required
            />
            <Field
                className="mb-6"
                classInput="dark:bg-n-7 dark:border-n-7 dark:focus:bg-transparent"
                placeholder={i18next.t("sign-in.placeholders.password", { defaultValue: "Password" })}
                icon="lock"
                type="password"
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                required
            />
            <button className="btn-blue btn-large w-full mb-6" type="submit">
                {i18next.t("sign-in.buttons.create-account", { defaultValue: "Create Account" })}</button>
            <div className="text-center caption1 text-n-4">
                {i18next.t("sign-in.text.by-creating-account", { defaultValue: "By creating an account, you agree to our" })}{" "}
                <Link
                    className="text-n-5 transition-colors hover:text-n-7 dark:text-n-3 dark:hover:text-n-1"
                    href="/"
                >
                    {i18next.t("sign-in.sections.terms-of-service", { defaultValue: "Terms of Service" })}</Link>{" "}
                {i18next.t("sign-in.text.and", { defaultValue: "and" })}{" "}
                <Link
                    className="text-n-5 transition-colors hover:text-n-7 dark:text-n-3 dark:hover:text-n-1"
                    href="/"
                >
                    {i18next.t("sign-in.sections.privacy-cookie", { defaultValue: "Privacy & Cookie Statement" })}</Link>
                {i18next.t("sign-in.text.period", { defaultValue: "." })}</div>
        </form>
    );
};

export default CreateAccount;
