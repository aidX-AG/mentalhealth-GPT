import PageView from "@/templates/ThanksPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const messages = loadMessages("de");
  const t = makeT(messages);

  return (
    <PageView
      title={t("Thank you for your purchase!")}
      subtitle={t(
        "Your order has been received and is currently being processed. You will receive an email confirmation with your order details shortly."
      )}
      manageSubscriptionLabel={t("Manage subscription")}
      startNewChatLabel={t("Start new chat")}
    />
  );
}
