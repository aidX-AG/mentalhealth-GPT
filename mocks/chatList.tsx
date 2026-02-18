import { _ } from "@/lib/i18n/_";

export function getChatList(t: (key: string) => string) {
  return [{
    id: "0",
    title: t("Transcripts"),
    counter: 48,
    color: "#404446",
    url: "/generation-socials-post"
  }, {
    id: "1",
    title: t("Therapies"),
    counter: 16,
    color: "#8E55EA",
    url: "/"
  }, {
    id: "2",
    title: t("Favorites"),
    counter: 8,
    color: "#3E90F0",
    url: "/education-feedback"
  }, {
    id: "3",
    title: t("Archived"),
    counter: 128,
    color: "#D84C10",
    url: "/code-generation"
  }];
}

export const chatList = getChatList(_);
