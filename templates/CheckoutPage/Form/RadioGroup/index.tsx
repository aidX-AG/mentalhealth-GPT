import { RadioGroup } from "@headlessui/react";
import Icon from "@/components/Icon";
import { getT } from "@/lib/i18n-runtime";
const t = getT();
type RadioType = {
  id: string;
  title: string; // bereits in passender Sprache
  value: number;
  save?: number;
};
type RadioProps = {
  items: RadioType[];
  value: RadioType;
  setValue: (v: RadioType) => void;
  payPrefix: string; // "Pay"
  perMonthSuffix: string; // "/month"
  saveLabel: string; // "Save"
};
const Radio = ({
  items,
  value,
  setValue,
  payPrefix,
  perMonthSuffix,
  saveLabel
}: RadioProps) => {
  return <RadioGroup className="flex mb-6 space-x-3 md:block md:space-x-0 md:space-y-4" value={value} onChange={setValue} name={t("plan")}>
      {items.map(item => <RadioGroup.Option key={item.id} value={item} className="p-3.5 basis-1/2 bg-n-2 border-2 border-n-2 rounded-xl transition-colors ui-checked:border-primary-1 ui-checked:bg-transparent cursor-pointer tap-highlight-color dark:bg-transparent dark:border-transparent dark:ui-checked:border-primary-1">
          <div className="flex mb-1">
            <div className="base2 dark:text-n-4">
              {payPrefix} {item.title}
            </div>
            <Icon className="ml-auto fill-primary-1 opacity-0 transition-opacity ui-checked:opacity-100" name={t("check-thin")} />
          </div>
          <div className="flex items-center">
            <div className="base1 font-semibold">{t("$")}{item.value}{perMonthSuffix}
            </div>
            {item.save && <div className="ml-auto px-2 base2 bg-primary-2/15 rounded text-[#0C923C]">
                {saveLabel} {item.save}{t("%")}</div>}
          </div>
        </RadioGroup.Option>)}
    </RadioGroup>;
};
export default Radio;