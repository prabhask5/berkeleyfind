import { extendTheme } from "@chakra-ui/react";
import "@fontsource/baloo-thambi-2";
import { inputTheme } from "./input";

const customTheme = extendTheme({
  components: {
    Heading: {
      baseStyle: {
        color: "#414141",
      },
      variants: {
        logo: {
          fontFamily: "Baloo Thambi 2",
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
          fontSize: "13px",
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

export default customTheme;
