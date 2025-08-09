import Link from "next/link";
import Icon from "@/components/Icon";
import i18next from "i18next";

type FootProps = {};

const Foot = ({}: FootProps) => (
    <div className="">
        <div className="flex items-center mb-6 caption1 text-n-4/50">
            <Icon className="w-4 h-4 mr-2 fill-[#0C923C]" name="lock" />
            {i18next.t("checkout.div_secured_form_with_ui8_banking_01", { defaultValue: "Secured form with UI8 Banking" })}</div>
        <div className="text-right">
            <div className="h4">{i18next.t("checkout.div_billed_now_399_02", { defaultValue: "Billed now: $399" })}</div>
            <button
                className="mb-4 base2 font-semibold text-primary-1 transition-colors hover:text-primary-1/90"
                type="button"
            >
                {i18next.t("checkout.div_apply_promo_code_03", { defaultValue: "Apply promo code" })}</button>
            <div className="max-w-[27rem] ml-auto mb-4 caption1 text-n-4/50 dark:text-n-4/75">
                {i18next.t("checkout.div_by_clicking_quot_start_brainwave_enterpr_04", { defaultValue: "By clicking &quot;Start Brainwave Enterprise plan&quot;, you agree to be charged $399 every month, unless you cancel." })}</div>
            {/* <button className="btn-blue" type="submit">
                Start Brainwave Enterprise plan
            </button> */}
            <Link href="/thanks" className="btn-blue md:w-full" type="submit">
                {i18next.t("checkout.div_start_brainwave_enterprise_plan_05", { defaultValue: "Start Brainwave Enterprise plan" })}</Link>
        </div>
    </div>
);

export default Foot;
