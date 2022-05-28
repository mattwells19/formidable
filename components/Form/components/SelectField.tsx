import { Select, SelectProps } from "@chakra-ui/react";
import { ReactElement, useEffect } from "react";
import type { CommonFieldSpecificProps, OmitOverlap } from "../types";
import { useField } from "../contexts/FieldContext";

export interface SelectFieldProps
  extends CommonFieldSpecificProps<string>,
    OmitOverlap<SelectProps> {
  type: "select";
  options: Array<string>;
  getOptionLabel?: (option: string) => string;
}

export default function SelectField({
  options,
  getOptionLabel,
  ...selectProps
}: SelectFieldProps): ReactElement {
  return (
    <Select
      {...selectProps}
      onChange={(e) => {
        selectProps.onChange?.(e.target.value);
      }}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {getOptionLabel ? getOptionLabel(option) : option}
        </option>
      ))}
    </Select>
  );
}
