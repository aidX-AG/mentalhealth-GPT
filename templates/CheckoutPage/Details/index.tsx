import Icon from "@/components/Icon";
import { useTranslation } from 'react-i18next';
import i18next from "i18next";

const details = [
    "Customizable AI models",
    "Advanced team management",
    "Enterprise-level support",
    "Integration with CRMs",
    "Dedicated account manager",
];

type DetailsProps = {};

const Details = ({}: DetailsProps) => (
    <>
        <div className="flex justify-between items-center mb-1">
            <div className="h5 text-[#139843]">{tCheckout("sections.enterprise", { defaultValue: "Enterprise" })}</div>
            <div className="shrink-0 ml-4 px-3 py-0.5 bg-[#FF97E8] rounded caption1 font-semibold text-n-7">
                {tCheckout("sections.popular", { defaultValue: "Popular" })}</div>
        </div>
        <div className="base1 font-semibold">
            {tCheckout("fragments.price-399", { defaultValue: "$399" })}<span className="ml-4 text-n-4">{tCheckout("sections.monthly-plan", { defaultValue: "Monthly Plan" })}</span>
        </div>
        <div className="mt-8 pt-8 space-y-5 border-t border-n-4/25 lg:hidden">
            {details.map((x: any, index: number) => (
                <div className="flex base2" key={index}>
                    <Icon className="mr-3 fill-primary-1" name="check-circle" />
                    {x}
                </div>
            ))}
        </div>
    </>
);

export default Details;
