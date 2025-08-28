import Link from "next/link";
import Icon from "@/components/Icon";
import { getT } from "@/lib/i18n-runtime";
const t = getT();
type FootProps = {
  secureNote: string; // z.B. "Secured form with UI8 Banking"
  billedNowLabel: string; // z.B. "Billed now"
  billedNowAmount: string; // z.B. "$399"
  applyPromoLabel: string; // z.B. "Apply promo code"
  termsText: string; // kompletter Satz unter dem Button
  startPlanLabel: string; // Button-Text
  thanksHref?: string; // Ziel-Link
};
const Foot = ({
  secureNote,
  billedNowLabel,
  billedNowAmount,
  applyPromoLabel,
  termsText,
  startPlanLabel,
  thanksHref = "/thanks"
}: FootProps) => <div>
    <div className="flex items-center mb-6 caption1 text-n-4/50">
      <Icon className="w-4 h-4 mr-2 fill-[#0C923C]" name={t("lock")} />
      {secureNote}
    </div>
    <div className="text-right">
      <div className="h4">
        {billedNowLabel}{t(":")}{billedNowAmount}
      </div>
      <button className="mb-4 base2 font-semibold text-primary-1 transition-colors hover:text-primary-1/90" type="button">
        {applyPromoLabel}
      </button>
      <div className="max-w-[27rem] ml-auto mb-4 caption1 text-n-4/50 dark:text-n-4/75">
        {termsText}
      </div>
      <Link href={thanksHref} className="btn-blue md:w-full" type="submit">
        {startPlanLabel}
      </Link>
    </div>
  </div>;
export default Foot;