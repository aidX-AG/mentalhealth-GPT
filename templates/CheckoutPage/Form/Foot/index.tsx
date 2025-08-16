import Link from "next/link";
import { useTranslation } from 'react-i18next';
import Icon from "@/components/Icon";
import i18next from "i18next";

type FootProps = {};

const Foot = ({}: FootProps) => (
    <div className="">
        <div className="flex items-center mb-6 caption1 text-n-4/50">
            <Icon className="w-4 h-4 mr-2 fill-[#0C923C]" name="lock" />
            {tCheckout("body.security-note", { defaultValue: "Secured form with UI8 Banking" })}</div>
        <div className="text-right">
            <div className="h4">{tCheckout("sections.billed-now", { defaultValue: "Billed now: $399" })}</div>
            <button
                className="mb-4 base2 font-semibold text-primary-1 transition-colors hover:text-primary-1/90"
                type="button"
            >
                {tCheckout("sections.apply-promo-code", { defaultValue: "Apply promo code" })}</button>
            <div className="max-w-[27rem] ml-auto mb-4 caption1 text-n-4/50 dark:text-n-4/75">
                {tCheckout("body.billing-consent", { defaultValue: "By clicking &quot;Start Brainwave Enterprise plan&quot;, you agree to be charged $399 every month, unless you cancel." })}</div>
            {/* <button className="btn-blue" type="submit">
                Start Brainwave Enterprise plan
            </button> */}
            <Link href="/thanks" className="btn-blue md:w-full" type="submit">
                {tCheckout("sections.cta-start-plan", { defaultValue: "Start Brainwave Enterprise plan" })}</Link>
        </div>
    </div>
);

export default Foot;
