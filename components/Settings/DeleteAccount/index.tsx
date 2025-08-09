import { useState } from "react";
import Field from "@/components/Field";
import i18next from "i18next";

type DeleteAccountProps = {};

const DeleteAccount = ({}: DeleteAccountProps) => {
    const [password, setPassword] = useState<string>("");

    return (
        <form className="" action="" onSubmit={() => console.log("Submit")}>
            <div className="mb-8 h4">{i18next.t("common.form_were_sorry_to_see_you_01", { defaultValue: "We’re sorry to see you go" })}</div>
            <div className="mb-6 caption1 text-n-4">
                {i18next.t("common.form_warning_deleting_your_account_will_02", { defaultValue: "Warning: Deleting your account will permanently remove all of your data and cannot be undone. This includes your profile, chats, comments, and any other information associated with your account. Are you sure you want to proceed with deleting your account?" })}</div>
            <Field
                className="mb-6"
                label={i18next.t("common.fieldlabel_your_password_04", { defaultValue: "Your password" })}
                placeholder={i18next.t("common.fieldplaceholder_password_05", { defaultValue: "Password" })}
                type="password"
                icon="lock"
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                required
            />
            <button className="btn-red w-full" disabled>
                {i18next.t("common.form_delete_account_03", { defaultValue: "Delete account" })}</button>
        </form>
    );
};

export default DeleteAccount;
