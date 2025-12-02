import SignInPage from "@/templates/SignInPage";
import PasskeyForm from "@/templates/SignInPage/PasskeyForm";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const t = makeT(loadMessages("en")); // später gerne dynamisch nach Locale

  return (
    <SignInPage
      heroTitle={t("passkey.hero.title")}
      heroSubtitle={t("passkey.hero.subtitle")}
      closeHref="/sign-in"
      // Diese Props sind für <Form>, werden ignoriert, wenn children gesetzt sind:
      tabs={[]}
      continueGoogle=""
      continueApple=""
      orLabel=""
      usernamePlaceholder=""
      passwordPlaceholder=""
      forgotPasswordLabel=""
      signInSubmitLabel=""
      resetBackLabel=""
      resetEmailPlaceholder=""
      resetSubmitLabel=""
      createEmailPlaceholder=""
      createPasswordPlaceholder=""
      createSubmitLabel=""
      tosPrefix=""
      tosLabel=""
      andLabel=""
      privacyLabel=""
    >
      <PasskeyForm />
    </SignInPage>
  );
}
