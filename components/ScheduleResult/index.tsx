import i18next from "i18next";
import { useTranslation } from 'react-i18next';

type ScheduleResultProps = {};

const ScheduleResult = ({}: ScheduleResultProps) => (
    <div className="">
        <div className="mb-3 font-bold">{tCommon("misc.done", { defaultValue: "You are done!" })}</div>
        <div className="mb-5">
            {tCommon("misc.post-scheduled", { defaultValue: "Your post has been scheduled for February 14th, 2023 at 11:30 and will be shared through" })}{" "}
            <a
                className="text-primary-1"
                href="https://buffer.com/"
                target="_blank"
                rel="noopener noreferrer"
            >
                {tCommon("misc.buffer", { defaultValue: "Buffer" })}</a>
            {tCommon("misc.period", { defaultValue: "." })}</div>
        <button className="btn-dark btn-small">{tCommon("links.view-on-buffer", { defaultValue: "View on Buffer" })}</button>
    </div>
);

export default ScheduleResult;
