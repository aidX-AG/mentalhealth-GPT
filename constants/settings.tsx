import { getT } from "@/lib/i18n-runtime";
const t = getT();
export const settings = [{
  id: "edit-profile",
  title: t("Edit profile"),
  icon: "profile"
}, {
  id: "password",
  title: t("Password"),
  icon: "lock-1"
}, {
  id: "notifications",
  title: t("Notifications"),
  icon: "bell"
}, {
  id: "chat-export",
  title: t("Chat export"),
  icon: "download-fill"
}, {
  id: "sessions",
  title: t("Sessions"),
  icon: "log-in"
}, {
  id: "applications",
  title: t("Applications"),
  icon: "container"
}, {
  id: "team",
  title: t("Team"),
  icon: "users-plus"
}, {
  id: "appearance",
  title: t("Appearance"),
  icon: "sun"
}, {
  id: "delete-account",
  title: t("Delete account"),
  icon: "close-fat"
}];