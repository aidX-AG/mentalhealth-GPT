import { t } from '@transifex/native';

// app/de/page.tsx
import PageView from "@/templates/HomePage";

import { loadMessages, makeT } from "@/lib/i18n-static";
import { makeNavigation, NAV_KEYS } from "@/constants/navigation";

export default function Page() {
  const messages = loadMessages("de");
  const t = makeT(messages);

  NAV_KEYS.forEach((k) => t(k));

  return (
    <PageView
      heroTitle={t('de.body.text.mentalhealthgpt_a371', 'mentalhealthGPT')}
      heroSubtitle={t(
        'de.body.text.expertise_you_trust_privacy_you_control_science_empowers_4a15',
        'Expertise you trust. Privacy you control. Science that empowers.'
      )}
      navigationItems={makeNavigation(t)}
    />
  );
}
