import { useState } from "react";
import InputMask from "react-input-mask";
import Icon from "@/components/Icon";
import RadioGroup from "./RadioGroup";
import Foot from "./Foot";
import { getT } from "@/lib/i18n-runtime";
const t = getT();
type FormProps = {
  planLabel: string; // "Plan"
  changeCurrencyLabel: string; // "Change currency"
  currencyCode: string; // "USD"
  monthlyLabel: string; // "monthly"
  yearlyLabel: string; // "yearly"
  saveLabel: string; // "Save"
  payPrefix: string; // "Pay"
  perMonthSuffix: string; // "/month"
  billingEmailLabel: string; // "Billing email"
  emailPlaceholder: string; // "Email address"
  cardDetailsLabel: string; // "Card details"
  cardNumberPlaceholder: string; // "Card number"
  expPlaceholder: string; // "MM / YY"
  cvcPlaceholder: string; // "CVC"
  // Foot:
  secureNote: string;
  billedNowLabel: string;
  billedNowAmount: string; // z.B. "$399"
  applyPromoLabel: string;
  termsText: string;
  startPlanLabel: string;
};
const Form = ({
  planLabel,
  changeCurrencyLabel,
  currencyCode,
  monthlyLabel,
  yearlyLabel,
  saveLabel,
  payPrefix,
  perMonthSuffix,
  billingEmailLabel,
  emailPlaceholder,
  cardDetailsLabel,
  cardNumberPlaceholder,
  expPlaceholder,
  cvcPlaceholder,
  secureNote,
  billedNowLabel,
  billedNowAmount,
  applyPromoLabel,
  termsText,
  startPlanLabel
}: FormProps) => {
  const plans = [{
    id: "0",
    title: monthlyLabel,
    value: 399
  }, {
    id: "1",
    title: yearlyLabel,
    value: 349,
    save: 20
  }];
  const [plan, setPlan] = useState<any>(plans[0]);
  const [email, setEmail] = useState<string>("");
  const [cardNumber, setCardNumber] = useState<any>({
    value: "",
    mask: "9999-9999-9999-9999"
  });
  const [date, setDate] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const onChange = (e: any) => {
    if (e.target && e.target.value && setCardNumber) {
      let value = e.target.value;
      let newState = {
        mask: "9999-9999-9999-9999",
        value
      };
      if (/^3[47]/.test(value)) {
        newState.mask = "9999-999999-99999"; // Amex
      }
      setCardNumber(newState);
    }
  };
  const styleInput = "w-full h-6 border-none bg-transparent base1 outline-none placeholder:text-n-4/50";
  return <form action="" onSubmit={() => console.log("Submit")}>
      <div className="flex items-center mb-3 base2">
        <div className="mr-auto dark:text-n-4">{planLabel}</div>
        <div className="mr-5 text-n-4">{changeCurrencyLabel}</div>
        <div className="px-3 py-0.5 bg-n-3 rounded font-semibol dark:bg-n-7 dark:text-n-1">
          {currencyCode}
        </div>
      </div>

      <RadioGroup items={plans} value={plan} setValue={setPlan} payPrefix={payPrefix} perMonthSuffix={perMonthSuffix} saveLabel={saveLabel} />

      <div className="mb-3 border border-n-3 rounded-xl dark:border-n-5">
        <div className="p-5">
          <div className="mb-3 base2 text-n-5">{billingEmailLabel}</div>
          <div className="relative">
            <Icon className="absolute top-0 left-0 pointer-events-none fill-n-4/50" name={t("email")} />
            <input className={`${styleInput} pl-11`} type="email" name={t("email")} placeholder={emailPlaceholder} value={email} onChange={(e: any) => setEmail(e.target.value)} required />
          </div>
        </div>

        <div className="p-5 border-t border-n-3 dark:border-n-5">
          <div className="mb-3 base2 text-n-5">{cardDetailsLabel}</div>
          <div className="flex md:flex-wrap">
            <div className="relative grow md:w-full md:mb-4">
              <Icon className="absolute top-0 left-0 pointer-events-none fill-n-4/50" name={t("credit-card")} />
              <InputMask className={`${styleInput} pl-11`} {...cardNumber} type="tel" onChange={onChange} placeholder={cardNumberPlaceholder} required />
            </div>
            <div className="shrink-0 w-20 mx-8 md:ml-0 md:mr-auto">
              <InputMask className={`${styleInput} text-center md:text-left`} mask="99 / 99" placeholder={expPlaceholder} type="tel" value={date} onChange={(e: any) => setDate(e.target.value)} required />
            </div>
            <div className="shrink-0 w-10">
              <InputMask className={`${styleInput} text-center`} mask="999" placeholder={cvcPlaceholder} type="tel" value={code} onChange={(e: any) => setCode(e.target.value)} required />
            </div>
          </div>
        </div>
      </div>

      <Foot secureNote={secureNote} billedNowLabel={billedNowLabel} billedNowAmount={billedNowAmount} applyPromoLabel={applyPromoLabel} termsText={termsText} startPlanLabel={startPlanLabel} />
    </form>;
};
export default Form;