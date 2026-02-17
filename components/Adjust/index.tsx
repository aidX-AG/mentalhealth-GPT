import Image from "@/components/Image";
import SliderRange from "@/components/SliderRange";
import { useTranslation } from "@/lib/i18n/I18nContext";

type AdjustProps = {
  image: string;
  onAuto?: () => void;
  onReset?: () => void;
};

const Adjust = ({ image, onAuto, onReset }: AdjustProps) => {
  const t = useTranslation();

  const canAuto = typeof onAuto === "function";
  const canReset = typeof onReset === "function";

  return (
    <div>
      <div className="relative h-48">
        <Image
          className="mb-6 rounded-md object-cover"
          src={image}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          alt={t("Image preview")}
        />
      </div>

      <div className="mt-6">
        <SliderRange className="mb-2" title={t("Exposure")} />
        <SliderRange className="mb-2" title={t("Contrast")} />
        <SliderRange className="mb-2" title={t("Highlights")} />
        <SliderRange className="mb-2" title={t("Shadows")} />
        <SliderRange className="mb-2" title={t("White")} />
        <SliderRange title={t("Blacks")} />
      </div>

      <div className="flex space-x-3 mt-6">
        <button
          type="button"
          onClick={() => onAuto?.()}
          disabled={!canAuto}
          aria-disabled={!canAuto}
          className="btn-blue w-full"
        >
          {t("Auto")}
        </button>

        <button
          type="button"
          onClick={() => onReset?.()}
          disabled={!canReset}
          aria-disabled={!canReset}
          className="btn-stroke-light w-full"
        >
          {t("Reset")}
        </button>
      </div>
    </div>
  );
};

export default Adjust;
