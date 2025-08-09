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
            <SliderRange className="mb-2" title={i18next.t("common.controls.exposure", { defaultValue: "Exposure" })} />
            <SliderRange className="mb-2" title={i18next.t("common.controls.contrast", { defaultValue: "Contrast" })} />
            <SliderRange className="mb-2" title={i18next.t("common.controls.highlights", { defaultValue: "Highlights" })} />
            <SliderRange className="mb-2" title={i18next.t("common.controls.shadows", { defaultValue: "Shadows" })} />
            <SliderRange className="mb-2" title={i18next.t("common.controls.white", { defaultValue: "White" })} />
            <SliderRange className="" title={i18next.t("common.controls.blacks", { defaultValue: "Blacks" })} />
        </div>
        <div className="flex space-x-3 mt-6">
            <button className="btn-blue w-full">{i18next.t("common.misc.auto", { defaultValue: "Auto" })}</button>
            <button className="btn-stroke-light w-full">{i18next.t("common.misc.reset", { defaultValue: "Reset" })}</button>
        </div>
    </div>
);

export default Adjust;
