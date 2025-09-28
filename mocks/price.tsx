import { _ } from "@/lib/i18n/_";
const t = _;

export const price = [{
  id: "0",
  title: t("Starter"),
  popular: false,
  currentPlan: true,
  description: t("Start your spezialized AI experience"),
  priceMonth: 29,
  priceYear: 290,
  priceDetails: t("Per user"),
  details: [
    t("90 days history"),
    t("Up to 100 messages/mo"),
    t("Security and data protection")]
}, {
  id: "1",
  title: t("Pro"),
  colorTitle: "#3E90F0",
  popular: false,
  currentPlan: false,
  description: t("Advanced mental health AI models"),
  priceMonth: 89,
  priceYear: 990,
  priceDetails: t("Per user"),
  details: [t("Email support"), t("Unlimited messages"), t("Access all AI capabilities")]
}, {
  id: "2",
  title: t("Institution"),
  colorTitle: "#3FDD78",
  popular: true,
  currentPlan: false,
  description: t("For teams and clinics"),
  priceMonth: 390,
  priceYear: 3990,
  priceDetails: t("Per team members"),
  details: [t("Customizable AI models"), t("Advanced team management"), t("Institution-level support")]
}];

export const featuresPrice = [{
  id: "0",
  title: t("Core access to mental health AI"),
  free: true,
  pro: true,
  enterprise: true
}, {
  id: "1",
  title: t("Access to  knowledge base"),
  free: true,
  pro: true,
  enterprise: true
}, {
  id: "2",
  title: t("transcription & documentation"),
  free: true,
  pro: true,
  enterprise: true
}, {
  id: "3",
  title: t("Specialized AI tuned for diagnostics"),
  free: false,
  pro: true,
  enterprise: true
}, {
  id: "4",
  title: t("Priority support"),
  free: false,
  pro: true,
  enterprise: true
}, {
  id: "5",
  title: t("Customizable institutional AI models"),
  free: false,
  pro: false,
  enterprise: true
}, {
  id: "6",
  title: t("AI Training on institution-specific data"),
  free: false,
  pro: false,
  enterprise: true
}, {
  id: "7",
  title: t("Advanced documentation & reporting tools"),
  free: false,
  pro: false,
  enterprise: true
}];
