import { _ } from "@/lib/i18n/_";

export function getResultSearch(t: (key: string) => string) {
  return [{
    id: "0",
    title: t("Today"),
    date: t("Thu 16 Feb"),
    list: [{
      id: "0",
      author: "Jack",
      title: t("How can I be more productive?"),
      content: t("With increasing demands in personal and professional life, people often look for ways to boost their productivity and time management skills."),
      time: "1m ago",
      avatar: "/images/avatar-1.jpg",
      online: true,
      url: "/"
    }, {
      id: "1",
      author: "Anna",
      title: t("How can I learn a new language quickly?"),
      content: t("Language learning is a popular activity, and people often ask for advice on how to accelerate their learning process and improve their fluency in a new language."),
      time: "5m ago",
      avatar: "/images/avatar-2.jpg",
      online: true,
      url: "/"
    }, {
      id: "2",
      author: "Wowa",
      title: t("Write a Welcome Page in HTML and CSS"),
      content: t("Write code (HTML, CSS and JS) for a simple form with 3 input fields and a dropdown with 2 buttons, cancel and send"),
      time: "22m ago",
      avatar: "/images/avatar-3.jpg",
      online: false,
      url: "/"
    }, {
      id: "3",
      author: "Artur",
      title: t("How can I optimize my code for search engine optimization (SEO)"),
      content: t("Write code (HTML, CSS and JS) for a simple form with 3 input fields and a dropdown with 2 buttons, cancel and send"),
      time: "1h ago",
      avatar: "/images/avatar-4.jpg",
      online: false,
      url: "/"
    }, {
      id: "4",
      author: "Tram",
      title: t("How can I make my website more secure against cyber attacks?"),
      content: t("Write code (HTML, CSS and JS) for a simple form with 3 input fields and a dropdown with 2 buttons, cancel and send"),
      time: "6 ago",
      avatar: "/images/avatar-5.jpg",
      online: true,
      url: "/"
    }]
  }, {
    id: "1",
    title: t("Last 30 days"),
    list: [{
      id: "0",
      author: "Jack",
      title: t("What's the best way to implement a database in my web application?"),
      content: t("Write code (HTML, CSS and JS) for a simple form with 3 input fields and a dropdown with 2 buttons, cancel and send"),
      time: "1m ago",
      avatar: "/images/avatar-1.jpg",
      online: false,
      url: "/"
    }, {
      id: "1",
      author: "Anna",
      title: t("What is the best way to prepare for a job interview?"),
      content: t("Job interviews are an important step in securing a job, and people often ask for advice on how to present themselves and answer questions confidently during an interview."),
      time: "1m ago",
      avatar: "/images/avatar-2.jpg",
      online: false,
      url: "/"
    }]
  }];
}

export const resultSearch = getResultSearch(_);
