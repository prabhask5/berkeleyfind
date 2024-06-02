"use client";

import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { customTheme } from "@/theme";
import React from "react";
import { CacheProvider } from "@chakra-ui/next-js";
import { setCookie } from "cookies-next";

export default function ThemeProvider({
  colorMode,
  children,
}: {
  colorMode?: any;
  children: React.ReactNode;
}) {
  return (
    <CacheProvider>
      <ChakraProvider
        colorModeManager={{
          type: "cookie",
          ssr: true,
          get: (init) => colorMode ?? init,
          set: (value) => {
            setCookie("chakra-ui-color-mode", value);
          },
        }}
        theme={customTheme}
      >
        <ColorModeScript
          initialColorMode={customTheme.initialColorMode}
          type="cookie"
        />
        {children}
      </ChakraProvider>
    </CacheProvider>
  );
}
