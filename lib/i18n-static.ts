type Messages = Record<string, string>;
export type Locale = "en" | "de" | "fr" | "es";

const NAMESPACES = [
  "applications", "audio-transcription", "checkout", "common",
  "diagnosis-support", "documentation-reports", "generation-socials-post",
  "homepage", "pricing", "sign-in", "supervision-training", "thanks",
  "therapy-support", "updates-and-faq", "video-analysis",
] as const;

// super-simpler, synchroner Loader
export function loadMessages(locale: string): Messages {
  const lang: Locale =
    locale.startsWith("de") ? "de" :
    locale.startsWith("fr") ? "fr" :
    locale.startsWith("es") ? "es" :
    "en";

  // Core
  const core = require(`../locales/${lang}.json`);
  let messages: Messages = { ...core };

  // Namespaces
  for (const ns of NAMESPACES) {
    try {
      const nsData = require(`../locales/${lang}/${ns}.json`);
      messages = { ...messages, ...nsData };
    } catch {
      // namespace-Datei fehlt → okay
    }
  }
  return messages;
}

export function makeT(dict: Messages) {
  return (input: string) => dict[input] ?? input;
}
