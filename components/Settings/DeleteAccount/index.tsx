import { useState } from "react";
import Field from "@/components/Field";
import i18next from "i18next";

type DeleteAccountProps = {};

const DeleteAccount = ({}: DeleteAccountProps) => {
    const [password, setPassword] = useState<string>("");

    return (
        <form className="" action="" onSubmit={() => console.log("Submit")}>
            <div className="mb-8 h4">{i18next.t("common.form.delete-account-title", { defaultValue: "We’re sorry to see you go" })}</div>
            <div className="mb-6 caption1 text-n-4">
                {i18next.t("common.form.delete-account-warning", { defaultValue: "Warning: Deleting your account will permanently remove all of your data and cannot be undone. This includes your profile, chats, comments, and any other information associated with your account. Are you sure you want to proceed with deleting your account?" })}</div>
            <Field
                className="mb-6"
                label={i18next.t("common.labels.your-password", { defaultValue: "Your password" })}
                placeholder={i18next.t("common.placeholders.password", { defaultValue: "Password" })}
                type="password"
                icon="lock"
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                required
            />
            <button className="btn-red w-full" disabled>
                {i18next.t("common.form.delete-account", { defaultValue: "Delete account" })}</button>
        </form>
    );
};

export default DeleteAccount;
