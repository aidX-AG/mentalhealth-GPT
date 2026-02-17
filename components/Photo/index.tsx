import Image from "@/components/Image";
import Actions from "@/components/Actions";
import Icon from "@/components/Icon";
import Export from "@/components/Export";
import Adjust from "@/components/Adjust";
import { useTranslation } from "@/lib/i18n/I18nContext";

export type PhotoAction =
  | { type: "export"; id: string }
  | { type: "createVariation" }
  | { type: "adjust"; payload?: any }
  | { type: "enhance" }
  | { type: "pickColor" };

type PhotoProps = {
  content: string;
  image: string;
  colorPicker?: boolean;
  onAction?: (action: PhotoAction) => void;
};

const Photo = ({
  content,
  image,
  colorPicker,
  onAction,
}: PhotoProps) => {
  const t = useTranslation();

  return (
    <div>
      <p>{content}</p>

      <div className="relative max-w-[34.75rem] h-[23.75rem] mt-5 xl:max-w-full">
        <Image
          className="rounded-xl object-cover"
          src={image}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1499px) 50vw, 33.33vw"
          alt={t("Photo")}
        />

        {colorPicker && (
          <button
            type="button"
            onClick={() => onAction?.({ type: "pickColor" })}
            disabled={!onAction}
            className="absolute top-4 right-4 z-1 flex justify-center items-center w-9 h-9 bg-n-1 rounded-lg shadow-[0_0.3125rem_0.75rem_-0.25rem_#C3CAD2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-1"
          >
            <div
              className="w-5 h-5 rounded"
              style={{ backgroundColor: "#4667BC" }}
              aria-hidden="true"
            />
          </button>
        )}
      </div>

      <div className="flex flex-wrap mt-1 2xl:-mx-2">
        <Actions
          className="mr-4 mt-4 2xl:w-[calc(50%-1rem)] 2xl:mx-2"
          classButton="btn-dark 2xl:w-full"
          classTitle="pl-3"
          title={t("Exporting 1 photo")}
          buttonInner={
            <>
              <span>{t("Export")}</span>
              <Icon name="share" />
            </>
          }
        >
          <Export typeImage onSelect={(id) => onAction?.({ type: "export", id })} />
        </Actions>

        <button
          type="button"
          onClick={() => onAction?.({ type: "createVariation" })}
          disabled={!onAction}
          className="btn-white btn-small mr-4 mt-4 2xl:w-[calc(50%-1rem)] 2xl:mx-2 md:capitalize"
        >
          <span>
            <span className="md:hidden">{t("Create")}</span>
            {t("variation")}
          </span>
          <Icon name="plus-circle-stroke" />
        </button>

        <Actions
          className="mr-4 mt-4 2xl:w-[calc(50%-1rem)] 2xl:mx-2"
          classButton="btn-white ui-open:bg-n-4/50 2xl:w-full dark:ui-open:bg-n-1/20"
          title={t("Adjust")}
          buttonInner={
            <>
              <span>{t("Adjust")}</span>
              <Icon name="share" />
            </>
          }
        >
          <Adjust image={image} />
        </Actions>

        <button
          type="button"
          onClick={() => onAction?.({ type: "enhance" })}
          disabled={!onAction}
          className="btn-white btn-small mt-4 2xl:w-[calc(50%-1rem)] 2xl:mx-2"
        >
          <span>{t("Enhance")}</span>
          <Icon name="scale" />
        </button>
      </div>
    </div>
  );
};

export default Photo;
