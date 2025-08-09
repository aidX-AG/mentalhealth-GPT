import { RadioGroup } from "@headlessui/react";
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
                            {i18next.t("checkout.div_pay_01", { defaultValue: "Pay" })}{item.title}
                        </div>
                        <Icon
                            className="ml-auto fill-primary-1 opacity-0 transition-opacity ui-checked:opacity-100"
                            name="check-thin"
                        />
                    </div>
                    <div className="flex items-center">
                        <div className="base1 font-semibold">
                            {i18next.t("checkout.div_text_02", { defaultValue: "$" })}{item.value}{i18next.t("checkout.div_month_03", { defaultValue: "/month" })}</div>
                        {item.save && (
                            <div className="ml-auto px-2 base2 bg-primary-2/15 rounded text-[#0C923C]">
                                {i18next.t("checkout.node_save_04", { defaultValue: "Save" })}{item.save}{i18next.t("checkout.node_text_05", { defaultValue: "%" })}</div>
                        )}
                    </div>
                </RadioGroup.Option>
            ))}
        </RadioGroup>
    );
};

export default Radio;
