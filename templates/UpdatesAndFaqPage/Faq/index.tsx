import FaqItem from "@/components/FaqItem";
import Image from "@/components/Image";
import i18next from "i18next";

type FaqItems = {
    id: string;
    title: string;
    content: string;
    defaultOpen: boolean;
};

type FaqProps = {
    items: FaqItems[];
};

const Faq = ({ items }: FaqProps) => (
    <>
        <div>
            {items.map((x) => (
                <FaqItem item={x} key={x.id} />
            ))}
        </div>
        <div className="mt-12 p-20 bg-n-2/50 rounded-[1.25rem] text-center md:py-16 md:px-8 dark:bg-n-7/50">
            <div className="w-28 mx-auto mb-8">
                <Image
                    src="/images/faq-image.svg"
                    width={112}
                    height={112}
                    alt=""
                />
            </div>
            <div className="mb-1 h5">{i18next.t("updates-and-faq.div_cant_find_any_answer_01", { defaultValue: "Can’t find any answer?" })}</div>
            <div className="mb-8 base1 text-n-4">
                {i18next.t("updates-and-faq.div_lets_ask_the_smartest_ai_02", { defaultValue: "Let’s ask the smartest AI Chat" })}</div>
            <button className="btn-blue">{i18next.t("updates-and-faq.div_ask_mentalhealth_gpt_03", { defaultValue: "Ask mentalhealthGPT" })}</button>
        </div>
    </>
);

export default Faq;
