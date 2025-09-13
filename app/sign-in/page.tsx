import { t } from '@transifex/native';
import PageView from "@/templates/SignInPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const t = makeT(loadMessages("en"));

  return (
    <PageView
      heroTitle={t('sign_in.body.text.unlock_power_ai_6856', 'Unlock the power of AI')}
      heroSubtitle={t(
        'sign_in.body.text.chat_smartest_ai_experience_power_ai_us_c4fe',
        'Chat with the smartest AI - Experience the power of AI with us'
      )}
      // Tabs & Buttons
      tabs={[t('sign_in.body.text.sign_510f', 'Sign in'), t('sign_in.body.text.create_account_9c1b', 'Create account')]}
      continueGoogle={t('sign_in.body.text.continue_google_f4f1', 'Continue with Google')}
      continueApple={t('sign_in.body.text.continue_apple_0a47', 'Continue with Apple')}
      orLabel={t('sign_in.body.text.or_3e09', 'OR')}
      // SignIn
      usernamePlaceholder={t('sign_in.body.text.username_or_email_2212', 'Username or email')}
      passwordPlaceholder={t('sign_in.body.text.password_cbe1', 'Password')}
      forgotPasswordLabel={t('sign_in.body.text.forgot_password_370e', 'Forgot password?')}
      signInSubmitLabel={t('sign_in.body.text.sign_brainwave_5d46', 'Sign in with Brainwave')}
      // Forgot
      resetBackLabel={t('sign_in.body.text.reset_password_097f', 'Reset your password')}
      resetEmailPlaceholder={t('sign_in.body.text.email_2a3a', 'Email')}
      resetSubmitLabel={t('sign_in.body.text.reset_password_05da', 'Reset password')}
      // Create
      createEmailPlaceholder={t('sign_in.body.text.email_9cfe', 'Email')}
      createPasswordPlaceholder={t('sign_in.body.text.password_daec', 'Password')}
      createSubmitLabel={t('sign_in.body.text.create_account_ec87', 'Create Account')}
      tosPrefix={t(
        'sign_in.body.text.creating_account_you_agree_47a1',
        'By creating an account, you agree to our '
      )}
      tosLabel={t('sign_in.body.text.terms_service_d507', 'Terms of Service')}
      andLabel={t('sign_in.body.text.text_6b17', 'and')}
      privacyLabel={t(
        'sign_in.body.text.privacy_cookie_statement_6c6f',
        'Privacy & Cookie Statement'
      )}
    />
  );
}
