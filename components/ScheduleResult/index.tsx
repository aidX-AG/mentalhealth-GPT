import i18next from "i18next";

type ScheduleResultProps = {};

const ScheduleResult = ({}: ScheduleResultProps) => (
    <div className="">
        <div className="mb-3 font-bold">{i18next.t("common.div_you_are_done_01", { defaultValue: "You are done!" })}</div>
        <div className="mb-5">
            {i18next.t("common.div_your_post_has_been_scheduled_02", { defaultValue: "Your post has been scheduled for February 14th, 2023 at 11:30 and will be shared through" })}{" "}
            <a
                className="text-primary-1"
                href="https://buffer.com/"
                target="_blank"
                rel="noopener noreferrer"
            >
                {i18next.t("common.div_buffer_03", { defaultValue: "Buffer" })}</a>
            {i18next.t("common.div_text_04", { defaultValue: "." })}</div>
        <button className="btn-dark btn-small">{i18next.t("common.div_view_on_buffer_05", { defaultValue: "View on Buffer" })}</button>
    </div>
);

export default ScheduleResult;
