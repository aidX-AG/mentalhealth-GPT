type ChatHistoryItem = {
  id: string;
  title: string;
  content: string;
  image?: string;
  users: string[];
  time: string;
  url: string;
};

export function getChatHistory(t: (key: string) => string): ChatHistoryItem[] {
  return [
    {
      id: "0",
      title: t("Therapy Session Analysis"),
      content: t("Analyze the latest therapy session transcript for key emotional patterns and therapeutic interventions"),
      users: ["/images/avatar-1.jpg"],
      time: t("Just now"),
      url: "/therapy-support"
    },
    {
      id: "1",
      title: t("Diagnosis Support"),
      content: t("Review patient symptoms and provide differential diagnosis suggestions based on clinical guidelines"),
      image: "/images/history-image.jpg",
      users: ["/images/avatar-2.jpg"],
      time: t("Just now"),
      url: "/diagnosis-support"
    },
    {
      id: "2",
      title: t("Treatment Plan Review"),
      content: t("Evaluate current treatment progress and suggest evidence-based adjustments to therapeutic approach"),
      users: ["/images/avatar.jpg", "/images/avatar-1.jpg", "/images/avatar-2.jpg"],
      time: t("Just now"),
      url: "/therapy-support"
    },
    {
      id: "3",
      title: t("Clinical Documentation"),
      content: t("Generate structured clinical notes from session transcripts following healthcare documentation standards"),
      users: ["/images/avatar.jpg"],
      time: t("Just now"),
      url: "/documentation-reports"
    }
  ];
}

// Legacy static export – kept for any other consumers that may use it.
// Falls back to untranslated English keys; prefer getChatHistory(t) in components.
export const chatHistory = getChatHistory((key) => key);
