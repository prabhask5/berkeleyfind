import { extendTheme } from "@chakra-ui/react";
import { Baloo_Thambi_2 } from "next/font/google";
import { inputTheme } from "./input";

const baloo_thambi_2 = Baloo_Thambi_2({
  subsets: ["latin"],
  variable: "--font-baloo_thambi_2",
});

export const fonts = {
  baloo_thambi_2,
};

const breakpoints = {
  base: "0px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

export const customTheme = extendTheme({
  breakpoints,
  components: {
    Heading: {
      baseStyle: {
        color: "#414141",
      },
      variants: {
        logo: {
          fontFamily: "var(--font-baloo_thambi_2)",
        },
        navbarLogo: {
          fontFamily: "var(--font-baloo_thambi_2)",
          _hover: { color: "#A73CFC" },
          _active: { color: "#920efb" },
        },
        underText: {
          color: "#e8e8e8",
        },
      },
    },
    Text: {
      baseStyle: {
        fontWeight: "510",
      },
      variants: {
        underText: {
          color: "#8A8A8A",
          fontWeight: "510",
        },
        navbar: {
          fontWeight: "590",
          color: "#414141",
          _hover: { color: "#A73CFC" },
          _active: { color: "#920efb" },
        },
        currPageNavBar: {
          fontWeight: "590",
          color: "#A73CFC",
        },
      },
    },
    Link: {
      baseStyle: {
        color: "#A73CFC",
      },
    },
    Input: inputTheme,
    Button: {
      variants: {
        websiteTheme: {
          color: "white",
          bgGradient: "linear(to-r, #A73CFC, #3C66FC)",
          _hover: { bgGradient: "linear(to-r, #920efb, #0e42fb)" },
          _active: { bgGradient: "linear(to-r, #7903d7, #0332d7)" },
        },
      },
    },
  },
});
