import { getT } from "@/lib/i18n-runtime";
const t = getT();
export const exportImage = [{
  title: t("Export"),
  list: [{
    title: t("JPG Small"),
    details: t("For web"),
    image: "/images/image-purple.svg"
  }, {
    title: t("JPG Large"),
    details: t("Original + Settings"),
    image: "/images/image-blue.svg"
  }]
}, {
  title: t("Share"),
  list: [{
    title: t("Get a link"),
    icon: "link"
  }, {
    title: t("Invite teammates"),
    icon: "invite"
  }]
}, {
  title: t("Upload"),
  list: [{
    title: t("Facebook"),
    image: "/images/facebook.svg"
  }, {
    title: t("Twitter"),
    image: "/images/twitter.svg"
  }]
}];
export const exportAudio = [{
  title: t("Export"),
  list: [{
    title: t(".MP3"),
    details: t("Small - 320kbps"),
    image: "/images/note-purple.svg"
  }, {
    title: t(".WAV"),
    details: t("Large - 44.1 kHz"),
    image: "/images/note-blue.svg"
  }]
}, {
  title: t("Share"),
  list: [{
    title: t("Get a link"),
    icon: "link"
  }, {
    title: t("Invite teammates"),
    icon: "invite"
  }]
}, {
  title: t("Upload"),
  list: [{
    title: t("Spotify"),
    image: "/images/spotify.svg"
  }]
}];