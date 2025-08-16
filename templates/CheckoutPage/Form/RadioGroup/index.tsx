import { RadioGroup } from "@headlessui/react";
import { useTranslation } from 'react-i18next';
import Icon from "@/components/Icon";
import i18next from "i18next";

type RadioType = {
    id: string;
    title: string;
    value: number;
    save?: number;
};

type RadioProps = {
    items: RadioType[];
    value: any;
    setValue: any;
};

const Radio = ({ items, value, setValue }: RadioProps) => {
  const { t: tCheckout } = useTranslation("checkout");

    return (
        <RadioGroup
            className="flex mb-6 space-x-3 md:block md:space-x-0 md:space-y-4"
            value={value}
            onChange={setValue}
            name="plan"
        >
            {items.map((item) => (
                <RadioGroup.Option
                    key={item.id}
                    value={item}
                    className="p-3.5 basis-1/2 bg-n-2 border-2 border-n-2 rounded-xl transition-colors ui-checked:border-primary-1 ui-checked:bg-transparent cursor-pointer tap-highlight-color dark:bg-transparent dark:border-transparent dark:ui-checked:border-primary-1"
                >
                    <div className="flex mb-1">
                        <div className="base2 dark:text-n-4">
                            {tCheckout("sections.pay", { defaultValue: "Pay" })}{item.title}
                        </div>
                        <Icon
                            className="ml-auto fill-primary-1 opacity-0 transition-opacity ui-checked:opacity-100"
                            name="check-thin"
                        />
                    </div>
                    <div className="flex items-center">
                        <div className="base1 font-semibold">
                            {tCheckout("sections.currency-symbol", { defaultValue: "$" })}{item.value}{tCheckout("sections.per-month", { defaultValue: "/month" })}</div>
                        {item.save && (
                            <div className="ml-auto px-2 base2 bg-primary-2/15 rounded text-[#0C923C]">
                                {tCheckout("badges.save", { defaultValue: "Save" })}{item.save}{tCheckout("badges.percent", { defaultValue: "%" })}</div>
                        )}
                    </div>
                </RadioGroup.Option>
            ))}
        </RadioGroup>
    );
};

export default Radio;
