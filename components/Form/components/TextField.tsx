import { Input, InputProps } from "@chakra-ui/react";
import { ReactElement } from "react";
import type { CommonFieldSpecificProps, OmitOverlap } from "../types";

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
