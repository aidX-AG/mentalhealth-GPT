import SignInPage from "@/templates/SignInPage";
import PasskeyForm from "@/templates/SignInPage/PasskeyForm";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const t = makeT(loadMessages("fr"));

  return (
    <SignInPage
      heroTitle={t("passkey.hero.title")}
      heroSubtitle={t("passkey.hero.subtitle")}
      closeHref="/sign-in"
      // Form-Props (werden von SignInPage erwartet, auch wenn wir PasskeyForm als Child rendern)
      tabs={[t("sign-in.tabs.sign_in"), t("sign-in.tabs.create_account")]}
      signInIntro={t("sign-in.intro.sign_in")}
      createIntro={t("sign-in.intro.create")}
      usernamePlaceholder={t("sign-in.place.username")}
      passwordPlaceholder={t("sign-in.place.create_password")}
      forgotPasswordLabel={t("sign-in.misc.forgot-password")}
      signInSubmitLabel={t("sign-in.button.sign_in_with_app")}
      resetBackLabel={t("sign-in.password.reset.title")}
      resetEmailPlaceholder={t("sign-in.place.create_email")}
      resetSubmitLabel={t("sign-in.button.reset_password")}
      createEmailPlaceholder={t("sign-in.place.create_email")}
      createPasswordPlaceholder={t("sign-in.place.create_password")}
      createSubmitLabel={t("sign-in.button.create_account")}
      tosPrefix={t("sign-in.legal.tos_prefix")}
      tosLabel={t("sign-in.legal.tos")}
      andLabel={t("sign-in.legal.and")}
      privacyLabel={t("sign-in.legal.privacy")}
    >
      <PasskeyForm />
    </SignInPage>
  );
}
