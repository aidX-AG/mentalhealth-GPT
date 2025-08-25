import PageView from "@/templates/TherapySupportPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const messages = loadMessages("de");
  const t = makeT(messages);

  return (
    <PageView
      title={t("Therapy Support AI")}
      introText={t("🧠 Hallo! Ich bin deine Therapy Support AI. Beschreibe gerne deinen Fall, spezifische Symptome oder frage nach therapeutischen Strategien.")}
      noticeTextPrefix={t("🚧 Die KI-Funktion für ")}
      featureName={t("Therapy Support")}
      noticeTextSuffix={t(" befindet sich derzeit in Entwicklung. Bald verfügbar mit spezialisierten Modellen für Therapieplanung, Reflexion und evidenzbasierte Vorschläge.")}
      contactCta={t("Möchtest du dieses Feature unterstützen oder mehr erfahren? E-Mail an")}
      contactEmail="hello@aidx.ch"
    />
  );
}
