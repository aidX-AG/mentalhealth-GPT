"use client";

import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { Toaster, resolveValue } from "react-hot-toast";
import theme from "./theme";
import { I18nProvider, type Locale } from "@/lib/i18n/I18nContext";

type ProvidersProps = {
  locale: Locale;
  dict: Record<string, string>;
  children: React.ReactNode;
};

export function Providers({ locale, dict, children }: ProvidersProps) {
    return (
        <>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <I18nProvider locale={locale} dict={dict}>
                <ChakraProvider>{children}</ChakraProvider>
            </I18nProvider>
            <Toaster
                containerStyle={{
                    bottom: 40,
                    left: 20,
                    right: 20,
                }}
                position="bottom-center"
                gutter={10}
                toastOptions={{
                    duration: 2000,
                }}
            >
                {(t) => (
                    <div
                        style={{
                            opacity: t.visible ? 1 : 0,
                            transform: t.visible
                                ? "translatey(0)"
                                : "translatey(0.75rem)",
                            transition: "all .2s",
                        }}
                    >
                        {resolveValue(t.message, t)}
                    </div>
                )}
            </Toaster>
        </>
    );
}
