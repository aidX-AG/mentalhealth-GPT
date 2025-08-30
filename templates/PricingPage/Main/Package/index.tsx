import { twMerge } from "tailwind-merge";
import Link from "next/link";
import Icon from "@/components/Icon";
import { getT } from "@/lib/i18n-runtime";
const t = getT();
type PackageProps = {
  plan?: boolean;
  item: any;
  popularLabel: string;
  perYearLabel: string; // e.g. "year"
  perMonthLabel: string; // e.g. "mo"
  currentPlanLabel: string;
  upgradeLabel: string;
};
const Package = ({
  plan,
  item,
  popularLabel,
  perYearLabel,
  perMonthLabel,
  currentPlanLabel,
  upgradeLabel
}: PackageProps) => <div className={`flex basis-1/3 border-r-2 border-n-3 p-8 bg-n-1 first:rounded-l-3xl last:rounded-r-3xl last:border-none 2xl:px-6 lg:shrink-0 lg:basis-[18.5rem] dark:bg-n-7 dark:border-n-6 ${item.popular && "relative text-n-1 before:absolute before:-top-4 before:left-0 before:right-0 before:-bottom-4 before:bg-n-6 before:rounded-3xl dark:text-n-7 dark:before:bg-n-2"}`}>
    <div className="relative flex flex-col grow z-2">
      <div className="flex justify-between items-center mb-1">
        <div className="h4" style={{
        color: item.colorTitle
      }}>
          {item.title}
        </div>
        {item.popular && <div className="shrink-0 ml-4 px-3 py-0.5 bg-[#FF97E8] rounded caption1 font-semibold text-n-7">
            {popularLabel}
          </div>}
      </div>
      <div className="mb-6 base1 font-semibold">{item.description}</div>
      <div className="mb-2">
        <span className="mr-2 h2">{t("CHF ")}{plan ? item.priceYear : item.priceMonth}</span>
        <span className={twMerge(`h4 text-n-4/50 ${item.popular && "text-n-4"}`)}>{t("/")}{plan ? perYearLabel : perMonthLabel}
        </span>
      </div>
      <div className="base1 text-n-4">{item.priceDetails}</div>
      <div className={`grow space-y-4 mt-6 pt-6 border-t border-n-3 dark:border-n-6 ${item.popular && "border-n-5 dark:border-n-4/25"}`}>
        {item.details.map((x: any, index: number) => <div className="flex base2" key={index}>
            <Icon className={twMerge(`mr-3 fill-n-4/50 ${item.popular && "fill-n-4"}`)} name={t("check-circle")} />
            {x}
          </div>)}
      </div>
      <Link className={`${item.currentPlan && "opacity-50 pointer-events-none"} ${item.popular ? "btn-blue" : "btn-stroke-light"} w-full mt-8`} href="/checkout">
        {item.currentPlan ? currentPlanLabel : upgradeLabel}
      </Link>
    </div>
  </div>;
export default Package;
