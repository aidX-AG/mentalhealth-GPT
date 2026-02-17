import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
    initialColorMode: "light",
    useSystemColorMode: false, // ✅ SSR-safe: prevents hydration mismatch
};

const theme = extendTheme({ config });

export default theme;
