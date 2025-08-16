import { useState } from "react";
import { useTranslation } from 'react-i18next';
import Field from "@/components/Field";
import i18next from "i18next";

type PasswordProps = {};

const Password = ({}: PasswordProps) => {
  const { t: tCommon } = useTranslation("common");

    const [oldPassword, setOldPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    return (
        <form className="" action="" onSubmit={() => console.log("Submit")}>
            <div className="mb-8 h4 md:mb-6">{tCommon("form.password", { defaultValue: "Password" })}</div>
            <Field
                className="mb-6"
                label={tCommon("labels.password", { defaultValue: "Password" })}
                placeholder={tCommon("placeholders.password", { defaultValue: "Password" })}
                type="password"
                icon="lock"
                value={oldPassword}
                onChange={(e: any) => setOldPassword(e.target.value)}
                required
            />
            <Field
                className="mb-6"
                label={tCommon("labels.new-password", { defaultValue: "New password" })}
                placeholder={tCommon("placeholders.new-password", { defaultValue: "New password" })}
                note="Minimum 8 characters"
                type="password"
                icon="lock"
                value={newPassword}
                onChange={(e: any) => setNewPassword(e.target.value)}
                required
            />
            <Field
                className="mb-6"
                label={tCommon("labels.confirm-new-password", { defaultValue: "Confirm new password" })}
                placeholder={tCommon("placeholders.confirm-new-password", { defaultValue: "Confirm new password" })}
                note="Minimum 8 characters"
                type="password"
                icon="lock"
                value={confirmPassword}
                onChange={(e: any) => setConfirmPassword(e.target.value)}
                required
            />
            <button className="btn-blue w-full">{tCommon("form.change-password", { defaultValue: "Change password" })}</button>
        </form>
    );
};

export default Password;
