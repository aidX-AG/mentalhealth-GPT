import { getT } from "@/lib/i18n-runtime";
const t = getT();
// frontend/mocks/faq.ts

export const faqs = [{
  id: "0",
  title: t("How is patient data protected when using mentalhealthGPT?"),
  content: t("Data protection is our highest priority. All interactions are end-to-end encrypted directly in the browser, ensuring that even we as operators cannot access the content. The decryption keys are stored exclusively in Switzerland, completely separated from the processing infrastructure. Data never leaves the closed System unencrypted – and full control remains with the user or institution at all times."),
  defaultOpen: true
}, {
  id: "1",
  title: t("Is mentalhealthGPT compliant with medical privacy laws?"),
  content: t("Only the user has access to the encrypted data. No one else – not even our technical team – can decrypt or view the data. This ensures full compliance with the highest data protection standards (GDPR, Swiss DSG, and clinical-grade confidentiality). The mentalhealthGPT platform is designed from the ground up as zero-access and privacy-first."),
  defaultOpen: false
}, {
  id: "2",
  title: t("What makes mentalhealthGPT different from other chatbots like ChatGPT or DeepSeek?"),
  content: t("mentalhealthGPT is not just a general-purpose AI repurposed for mental health – it is specifically designed from the ground up to serve the needs of mental health professionals, clinics, and patients. While platforms like ChatGPT or DeepSeek offer powerful language capabilities, they are not tailored for clinical accuracy, therapeutic tone, or privacy-critical environments. mentalhealthGPT uses specialized AI models that have been fine-tuned on mental health contexts – including psychotherapy, diagnostics, patient communication, research workflows, and administrative tasks. This leads to more context-aware, ethically aligned, and medically relevant outputs. Moreover, we enforce strict encryption, with decryption keys held exclusively in Switzerland. This zero-trust architecture means only the authorized user can read the data – not even we as developers. The result: a trusted digital assistant designed for the realities of clinical practice, enabling safe, accurate, and efficient support across the mental healthcare spectrum."),
  defaultOpen: false
}, {
  id: "3",
  title: t("What do the different AI chat areas mean (therapy, supervision, documentation etc.)?"),
  content: t("Each AI area within mentalhealthGPT reflects a distinct clinical use case – supported by purpose-built language models, specifically trained for their tasks: • **Therapy Support AI** assists in structuring sessions, reflecting on interaction styles, or preparing interventions with clinical empathy and relevance. • **Supervision & Training** offers role-based dialogue analysis, self-reflection aids, and interactive simulations for continued development. • **Diagnosis Support** helps structure symptom profiles, compare clinical hypotheses, and draft ICD/DSM-aligned summaries. • **Audio Transcription & Notes** transforms recorded therapy sessions into accurate, structured notes – including summaries, key moments, and documentation-ready output. • **Video Analysis** supports movement-, mood-, and interaction-pattern recognition, enabling new insights in multimodal assessments (e.g., child therapy). • **Documentation & Reporting** streamlines clinical reporting with pre-structured, editable drafts based on real content, aligned with institutional standards. By offering separate, specialized assistants, we ensure each AI response is tailored, safe, and clinically valuable – right from the first use."),
  defaultOpen: false
}, {
  id: "4",
  title: t("How do I know the responses are safe and clinically appropriate?"),
  content: t("Unlike general-purpose chatbots, mentalhealthGPT is based on domain-specific language models that are pre-trained on mental health literature, therapeutic frameworks, and real-world clinical cases (anonymized). These models are not only deeply aligned with the language and logic of mental health care, but are also continuously refined by our team of experts – including psychiatrists, psychologists, and clinical ethicists. We combine this technical foundation with rigorous human-in-the-loop validation and ethical review processes. Every model is monitored and benchmarked against clinical standards to ensure relevance, reliability, and safety. Our goal is to offer professionals a trustworthy AI assistant that speaks their language and understands the nuanced context of mental health work."),
  defaultOpen: false
}, {
  id: "5",
  title: t("Is mentalhealthGPT available in multiple languages?"),
  content: t("Yes, currently we support English, German, and French. Additional languages can be activated upon request. For institutional partners, we also offer model fine-tuning in native terminology and style – ensuring professional use even in local dialects or therapeutic schools."),
  defaultOpen: false
}, {
  id: "6",
  title: t("Can I use mentalhealthGPT as an individual professional and as part of an institution?"),
  content: t("Absolutely. mentalhealthGPT is built to support both independent professionals and larger institutions. As an individual therapist, psychologist, or psychiatrist, you can immediately benefit from a secure and private setup tailored to your personal clinical work. You'll have access to dedicated tools, encrypted data handling, and models that understand the language of your profession. For clinics, hospitals, and practices, we offer extended features such as team-based access, shared context models, integration with internal systems, and the ability to train organization-specific expert models. This ensures that your institution’s knowledge, terminology, and care philosophy are reflected in the AI’s responses. Whether you work alone or in a multidisciplinary team – mentalhealthGPT adapts to your context, helping you deliver consistent, efficient, and privacy-compliant care."),
  defaultOpen: false
}, {
  id: "7",
  title: t("Can we have our own dedicated mental health AI specialist?"),
  content: t("Yes – and that’s one of the most powerful things we offer. We help your clinic, institution, or group practice create its own private mental health AI specialist. This expert is trained using your documentation, therapeutic language, and organizational culture. The specialization happens on three levels: institution-wide, for individual departments (such as child & adolescent therapy or bipolar care), and even for complex cases with significant therapy history. This creates an AI that truly understands your professional context – from how you speak to how you work. Unlike generic chatbots, your AI is aligned with your values, expertise, and standards. It supports your team, enhances consistency, and is constantly improving. For clinics, research labs, and even larger private practices, this means safer, smarter, and more effective digital support — one that becomes a real part of your therapeutic system."),
  defaultOpen: false
}];