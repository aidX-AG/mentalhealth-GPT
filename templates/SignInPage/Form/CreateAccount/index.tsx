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
                placeholder={i18next.t("sign-in.fieldplaceholder_email_07", { defaultValue: "Email" })}
                icon="email"
                type="email"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                required
            />
            <Field
                className="mb-6"
                classInput="dark:bg-n-7 dark:border-n-7 dark:focus:bg-transparent"
                placeholder={i18next.t("sign-in.fieldplaceholder_password_08", { defaultValue: "Password" })}
                icon="lock"
                type="password"
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                required
            />
            <button className="btn-blue btn-large w-full mb-6" type="submit">
                {i18next.t("sign-in.form_create_account_01", { defaultValue: "Create Account" })}</button>
            <div className="text-center caption1 text-n-4">
                {i18next.t("sign-in.form_by_creating_an_account_you_02", { defaultValue: "By creating an account, you agree to our" })}{" "}
                <Link
                    className="text-n-5 transition-colors hover:text-n-7 dark:text-n-3 dark:hover:text-n-1"
                    href="/"
                >
                    {i18next.t("sign-in.div_terms_of_service_03", { defaultValue: "Terms of Service" })}</Link>{" "}
                {i18next.t("sign-in.form_and_04", { defaultValue: "and" })}{" "}
                <Link
                    className="text-n-5 transition-colors hover:text-n-7 dark:text-n-3 dark:hover:text-n-1"
                    href="/"
                >
                    {i18next.t("sign-in.div_privacy_cookie_statement_05", { defaultValue: "Privacy & Cookie Statement" })}</Link>
                {i18next.t("sign-in.form_text_06", { defaultValue: "." })}</div>
        </form>
    );
};

export default CreateAccount;
