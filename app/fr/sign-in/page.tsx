import { t } from '@transifex/native';
import PageView from "@/templates/SignInPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const t = makeT(loadMessages("fr"));

  return (
    <PageView
      heroTitle={t('fr.body.text.unlock_power_ai_d3dc', 'Unlock the power of AI')}
      heroSubtitle={t(
        'fr.body.text.chat_smartest_ai_experience_power_ai_us_0b53',
        'Chat with the smartest AI - Experience the power of AI with us'
      )}
      tabs={[t('fr.body.text.sign_7410', 'Sign in'), t('fr.body.text.create_account_629c', 'Create account')]}
      continueGoogle={t('fr.body.text.continue_google_f86c', 'Continue with Google')}
      continueApple={t('fr.body.text.continue_apple_b1c9', 'Continue with Apple')}
      orLabel={t('fr.body.text.or_d7db', 'OR')}
      usernamePlaceholder={t('fr.body.text.username_or_email_816e', 'Username or email')}
      passwordPlaceholder={t('fr.body.text.password_0ed4', 'Password')}
      forgotPasswordLabel={t('fr.body.text.forgot_password_f1d9', 'Forgot password?')}
      signInSubmitLabel={t('fr.body.text.sign_brainwave_f6f2', 'Sign in with Brainwave')}
      resetBackLabel={t('fr.body.text.reset_password_1d8f', 'Reset your password')}
      resetEmailPlaceholder={t('fr.body.text.email_aee1', 'Email')}
      resetSubmitLabel={t('fr.body.text.reset_password_1272', 'Reset password')}
      createEmailPlaceholder={t('fr.body.text.email_6694', 'Email')}
      createPasswordPlaceholder={t('fr.body.text.password_4c25', 'Password')}
      createSubmitLabel={t('fr.body.text.create_account_d484', 'Create Account')}
      tosPrefix={t(
        'fr.body.text.creating_account_you_agree_4c51',
        'By creating an account, you agree to our '
      )}
      tosLabel={t('fr.body.text.terms_service_e374', 'Terms of Service')}
      andLabel={t('fr.body.text.text_1043', 'and')}
      privacyLabel={t('fr.body.text.privacy_cookie_statement_1740', 'Privacy & Cookie Statement')}
    />
  );
}
