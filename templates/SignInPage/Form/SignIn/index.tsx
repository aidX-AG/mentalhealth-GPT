import { useState } from "react";
import Field from "@/components/Field";
import i18next from "i18next";

type SignInProps = {
    onClick: () => void;
};

const SignIn = ({ onClick }: SignInProps) => {
    const [name, setName] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    return (
        <form action="" onSubmit={() => console.log("Submit")}>
            <Field
                className="mb-4"
                classInput="dark:bg-n-7 dark:border-n-7 dark:focus:bg-transparent"
                placeholder={i18next.t("sign-in.placeholders.username-or-email", { defaultValue: "Username or email" })}
                icon="email"
                value={name}
                onChange={(e: any) => setName(e.target.value)}
                required
            />
            <Field
                className="mb-2"
                classInput="dark:bg-n-7 dark:border-n-7 dark:focus:bg-transparent"
                placeholder={i18next.t("sign-in.placeholders.password", { defaultValue: "Password" })}
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
                {i18next.t("sign-in.misc.forgot-password", { defaultValue: "Forgot password?" })}</button>
            <button className="btn-blue btn-large w-full" type="submit">
                {i18next.t("sign-in.misc.sign-in-with-brainwave", { defaultValue: "Sign in with Brainwave" })}</button>
        </form>
    );
};

export default SignIn;
