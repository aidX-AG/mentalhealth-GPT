import PageView from "@/templates/SignInPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const t = makeT(loadMessages("de"));

  return (
    <PageView
      heroTitle={t("Unlock the power of your private mental health AI")}
      heroSubtitle={t("Chat with specialized expertise - Experience AI with complete data protection with us")}
      // Tabs & Buttons
      tabs={[t("Sign in"), t("Create account")]}
      // SignIn
      usernamePlaceholder={t("Username or email")}
      passwordPlaceholder={t("Password")}
      forgotPasswordLabel={t("Forgot password?")}
      signInSubmitLabel={t("Sign in with mentalhealthGPT")}
      // Forgot
      resetBackLabel={t("Reset your password")}
      resetEmailPlaceholder={t("Email")}
      resetSubmitLabel={t("Reset password")}
      // Create
      createEmailPlaceholder={t("Email")}
      createPasswordPlaceholder={t("Password")}
      createSubmitLabel={t("Create Account")}
      // Social Logins (jetzt nach unseren eigenen Logins)
      continueGoogle={t("Continue with Google")}
      continueApple={t("Continue with Apple")}
      orLabel={t("OR")}
      // Terms (bleiben unten)
      tosPrefix={t("By creating an account, you agree to our ")}
      tosLabel={t("Terms of Service")}
      andLabel={t("and")}
      privacyLabel={t("Privacy & Cookie Statement")}
    />
  );
}
