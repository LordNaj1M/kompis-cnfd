import { extendTheme, ThemeConfig } from "@chakra-ui/react";

// Define config to enable dark mode
const config: ThemeConfig = {
  initialColorMode: "system", // "light" | "dark" | "system"
  useSystemColorMode: false, // Set to true if you want to use system preference
};

// Extend the theme
const theme = extendTheme({ config });

export default theme;
