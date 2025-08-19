// app/[locale]/page.tsx
import { Metadata } from "next";

type PageProps = {
  params: { locale: string };
};

// 🔹 Lokalisierte Meta-Daten für die Startseite
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const titles: Record<string, string> = {
    en: "mentalhealthGPT – Your AI partner for mental health",
    de: "mentalhealthGPT – Ihr KI-Partner für psychische Gesundheit",
    fr: "mentalhealthGPT – Votre partenaire IA pour la santé mentale",
  };

  const descriptions: Record<string, string> = {
    en: "Expert AI for mental health – secure, private, and scientifically validated.",
    de: "Experten-KI für psychische Gesundheit – sicher, geschützt und wissenschaftlich validiert.",
    fr: "IA experte pour la santé mentale – sécurisée, privée et validée scientifiquement.",
  };

  const locale = params.locale || "en";

  return {
    title: titles[locale],
    description: descriptions[locale],
  };
}

// 🔹 Content (noch ohne t(), erstmal Routing-Test)
export default function HomePage({ params }: PageProps) {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">
        Willkommen bei mentalhealthGPT ({params.locale})
      </h1>
      <p className="mt-4 text-lg">
        Diese Seite ist ein Test für Sprach-Routing und Metadaten.
      </p>
    </main>
  );
}
