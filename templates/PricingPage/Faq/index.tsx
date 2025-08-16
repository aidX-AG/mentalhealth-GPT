import FaqItem from "@/components/FaqItem";

type FaqItemType = {
    id: string;
    title: string;
    content: string;
    defaultOpen?: boolean;
};

const faqPricing: FaqItemType[] = [
    {
        id: "0",
        title: "Can I try mentalhealthGPT before committing to a paid plan?",
        content:
            "Yes, we offer a free plan with limited access to AI capabilities. This allows you to explore the platform and see if it meets your needs before upgrading to a paid plan.",
        defaultOpen: true,
    },
    {
        id: "1",
        title: "Do you offer a free trial for any of the plans?",
        content:
            "Yes, the free plan functions as a trial with limited features. As we expand, selected features like transcription or documentation may also include time-limited trial access.",
    },
    {
        id: "2",
        title: "What is the Founding Membership and why should I join?",
        content:
            "The Founding Membership is a one-time opportunity to support the early development of mentalhealthGPT and gain exclusive access and benefits. By contributing early (e.g., €90/CHF90 for the first year), you get full access to all new features as they’re released — including transcription, documentation, and domain-specific AI assistants. As a thank-you, your second year will be free. Founding Members are more than users: they help shape the roadmap and can actively provide feedback. It’s ideal for professionals and institutions who want to be part of something transformative from the very beginning.",
    },
];

const Faq = () => (
    <div className="py-32 px-15 2xl:py-20 2xl:px-10 xl:px-8 dark:bg-n-7/25">
        <div className="max-w-[47.75rem] mx-auto">
            <div className="mb-12 text-center h3 lg:h4">
                Frequently asked questions
            </div>
            <div>
                {faqPricing.map((x) => (
                    <FaqItem item={x} key={x.id} />
                ))}
            </div>
        </div>
    </div>
);

export default Faq;
