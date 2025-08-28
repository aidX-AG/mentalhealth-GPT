import Image from "@/components/Image";
import SliderRange from "@/components/SliderRange";
import { getT } from "@/lib/i18n-runtime";
const t = getT();
type AdjustProps = {
  image: string;
};
const Adjust = ({
  image
}: AdjustProps) => <div className="">
        <div className="relative h-48">
            <Image className="mb-6 rounded-md object-cover" src={image} fill sizes="(max-width: 768px) 100vw, 25vw" alt="" />
        </div>
        <div className="mt-6">
            <SliderRange className="mb-2" title={t("Exposure")} />
            <SliderRange className="mb-2" title={t("Contrast")} />
            <SliderRange className="mb-2" title={t("Highlights")} />
            <SliderRange className="mb-2" title={t("Shadows")} />
            <SliderRange className="mb-2" title={t("White")} />
            <SliderRange className="" title={t("Blacks")} />
        </div>
        <div className="flex space-x-3 mt-6">
            <button className="btn-blue w-full">{t("Auto")}</button>
            <button className="btn-stroke-light w-full">{t("Reset")}</button>
        </div>
    </div>;
export default Adjust;