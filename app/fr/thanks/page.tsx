import { t } from '@transifex/native';
import PageView from "@/templates/ThanksPage";
import { loadMessages, makeT } from "@/lib/i18n-static";
import { makeNavigation } from "@/constants/navigation";

export default function Page() {
  const t = makeT(loadMessages("fr"));

  return (
    <PageView
      title={t('fr.body.text.thank_you_purchase_d5b4', 'Thank you for your purchase!')}
      subtitle={t(
        'fr.body.text.order_has_been_received_currently_being_processed_you_8e8e',
        'Your order has been received and is currently being processed. You will receive an email confirmation with your order details shortly.'
      )}
      manageSubscriptionLabel={t('fr.body.text.manage_subscription_b959', 'Manage subscription')}
      startNewChatLabel={t('fr.body.text.start_new_chat_381a', 'Start new chat')}
      navigationItems={makeNavigation(t)} // ✅ hinzufügen
    />
  );
}
