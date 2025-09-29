import { _ } from "@/lib/i18n/_";
const t = _;

export const chatHistory = [
  {
    id: "0",
    title: t("Therapy Session Analysis"),
    content: t("Analyze the latest therapy session transcript for key emotional patterns and therapeutic interventions"),
    users: ["/images/avatar-1.jpg"],
    time: "Just now",
    url: "/therapy-support"
  },
  {
    id: "1", 
    title: t("Diagnosis Support"),
    content: t("Review patient symptoms and provide differential diagnosis suggestions based on clinical guidelines"),
    image: "/images/history-image.jpg",
    users: ["/images/avatar-2.jpg"],
    time: "Just now", 
    url: "/diagnosis-support"
  },
  {
    id: "2",
    title: t("Treatment Plan Review"),
    content: t("Evaluate current treatment progress and suggest evidence-based adjustments to therapeutic approach"),
    users: ["/images/avatar.jpg", "/images/avatar-1.jpg", "/images/avatar-2.jpg"],
    time: "Just now",
    url: "/therapy-support"
  },
  {
    id: "3",
    title: t("Clinical Documentation"),
    content: t("Generate structured clinical notes from session transcripts following healthcare documentation standards"),
    users: ["/images/avatar.jpg"],
    time: "Just now",
    url: "/documentation-reports"
  }
];
