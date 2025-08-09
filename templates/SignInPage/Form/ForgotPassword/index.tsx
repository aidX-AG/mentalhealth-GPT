import { useState } from "react";
import Icon from "@/components/Icon";
import Field from "@/components/Field";
import i18next from "i18next";

type ForgotPasswordProps = {
    onClick: () => void;
};

const ForgotPassword = ({ onClick }: ForgotPasswordProps) => {
    const [email, setEmail] = useState<string>("");

    return (
        <>
            <button
                className="group flex items-center mb-8 h5"
                onClick={onClick}
            >
                <Icon
                    className="mr-4 transition-transform group-hover:-translate-x-1 dark:fill-n-1"
                    name="arrow-prev"
                />
                {i18next.t("sign-in.fragments.reset-password", { defaultValue: "Reset your password" })}</button>
            <form action="" onSubmit={() => console.log("Submit")}>
                <Field
                    className="mb-6"
                    classInput="dark:bg-n-7 dark:border-n-7 dark:focus:bg-transparent"
                    placeholder={i18next.t("sign-in.placeholders.email", { defaultValue: "Email" })}
                    icon="email"
                    type="email"
                    value={email}
                    onChange={(e: any) => setEmail(e.target.value)}
                    required
                />
                <button
                    className="btn-blue btn-large w-full mb-6"
                    type="submit"
                >
                    {i18next.t("sign-in.buttons.reset-password", { defaultValue: "Reset password" })}</button>
            </form>
        </>
    );
};

export default ForgotPassword;
