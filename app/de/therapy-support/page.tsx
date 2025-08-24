import PageView from "@/templates/TherapySupportPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const messages = loadMessages("de");
  const t = makeT(messages);
  return <PageView />;
}
