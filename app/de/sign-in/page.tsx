import { t } from '@transifex/native';
import PageView from "@/templates/SignInPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const t = makeT(loadMessages("de"));

  return (
    <PageView
      heroTitle={t('de.body.text.unlock_power_ai_7a4a', 'Unlock the power of AI')}
      heroSubtitle={t(
        'de.body.text.chat_smartest_ai_experience_power_ai_us_dca5',
        'Chat with the smartest AI - Experience the power of AI with us'
      )}
      tabs={[t('de.body.text.sign_8d84', 'Sign in'), t('de.body.text.create_account_e72d', 'Create account')]}
      continueGoogle={t('de.body.text.continue_google_0626', 'Continue with Google')}
      continueApple={t('de.body.text.continue_apple_922d', 'Continue with Apple')}
      orLabel={t('de.body.text.or_60e4', 'OR')}
      usernamePlaceholder={t('de.body.text.username_or_email_5d57', 'Username or email')}
      passwordPlaceholder={t('de.body.text.password_17b5', 'Password')}
      forgotPasswordLabel={t('de.body.text.forgot_password_c160', 'Forgot password?')}
      signInSubmitLabel={t('de.body.text.sign_brainwave_fd5f', 'Sign in with Brainwave')}
      resetBackLabel={t('de.body.text.reset_password_ce70', 'Reset your password')}
      resetEmailPlaceholder={t('de.body.text.email_2e62', 'Email')}
      resetSubmitLabel={t('de.body.text.reset_password_133a', 'Reset password')}
      createEmailPlaceholder={t('de.body.text.email_953f', 'Email')}
      createPasswordPlaceholder={t('de.body.text.password_be6d', 'Password')}
      createSubmitLabel={t('de.body.text.create_account_1a2f', 'Create Account')}
      tosPrefix={t(
        'de.body.text.creating_account_you_agree_85c3',
        'By creating an account, you agree to our '
      )}
      tosLabel={t('de.body.text.terms_service_5c68', 'Terms of Service')}
      andLabel={t('de.body.text.text_0a30', 'and')}
      privacyLabel={t('de.body.text.privacy_cookie_statement_d0f1', 'Privacy & Cookie Statement')}
    />
  );
}
