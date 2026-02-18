import { _ } from "@/lib/i18n/_";

export function getSocialsPost(t: (key: string) => string) {
  return [{
    id: "0",
    icon: "/images/twitter.svg",
    content: t("Find top talent in a snap with our new Hiring Platform Mobile App! Streamline your recruitment process now."),
    link: "https://brainwave.ui8.net/shortlink/01234",
    tags: ["Hiring", "MobileApp", "Recruitment", "HRTech"],
    images: [{
      id: "0",
      src: "/images/post-pic.jpg"
    }]
  }, {
    id: "1",
    icon: "/images/facebook.svg",
    content: t("Find top talent in a snap with our new Hiring Platform Mobile App! Streamline your recruitment process now."),
    link: "https://brainwave.ui8.net/shortlink/01234",
    tags: ["Hiring", "MobileApp", "Recruitment", "HRTech"],
    images: [{
      id: "0",
      src: "/images/post-pic.jpg"
    }]
  }];
}

export const socailsPost = getSocialsPost(_);
