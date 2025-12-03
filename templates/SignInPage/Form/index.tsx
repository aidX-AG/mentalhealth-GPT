"use client";

import { useState } from "react";
import { Tab } from "@headlessui/react";
import { useColorMode } from "@chakra-ui/color-mode";
import { useSearchParams, useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import SignIn from "./SignIn";
import CreateAccount from "./CreateAccount";
import ForgotPassword from "./ForgotPassword";

type FormProps = {
  tabs: string[];

  // NEU: kleine Intro-Texte pro Tab
  signInIntro: string;
  createIntro: string;

  // SignIn
  usernamePlaceholder: string;
  passwordPlaceholder: string;
  forgotPasswordLabel: string;
  signInSubmitLabel: string;

  // Forgot
  resetBackLabel: string;
  resetEmailPlaceholder: string;
  resetSubmitLabel: string;

  // CreateAccount
  createEmailPlaceholder: string;
  createPasswordPlaceholder: string;
  createSubmitLabel: string;
  tosPrefix: string;
  tosLabel: string;
  andLabel: string;
  privacyLabel: string;
};

const Form = ({
  tabs,
  signInIntro,
  createIntro,
  usernamePlaceholder,
  passwordPlaceholder,
  forgotPasswordLabel,
  signInSubmitLabel,
  resetBackLabel,
  resetEmailPlaceholder,
  resetSubmitLabel,
  createEmailPlaceholder,
  createPasswordPlaceholder,
  createSubmitLabel,
  tosPrefix,
  tosLabel,
  andLabel,
  privacyLabel,
}: FormProps) => {
  const [forgot, setForgot] = useState<boolean>(false);
  const { colorMode } = useColorMode();
  const isLightMode = colorMode === "light";

  // Tab aus URL vorwählen
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab");
  const defaultTabIndex = tabParam === "create-account" ? 1 : 0;

  // Für Intro-Text: aktiven Tab tracken
  const [activeTab, setActiveTab] = useState(defaultTabIndex);

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    const url = index === 1 ? "/sign-in?tab=create-account" : "/sign-in";
    router.replace(url, { scroll: false });
  };

  return (
    <div className="w-full max-w-[31.5rem] m-auto">
      {forgot ? (
        <ForgotPassword
          onClick={() => setForgot(false)}
          backLabel={resetBackLabel}
          emailPlaceholder={resetEmailPlaceholder}
          submitLabel={resetSubmitLabel}
        />
      ) : (
        <>
          <Logo className="max-w-[11.875rem] mx-auto mb-6" dark={isLightMode} />

          {/* NEUER INTRO-TEXT */}
          <p className="mb-6 text-center text-sm text-n-1">
            {activeTab === 0 ? signInIntro : createIntro}
          </p>

          <Tab.Group defaultIndex={defaultTabIndex} onChange={handleTabChange}>
            <Tab.List className="flex mb-8 p-1 bg-n-2 rounded-xl dark:bg-n-7">
              {tabs.map((button, index) => (
                <Tab
                  className="basis-1/2 h-10 rounded-[0.625rem] base2 font-semibold text-n-4 transition-colors outline-none hover:text-n-7 ui-selected:bg-n-1 ui-selected:text-n-7 ui-selected:shadow-[0_0.125rem_0.125rem_rgba(0,0,0,0.07),inset_0_0.25rem_0.125rem_#FFFFFF] tap-highlight-color dark:hover:text-n-1 dark:ui-selected:bg-n-6 dark:ui-selected:text-n-1 dark:ui-selected:shadow-[0_0.125rem_0.125rem_rgba(0,0,0,0.07),inset_0_0.0625rem_0.125rem_rgba(255,255,255,0.02)]"
                  key={index}
                >
                  {button}
                </Tab>
              ))}
            </Tab.List>

            {/* Panels (E-Mail/Passwort) OBEN – unverändert */}
            <Tab.Panels>
              <Tab.Panel>
                <SignIn
                  onClick={() => setForgot(true)}
                  usernamePlaceholder={usernamePlaceholder}
                  passwordPlaceholder={passwordPlaceholder}
                  forgotPasswordLabel={forgotPasswordLabel}
                  submitLabel={signInSubmitLabel}
                />
              </Tab.Panel>
              <Tab.Panel>
                <CreateAccount
                  emailPlaceholder={createEmailPlaceholder}
                  passwordPlaceholder={createPasswordPlaceholder}
                  submitLabel={createSubmitLabel}
                  tosPrefix={tosPrefix}
                  tosLabel={tosLabel}
                  andLabel={andLabel}
                  privacyLabel={privacyLabel}
                />
              </Tab.Panel>
            </Tab.Panels>

            {/* Terms & Conditions wieder unten */}
            <p className="mt-6 text-center text-xs text-n-4/70">
              {tosPrefix}
              <a href="/terms" className="underline">
                {tosLabel}
              </a>{" "}
              {andLabel}{" "}
              <a href="/privacy" className="underline">
                {privacyLabel}
              </a>
            </p>
          </Tab.Group>
        </>
      )}
    </div>
  );
};

export default Form;
