import PageView from "@/templates/SignInPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const t = makeT(loadMessages("en"));

  return (
    <PageView
      heroTitle={t("sign-in.hero.title")}
      heroSubtitle={t("sign-in.hero.subtitle")}
      // Tabs & Buttons
      tabs={[t("sign-in.tabs.sign_in"), t("sign-in.tabs.create_account")]}
      // SignIn
      usernamePlaceholder={t("sign-in.place.username")}
      passwordPlaceholder={t("sign-in.place.create_password")}
      forgotPasswordLabel={t("sign-in.misc.forgot-password")}
      signInSubmitLabel={t("sign-in.button.sign_in_with_app")}
      // Forgot
      resetBackLabel={t("sign-in.password.reset.title")}
      resetEmailPlaceholder={t("sign-in.place.create_email")}
      resetSubmitLabel={t("sign-in.button.reset_password")}
      // Create
      createEmailPlaceholder={t("sign-in.place.create_email")}
      createPasswordPlaceholder={t("sign-in.place.create_password")}
      createSubmitLabel={t("sign-in.button.create_account")}
      // Social Logins (jetzt nach unseren eigenen Logins)
      continueGoogle={t("sign-in.social.google")}
      continueApple={t("sign-in.social.apple")}
      orLabel={t("sign-in.misc.or")}
      // Terms (bleiben unten)
      tosPrefix={t("By creating an account, you agree to our ")}
      tosLabel={t("sign-in.legal.tos")}
      andLabel={t("sign-in.legal.and")}
      privacyLabel={t("sign-in.legal.privacy")}
    />
  );
}
