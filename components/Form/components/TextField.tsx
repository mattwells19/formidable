import { Input, InputProps } from "@chakra-ui/react";
import { ReactElement, useEffect } from "react";
import type { CommonFieldSpecificProps, OmitOverlap } from "../types";
import { useField } from "../contexts/FieldContext";

export interface TextFieldProps
  extends CommonFieldSpecificProps<string>,
    OmitOverlap<InputProps> {
  type: "text";
}

export default function TextField({
  ...inputProps
}: TextFieldProps): ReactElement {
  return (
    <Input
      {...inputProps}
      onChange={(e) => {
        inputProps.onChange?.(e.target.value);
      }}
    />
  );
}
