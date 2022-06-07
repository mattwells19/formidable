import { useBoolean, FormLabelProps, FormControlProps } from "@chakra-ui/react";
import type { FocusEvent } from "react";
import { FieldType } from "../types";

interface UseFloatingLabelResult {
  labelProps: FormLabelProps;
  formControlProps: FormControlProps;
}

export default function useFloatingLabel(
  type: FieldType
): UseFloatingLabelResult {
  const [float, { on, off }] = useBoolean();

  if (type !== "text" && type !== "number" && type !== "textarea") {
    return {
      labelProps: {},
      formControlProps: {},
    };
  }

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    if (!float) {
      on();
    }
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (float && e.target.value.length === 0) {
      off();
    }
  };

  return {
    formControlProps: {
      onBlur: handleBlur,
      onFocus: handleFocus,
      // padding on top to make room for label
      paddingTop: "4",
    },
    labelProps: {
      position: "absolute",
      transform: float ? "translate(-1rem, -2.5rem)" : undefined,
      top: "2",
      left: "4",
    },
  };
}
