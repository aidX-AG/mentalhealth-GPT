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
      // Neue Intro-Texte direkt unter dem Logo
      signInIntro={t("sign-in.intro.sign_in")}
      createIntro={t("sign-in.intro.create")}
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
      // Terms (bleiben unten) – jetzt mit sauberem Key
      tosPrefix={t("sign-in.legal.tos_prefix")}
      tosLabel={t("sign-in.legal.tos")}
      andLabel={t("sign-in.legal.and")}
      privacyLabel={t("sign-in.legal.privacy")}
    />
  );
}
