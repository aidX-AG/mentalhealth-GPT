import { useState } from "react";
import { useTranslation } from 'react-i18next';
import Field from "@/components/Field";
import i18next from "i18next";

type DeleteAccountProps = {};

const DeleteAccount = ({}: DeleteAccountProps) => {
  const { t: tCommon } = useTranslation("common");

    const [password, setPassword] = useState<string>("");

    return (
        <form className="" action="" onSubmit={() => console.log("Submit")}>
            <div className="mb-8 h4">{tCommon("form.delete-account-title", { defaultValue: "We’re sorry to see you go" })}</div>
            <div className="mb-6 caption1 text-n-4">
                {tCommon("form.delete-account-warning", { defaultValue: "Warning: Deleting your account will permanently remove all of your data and cannot be undone. This includes your profile, chats, comments, and any other information associated with your account. Are you sure you want to proceed with deleting your account?" })}</div>
            <Field
                className="mb-6"
                label={tCommon("labels.your-password", { defaultValue: "Your password" })}
                placeholder={tCommon("placeholders.password", { defaultValue: "Password" })}
                type="password"
                icon="lock"
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                required
            />
            <button className="btn-red w-full" disabled>
                {tCommon("form.delete-account", { defaultValue: "Delete account" })}</button>
        </form>
    );
};

export default DeleteAccount;
