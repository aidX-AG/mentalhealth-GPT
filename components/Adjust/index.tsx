import Image from "@/components/Image";
import SliderRange from "@/components/SliderRange";
import i18next from "i18next";

type AdjustProps = {
    image: string;
};

const Adjust = ({ image }: AdjustProps) => (
    <div className="">
        <div className="relative h-48">
            <Image
                className="mb-6 rounded-md object-cover"
                src={image}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                alt=""
            />
        </div>
        <div className="mt-6">
            <SliderRange className="mb-2" title={i18next.t("common.sliderrangetitle_exposure_03", { defaultValue: "Exposure" })} />
            <SliderRange className="mb-2" title={i18next.t("common.sliderrangetitle_contrast_04", { defaultValue: "Contrast" })} />
            <SliderRange className="mb-2" title={i18next.t("common.sliderrangetitle_highlights_05", { defaultValue: "Highlights" })} />
            <SliderRange className="mb-2" title={i18next.t("common.sliderrangetitle_shadows_06", { defaultValue: "Shadows" })} />
            <SliderRange className="mb-2" title={i18next.t("common.sliderrangetitle_white_07", { defaultValue: "White" })} />
            <SliderRange className="" title={i18next.t("common.sliderrangetitle_blacks_08", { defaultValue: "Blacks" })} />
        </div>
        <div className="flex space-x-3 mt-6">
            <button className="btn-blue w-full">{i18next.t("common.div_auto_01", { defaultValue: "Auto" })}</button>
            <button className="btn-stroke-light w-full">{i18next.t("common.div_reset_02", { defaultValue: "Reset" })}</button>
        </div>
    </div>
);

export default Adjust;
