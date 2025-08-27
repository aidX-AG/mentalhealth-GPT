import PageView from "@/templates/ThanksPage";
import { loadMessages, makeT } from "@/lib/i18n-static";
import { makeNavigation } from "@/constants/navigation";

export default function Page() {
  const t = makeT(loadMessages("en"));

  return (
    <PageView
      title={t("Thank you for your purchase!")}
      subtitle={t(
        "Your order has been received and is currently being processed. You will receive an email confirmation with your order details shortly."
      )}
      manageSubscriptionLabel={t("Manage subscription")}
      startNewChatLabel={t("Start new chat")}
      navigationItems={makeNavigation(t)} // ✅ hinzufügen
    />
  );
}
