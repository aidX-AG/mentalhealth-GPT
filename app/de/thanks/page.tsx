import { t } from '@transifex/native';
import PageView from "@/templates/ThanksPage";
import { loadMessages, makeT } from "@/lib/i18n-static";
import { makeNavigation } from "@/constants/navigation";

export default function Page() {
  const t = makeT(loadMessages("de"));

  return (
    <PageView
      title={t('de.body.text.thank_you_purchase_c226', 'Thank you for your purchase!')}
      subtitle={t(
        'de.body.text.order_has_been_received_currently_being_processed_you_4174',
        'Your order has been received and is currently being processed. You will receive an email confirmation with your order details shortly.'
      )}
      manageSubscriptionLabel={t('de.body.text.manage_subscription_0fd1', 'Manage subscription')}
      startNewChatLabel={t('de.body.text.start_new_chat_4af0', 'Start new chat')}
      navigationItems={makeNavigation(t)}
    />
  );
}
