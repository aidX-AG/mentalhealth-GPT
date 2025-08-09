import i18next from "i18next";

type ScheduleResultProps = {};

const ScheduleResult = ({}: ScheduleResultProps) => (
    <div className="">
        <div className="mb-3 font-bold">{i18next.t("common.misc.done", { defaultValue: "You are done!" })}</div>
        <div className="mb-5">
            {i18next.t("common.misc.post-scheduled", { defaultValue: "Your post has been scheduled for February 14th, 2023 at 11:30 and will be shared through" })}{" "}
            <a
                className="text-primary-1"
                href="https://buffer.com/"
                target="_blank"
                rel="noopener noreferrer"
            >
                {i18next.t("common.misc.buffer", { defaultValue: "Buffer" })}</a>
            {i18next.t("common.misc.period", { defaultValue: "." })}</div>
        <button className="btn-dark btn-small">{i18next.t("common.links.view-on-buffer", { defaultValue: "View on Buffer" })}</button>
    </div>
);

export default ScheduleResult;
