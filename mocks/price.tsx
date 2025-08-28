import { getT } from "@/lib/i18n-runtime";
const t = getT();
export const price = [{
  id: "0",
  title: t("Free"),
  popular: false,
  currentPlan: true,
  description: t("Basic chat functionality"),
  priceMonth: 0,
  priceYear: 0,
  priceDetails: "Free forever",
  details: ["30 days history", "Up to 1000 messages/mo", "Limited AI capabilities"]
}, {
  id: "1",
  title: t("Pro"),
  colorTitle: "#3E90F0",
  popular: false,
  currentPlan: false,
  description: t("More advanced AI capabilities"),
  priceMonth: 89,
  priceYear: 999,
  priceDetails: "Per month, per team members",
  details: ["Email support", "Unlimited messages", "Access to AI capabilities"]
}, {
  id: "2",
  title: t("Enterprise"),
  colorTitle: "#3FDD78",
  popular: true,
  currentPlan: false,
  description: t("For large team and business"),
  priceMonth: 399,
  priceYear: 2399,
  priceDetails: "Per month, per teaam members",
  details: ["Customizable AI models", "Advanced team management", "Enterprise-level support"]
}];
export const featuresPrice = [{
  id: "0",
  title: t("Access full to AI capabilities"),
  free: true,
  pro: true,
  enterprise: true
}, {
  id: "1",
  title: t("Access to documentation"),
  free: true,
  pro: true,
  enterprise: true
}, {
  id: "2",
  title: t("Enterprise-level support"),
  free: false,
  pro: true,
  enterprise: true
}, {
  id: "3",
  title: t("Enterprise-level support"),
  free: false,
  pro: false,
  enterprise: true
}, {
  id: "4",
  title: t("Support"),
  free: false,
  pro: true,
  enterprise: true
}, {
  id: "5",
  title: t("Integration with CRMs"),
  free: false,
  pro: false,
  enterprise: true
}, {
  id: "6",
  title: t("Customizable AI models"),
  free: false,
  pro: false,
  enterprise: true
}, {
  id: "7",
  title: t("Dedicated account manager"),
  free: false,
  pro: false,
  enterprise: true
}];