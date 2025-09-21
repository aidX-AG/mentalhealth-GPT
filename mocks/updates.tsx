// mocks/updates.tsx
import { _ } from "@/lib/i18n/_";
const t = _;

// -----------------------------------------------------------------------------
// [updates] v1.1.1 — 2025-09-07
// CHANGELOG:
// - v1.1.1: Resolve merge conflict; keep Language_Love-960w.webp + icon "globe-lock";
//           date set to "7 September, 2025".
// - v1.1.0: Added "Expanding to Three Languages" (id: "u3") as first entry.
// - v1.0.0: Initial updates list.
// -----------------------------------------------------------------------------

export const updates = [
  {
    id: "u3",
    title: t("Expanding to Three Languages"),
    date: t("7 September, 2025"),
    imageLight: "/images/Language_Love.jpg",
    imageDark: "/images/Language_Love.jpg",
    icon: "globe-lock",
    content: t(
      "We are excited to announce that mentalhealthGPT is now available in German, French, and English! This expansion dramatically increases our reach. With this step, we enable psychologists, psychiatrists, and therapists from e.g Switzerland, France, Germany, and the global English-speaking community to benefit from our secure, specialized AI. Multilingual access is a key step in making professional mental health support scalable, collaborative, and more effective."
    ),
  },
  {
    id: "0",
    title: t("Bringing It All Together: mentalhealthGPT Enters Integration Phase"),
    date: t("13 July, 2025"),
    icon: "server-cog",
    imageLight: "/images/update-full-stack.jpg",
    imageDark: "/images/update-full-stack.jpg",
    content: t(
      "All core components of mentalhealthGPT are now in place – from the secure frontend interface to the protected AI backend. We’re now entering the integration phase: connecting the frontend, backend, and AI models through a reliable Node.js architecture. This orchestration enables a seamless and secure experience for users – whether you’re a clinician, psychotherapist, mental health advisor, researcher, or individual seeking support. Every step is designed to meet the privacy and reliability needs of mental health professionals."
    ),
  },
  {
    id: "3",
    title: t("Secure Frontend Interface Launched"),
    date: t("12 July, 2025"),
    icon: "layout-dashboard",
    imageLight: "/images/update-chatbot-desktop.jpg",
    imageDark: "/images/update-chatbot-desktop.jpg",
    content: t(
      "We’ve deployed the first secure user interface for mentalhealthGPT, enabling intuitive and privacy-first interaction with our AI services. This marks a big milestone toward bringing our platform directly into clinical hands."
    ),
  },
  {
    id: "1",
    title: t("AI Systems Ready in European Data Center"),
    date: t("1 July, 2025"),
    icon: "cpu",
    imageLight: "/images/update-good-data.jpg",
    imageDark: "/images/update-good-data.jpg",
    content: t(
      "Our custom mentalhealthGPT models are now fully secured, hosted, and scalable within the EU region — ready to support fast and confidential AI services for mental health workflows. All data is end-to-end encrypted and only accessible with decryption keys securely stored in Switzerland."
    ),
  },
  {
    id: "2",
    title: t("Data Privacy Infrastructure Live in Switzerland"),
    date: t("8 June, 2025"),
    icon: "lock",
    imageLight: "/images/update-data-privacy.jpg",
    imageDark: "/images/update-data-privacy.jpg",
    content: t(
      "All patient data is now processed in our zero-trust environment hosted in Switzerland — fully encrypted and compliant with Swiss and European data regulations. Your data remains protected end-to-end."
    ),
  },
];
