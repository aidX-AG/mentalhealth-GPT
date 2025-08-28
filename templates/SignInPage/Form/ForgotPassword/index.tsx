import { useState } from "react";
import Icon from "@/components/Icon";
import Field from "@/components/Field";
import { getT } from "@/lib/i18n-runtime";
const t = getT();
type ForgotPasswordProps = {
  onClick: () => void;
  backLabel: string; // "Reset your password"
  emailPlaceholder: string; // "Email"
  submitLabel: string; // "Reset password"
};
const ForgotPassword = ({
  onClick,
  backLabel,
  emailPlaceholder,
  submitLabel
}: ForgotPasswordProps) => {
  const [email, setEmail] = useState<string>("");
  return <>
      <button className="group flex items-center mb-8 h5" onClick={onClick}>
        <Icon className="mr-4 transition-transform group-hover:-translate-x-1 dark:fill-n-1" name={t("arrow-prev")} />
        {backLabel}
      </button>
      <form action="" onSubmit={() => console.log("Submit")}>
        <Field className="mb-6" classInput="dark:bg-n-7 dark:border-n-7 dark:focus:bg-transparent" placeholder={emailPlaceholder} icon="email" type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} required />
        <button className="btn-blue btn-large w-full mb-6" type="submit">
          {submitLabel}
        </button>
      </form>
    </>;
};
export default ForgotPassword;