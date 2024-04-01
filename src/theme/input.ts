import { inputAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys);

export const asyncInputStyling = {
  control: (baseStyles: any, _state: any) => ({
    ...baseStyles,
    borderRadius: "10px",
  }),
  placeholder: (baseStyles: any, _state: any) => ({
    ...baseStyles,
    color: "#9ca6b5",
    fontWeight: "510",
  }),
};

const baseInputStyle = definePartsStyle({
  field: {
    color: "#1c1c1c",
    fontWeight: "510",
    borderRadius: "10px",
  },
});

export const inputTheme = defineMultiStyleConfig({ baseStyle: baseInputStyle });
