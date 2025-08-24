import PageView from "@/templates/PricingPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const messages = loadMessages("fr");
  const t = makeT(messages);
  return <PageView />;
}
