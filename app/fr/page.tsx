import { t } from '@transifex/native';

// app/fr/page.tsx
import PageView from "@/templates/HomePage";

import { loadMessages, makeT } from "@/lib/i18n-static";
import { makeNavigation, NAV_KEYS } from "@/constants/navigation";

export default function Page() {
  const messages = loadMessages("fr");
  const t = makeT(messages);

  NAV_KEYS.forEach((k) => t(k));

  return (
    <PageView
      heroTitle={t('fr.body.text.mentalhealthgpt_77ce', 'mentalhealthGPT')}
      heroSubtitle={t(
        'fr.body.text.expertise_you_trust_privacy_you_control_science_empowers_d6f9',
        'Expertise you trust. Privacy you control. Science that empowers.'
      )}
      navigationItems={makeNavigation(t)}
    />
  );
}
