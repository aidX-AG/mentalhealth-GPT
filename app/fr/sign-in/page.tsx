import PageView from "@/templates/SignInPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const t = makeT(loadMessages("fr"));

  return (
    <PageView
      heroTitle={t("Unlock the power of AI")}
      heroSubtitle={t("Chat with the smartest AI - Experience the power of AI with us")}
      tabs={[t("Sign in"), t("Create account")]}
      continueGoogle={t("Continue with Google")}
      continueApple={t("Continue with Apple")}
      orLabel={t("OR")}
      usernamePlaceholder={t("Username or email")}
      passwordPlaceholder={t("Password")}
      forgotPasswordLabel={t("Forgot password?")}
      signInSubmitLabel={t("Sign in with Brainwave")}
      resetBackLabel={t("Reset your password")}
      resetEmailPlaceholder={t("Email")}
      resetSubmitLabel={t("Reset password")}
      createEmailPlaceholder={t("Email")}
      createPasswordPlaceholder={t("Password")}
      createSubmitLabel={t("Create Account")}
      tosPrefix={t("By creating an account, you agree to our ")}
      tosLabel={t("Terms of Service")}
      andLabel={t("and")}
      privacyLabel={t("Privacy & Cookie Statement")}
    />
  );
}
