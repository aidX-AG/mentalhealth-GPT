import Details from "./Details";
import Assessment from "./Assessment";
import i18next from "i18next";

type FeedbackProps = {};

const Feedback = ({}: FeedbackProps) => (
    <div className="">
        <div className="max-w-[38rem] mb-5 bg-n-1 rounded-2xl xl:max-w-full dark:bg-n-6">
            <Details />
            <Assessment />
        </div>
        <div className="mb-5 body1 md:body1S">
            {i18next.t("common.sections.suggestion", { defaultValue: "Suggestion to improve your test" })}</div>
        <div className="">
            <p className="mb-4">
                <strong>{i18next.t("common.sections.read-regularly", { defaultValue: "Read regularly:" })}</strong> {i18next.t("common.body.reading-benefits", { defaultValue: "Reading is an excellent way to improve your vocabulary, grammar, and comprehension skills. Try to read a variety of materials, including books, newspapers, magazines, and online articles." })}</p>
            <p className="mb-4">
                <strong>{i18next.t("common.sections.practice-writing", { defaultValue: "Practice writing:" })}</strong> {i18next.t("common.body.writing-benefits", { defaultValue: "Writing can help you improve your grammar, spelling, and sentence structure. Try to write regularly, even if it&apos;s just a short paragraph or a journal entry." })}</p>
            <p className="mb-4">
                <strong>{i18next.t("common.sections.listen-to-english", { defaultValue: "Listen to English:" })}</strong> {i18next.t("common.body.listening-benefits", { defaultValue: "Listening to English podcasts, audiobooks, and videos can help you improve your listening and comprehension skills. It can also help you get used to different accents and intonations." })}</p>
            <p className="mb-4">
                <strong>{i18next.t("common.sections.speak-with-natives", { defaultValue: "Speak with native speakers:" })}</strong> {i18next.t("common.body.speaking-benefits", { defaultValue: "Speaking with native speakers can help you improve your pronunciation, fluency, and confidence. You can find language exchange partners or join conversation groups online or in person." })}</p>
            <p>
                <strong>{i18next.t("common.sections.learn-grammar-rules", { defaultValue: "Learn grammar rules:" })}</strong> {i18next.t("common.body.grammar-benefits", { defaultValue: "Learning the basic grammar rules can help you write and speak more accurately. Try to focus on one rule at a time and practice using it in your writing and speaking. There are many online resources, such as grammar books and videos, that can help you learn grammar rules." })}</p>
        </div>
    </div>
);

export default Feedback;
