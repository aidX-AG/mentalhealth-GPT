import Image from "@/components/Image";
import { useTranslation } from "@/lib/i18n/I18nContext";

/**
 * ============================================================================
 * Device
 * Version: v1.1 – 2026-02-17
 * Notes:
 * - Accessible revoke action with contextual aria-label
 * - Optional handler; deterministic disabled behavior
 * ============================================================================
 */

type DeviceItem = {
  id: string;
  title: string;
  image: string;
  address: string;
  date: string;
};

type DeviceProps = {
  item: DeviceItem;
  onRevoke?: (id: string) => void;
};

const Device = ({ item, onRevoke }: DeviceProps) => {
  const t = useTranslation();

  const canRevoke = typeof onRevoke === "function";

  const handleRevoke = () => {
    if (!canRevoke) return;
    onRevoke(item.id);
  };

  return (
    <div className="flex items-start py-6 border-t border-n-3 dark:border-n-6">
      <div className="flex justify-center items-center shrink-0 w-12 h-12 mr-4 px-2 bg-n-3 rounded-xl dark:bg-n-5">
        <Image
          className="w-full"
          src={item.image}
          width={32}
          height={32}
          alt={item.title || ""}
        />
      </div>

      <div className="grow">
        <div className="mb-1 base1 font-semibold text-n-6 dark:text-n-3">
          {item.title}
        </div>

        <div className="base2 text-n-4">
          <div>{item.address}</div>
          <div>{item.date}</div>
        </div>
      </div>

      <button
        type="button"
        className="btn-stroke-light shrink-0 ml-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-1 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleRevoke}
        disabled={!canRevoke}
        aria-disabled={!canRevoke}
        aria-label={`${t("Revoke")} — ${item.title}`}
      >
        {t("Revoke")}
      </button>
    </div>
  );
};

export default Device;
