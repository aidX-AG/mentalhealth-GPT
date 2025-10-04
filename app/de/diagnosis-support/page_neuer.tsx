// app/de/diagnosis-support/page.tsx
import PageView from "@/templates/DiagnosisSupportPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  // Zentrale Text-to-Key Übersetzungen (DE)
  const dict = loadMessages("de");
  const t = makeT(dict);

  // Vorhandene Keys (aus deinem Dump):
  // - 'diagnosis-support.chat.title'
  // - 'diagnosis-support.sections.banner-prefix'   → "🚧 Die KI-Funktionalität für"
  // - 'diagnosis-support.sections.under-development'
  // - 'diagnosis-support.sections.coming-soon'
  // - 'Diagnosis Support' (Text-to-Key vorhanden)
  // Hinweis: 'Just now' / 'diagnosis-case.pdf' gibt es nicht – daher fallback/neutral

  const title = t("diagnosis-support.chat.title");
  const featureName = t("Diagnosis Support");

  // Wir bauen den Hinweis so zusammen, wie es dein Template erwartet:
  const noticeTextPrefix = t("diagnosis-support.sections.banner-prefix"); // "🚧 Die KI-Funktionalität für"
  const noticeTextSuffix =
    // unter-Entwicklung + coming-soon zusammengezogen
    t("diagnosis-support.sections.under-development") +
    " " +
    t("diagnosis-support.sections.coming-soon");

  // Für Felder ohne passenden Key nehmen wir neutrale Defaults
  const questionDocument = "diagnosis-case.pdf"; // kein Key vorhanden → neutral lassen
  const questionContent = t(
    "diagnosis-support.sections.coming-soon"
  ); // kurzer vorhandener Text statt langem EN-Satz
  const questionTime = t("Today"); // 'Just now' gibt es nicht; 'Today' ist vorhanden

  return (
    <PageView
      title={title}
      questionDocument={questionDocument}
      questionContent={questionContent}
      questionTime={questionTime}
      noticeTextPrefix={noticeTextPrefix}
      featureName={featureName}
      noticeTextSuffix={noticeTextSuffix}
    />
  );
}
