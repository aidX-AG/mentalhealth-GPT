import { useState } from "react";
import Select from "@/components/Select";
import Icon from "@/components/Icon";
import View from "./View";
import { getT } from "@/lib/i18n-runtime";
const t = getT();
const languages = [{
  id: "0",
  title: t("English (United States)")
}, {
  id: "1",
  title: t("French")
}, {
  id: "2",
  title: t("Ukrainian")
}];
const voices = [{
  id: "0",
  title: t("Jenny")
}, {
  id: "1",
  title: t("Mark")
}, {
  id: "2",
  title: t("Jack")
}];
type VideoProps = {};
const Video = ({}: VideoProps) => {
  const [language, setLanguage] = useState<any>(languages[0]);
  const [voice, setVoice] = useState<any>(voices[0]);
  return <div className="">
            <View />
            <div className="mt-4">{t("Based on the gender identified in the uploaded image, the video has been automatically generated with a male voice. However, you have the option to customize your video by selecting from the available options below.")}</div>
            <div className="flex flex-wrap">
                <button className="btn-dark btn-small mr-4 mt-4">
                    <span>{t("Download")}</span>
                    <Icon name={t("download")} />
                </button>
                <Select className="mr-4 mt-4" classOptions="min-w-[12rem]" items={languages} value={language} onChange={setLanguage} small up />
                <Select title={t("Voice")} icon="volume" className="mr-4 mt-4" items={voices} value={voice} onChange={setVoice} small up />
            </div>
        </div>;
};
export default Video;