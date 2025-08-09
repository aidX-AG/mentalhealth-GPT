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
            {i18next.t("common.div_suggestion_to_improve_your_test_01", { defaultValue: "Suggestion to improve your test" })}</div>
        <div className="">
            <p className="mb-4">
                <strong>{i18next.t("common.p_read_regularly_02", { defaultValue: "Read regularly:" })}</strong> {i18next.t("common.div_reading_is_an_excellent_way_03", { defaultValue: "Reading is an excellent way to improve your vocabulary, grammar, and comprehension skills. Try to read a variety of materials, including books, newspapers, magazines, and online articles." })}</p>
            <p className="mb-4">
                <strong>{i18next.t("common.p_practice_writing_04", { defaultValue: "Practice writing:" })}</strong> {i18next.t("common.div_writing_can_help_you_improve_05", { defaultValue: "Writing can help you improve your grammar, spelling, and sentence structure. Try to write regularly, even if it&apos;s just a short paragraph or a journal entry." })}</p>
            <p className="mb-4">
                <strong>{i18next.t("common.p_listen_to_english_06", { defaultValue: "Listen to English:" })}</strong> {i18next.t("common.div_listening_to_english_podcasts_audiobooks_07", { defaultValue: "Listening to English podcasts, audiobooks, and videos can help you improve your listening and comprehension skills. It can also help you get used to different accents and intonations." })}</p>
            <p className="mb-4">
                <strong>{i18next.t("common.p_speak_with_native_speakers_08", { defaultValue: "Speak with native speakers:" })}</strong> {i18next.t("common.div_speaking_with_native_speakers_can_09", { defaultValue: "Speaking with native speakers can help you improve your pronunciation, fluency, and confidence. You can find language exchange partners or join conversation groups online or in person." })}</p>
            <p>
                <strong>{i18next.t("common.p_learn_grammar_rules_10", { defaultValue: "Learn grammar rules:" })}</strong> {i18next.t("common.div_learning_the_basic_grammar_rules_11", { defaultValue: "Learning the basic grammar rules can help you write and speak more accurately. Try to focus on one rule at a time and practice using it in your writing and speaking. There are many online resources, such as grammar books and videos, that can help you learn grammar rules." })}</p>
        </div>
    </div>
);

export default Feedback;
