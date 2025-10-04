import PageView from "@/templates/HomePage";
import { loadMessages, makeT } from "@/lib/i18n-static";
import { makeNavigation, NAV_KEYS } from "@/constants/navigation";

export default function Page() {
  const messages = loadMessages("en");
  const t = makeT(messages);

  // Alle Keys einmal berühren, damit sie im POT landen
  NAV_KEYS.forEach((k) => t(k));

  return (
    <PageView
      heroTitle={t("homepage.sections.brand")}
      heroSubtitle={t("homepage.sections.tagline")}
      navigationItems={makeNavigation(t)}
      inputPlaceholder={t("homepage.input.placeholder")}
    />
  );
}
