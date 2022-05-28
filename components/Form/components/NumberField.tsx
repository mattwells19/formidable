import { Input, InputProps } from "@chakra-ui/react";
import { ReactElement, useEffect } from "react";
import type { CommonFieldSpecificProps, OmitOverlap } from "../types";
import { useField } from "../contexts/FieldContext";

export interface NumberFieldProps
  extends CommonFieldSpecificProps<number | null>,
    OmitOverlap<InputProps> {
  type: "number";
}

export default function NumberField({
  value,
  defaultValue,
  ...inputProps
}: NumberFieldProps): ReactElement {
  return (
    <Input
      {...inputProps}
      type="number"
      value={value === undefined ? undefined : value ?? ""}
      defaultValue={defaultValue === undefined ? undefined : defaultValue ?? ""}
      onChange={(e) => {
        const inputValue = Number.isNaN(e.target.valueAsNumber)
          ? null
          : e.target.valueAsNumber;
        inputProps.onChange?.(inputValue);
      }}
    />
  );
}
