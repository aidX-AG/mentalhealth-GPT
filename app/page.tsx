import { t } from '@transifex/native';

// app/page.tsx  (EN)
import PageView from "@/templates/HomePage";

import { loadMessages, makeT } from "@/lib/i18n-static";
import { makeNavigation, NAV_KEYS } from "@/constants/navigation";

export default function Page() {
  const messages = loadMessages("en");
  const t = makeT(messages);

  // >>> Wichtig für TX: alle Keys einmal "berühren", damit der Extractor sie sieht
  NAV_KEYS.forEach((k) => t(k));

  return (
    <PageView
      heroTitle={t('page_tsx.body.text.mentalhealthgpt_c5c0', 'mentalhealthGPT')}
      heroSubtitle={t(
        'page_tsx.body.text.expertise_you_trust_privacy_you_control_science_empowers_2a28',
        'Expertise you trust. Privacy you control. Science that empowers.'
      )}
      navigationItems={makeNavigation(t)}
    />
  );
}
