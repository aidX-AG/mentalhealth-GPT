import { useState } from "react";
import { useTranslation } from 'react-i18next';
import Icon from "@/components/Icon";
import Field from "@/components/Field";
import i18next from "i18next";

type ForgotPasswordProps = {
    onClick: () => void;
};

const ForgotPassword = ({ onClick }: ForgotPasswordProps) => {
  const { t: tSign-in } = useTranslation("sign-in");

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
                {tSign-in("fragments.reset-password", { defaultValue: "Reset your password" })}</button>
            <form action="" onSubmit={() => console.log("Submit")}>
                <Field
                    className="mb-6"
                    classInput="dark:bg-n-7 dark:border-n-7 dark:focus:bg-transparent"
                    placeholder={tSign-in("placeholders.email", { defaultValue: "Email" })}
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
                    {tSign-in("buttons.reset-password", { defaultValue: "Reset password" })}</button>
            </form>
        </>
    );
};

export default ForgotPassword;
