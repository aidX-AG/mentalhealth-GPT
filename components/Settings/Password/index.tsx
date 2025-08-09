import { useState } from "react";
import Field from "@/components/Field";
import i18next from "i18next";

type PasswordProps = {};

const Password = ({}: PasswordProps) => {
    const [oldPassword, setOldPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    return (
        <form className="" action="" onSubmit={() => console.log("Submit")}>
            <div className="mb-8 h4 md:mb-6">{i18next.t("common.form.password", { defaultValue: "Password" })}</div>
            <Field
                className="mb-6"
                label={i18next.t("common.labels.password", { defaultValue: "Password" })}
                placeholder={i18next.t("common.placeholders.password", { defaultValue: "Password" })}
                type="password"
                icon="lock"
                value={oldPassword}
                onChange={(e: any) => setOldPassword(e.target.value)}
                required
            />
            <Field
                className="mb-6"
                label={i18next.t("common.labels.new-password", { defaultValue: "New password" })}
                placeholder={i18next.t("common.placeholders.new-password", { defaultValue: "New password" })}
                note="Minimum 8 characters"
                type="password"
                icon="lock"
                value={newPassword}
                onChange={(e: any) => setNewPassword(e.target.value)}
                required
            />
            <Field
                className="mb-6"
                label={i18next.t("common.labels.confirm-new-password", { defaultValue: "Confirm new password" })}
                placeholder={i18next.t("common.placeholders.confirm-new-password", { defaultValue: "Confirm new password" })}
                note="Minimum 8 characters"
                type="password"
                icon="lock"
                value={confirmPassword}
                onChange={(e: any) => setConfirmPassword(e.target.value)}
                required
            />
            <button className="btn-blue w-full">{i18next.t("common.form.change-password", { defaultValue: "Change password" })}</button>
        </form>
    );
};

export default Password;
