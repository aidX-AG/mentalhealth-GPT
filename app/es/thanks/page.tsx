import PageView from "@/templates/ThanksPage";
import { loadMessages, makeT } from "@/lib/i18n-static";
import { makeNavigation } from "@/constants/navigation";

export default function Page() {
  const t = makeT(loadMessages("es"));

  return (
    <PageView
      title={t("thanks.sections.title")}
      subtitle={t("thanks.sections.order-received")}
      manageSubscriptionLabel={t("thanks.buttons.manage-subscription")}
      startNewChatLabel={t("thanks.buttons.start-new-chat")}
      navigationItems={makeNavigation(t)}
    />
  );
}

