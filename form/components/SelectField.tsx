import { Select, SelectProps } from "@chakra-ui/react";
import { ReactElement } from "react";
import type {
  CommonFieldSpecificProps,
  CommonOptionsProps,
  OmitOverlap,
} from "../types";

export interface SelectFieldProps
  extends CommonFieldSpecificProps<string>,
    CommonOptionsProps,
    OmitOverlap<SelectProps> {
  type: "select";
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
