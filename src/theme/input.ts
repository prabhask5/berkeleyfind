import { inputAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys);

const baseInputStyle = definePartsStyle({
  field: {
    color: "#1c1c1c",
    fontWeight: "510",
    borderRadius: "10px",
  },
});

export const inputTheme = defineMultiStyleConfig({ baseStyle: baseInputStyle });
