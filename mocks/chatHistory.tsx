import { getT } from "@/lib/i18n-runtime";
const t = getT();
export const chatHistory = [{
  id: "0",
  title: t("aidX AI UI"),
  content: t("Write code (HTML, CSS and JS) for a simple form with 3 input fields and a dropdown with 2 buttons, cancel and send"),
  users: ["/images/avatar-1.jpg"],
  time: "Just now",
  url: "/education-feedback"
}, {
  id: "1",
  title: t("Welcome page with input"),
  content: t("Write code (HTML, CSS and JS) for a simple form with 3 input fields and a dropdown with 2 buttons, cancel and send"),
  image: "/images/history-image.jpg",
  users: ["/images/avatar-2.jpg"],
  time: "Just now",
  url: "/code-generation"
}, {
  id: "2",
  title: t("Photo retouch"),
  content: t("Write code (HTML, CSS and JS) for a simple form with 3 input fields and a dropdown with 2 buttons, cancel and send"),
  users: ["/images/avatar.jpg", "/images/avatar-1.jpg", "/images/avatar-2.jpg"],
  time: "Just now",
  url: "/photo-editing"
}, {
  id: "3",
  title: t("Auto generate title"),
  content: t("Write code (HTML, CSS and JS) for a simple form with 3 input fields and a dropdown with 2 buttons, cancel and send"),
  users: ["/images/avatar.jpg"],
  time: "Just now",
  url: "/audio-generation"
}];