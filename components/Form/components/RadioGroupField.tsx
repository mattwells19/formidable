import {
  useRadioGroup,
  RadioGroup,
  RadioGroupProps,
  Radio
} from "@chakra-ui/react";
import { ReactElement, useEffect } from "react";
import type { CommonFieldSpecificProps, OmitOverlap } from "../types";
import { useField } from "../contexts/FieldContext";

export interface RadioGroupFieldProps
  extends CommonFieldSpecificProps<string>,
    OmitOverlap<Omit<RadioGroupProps, "children">> {
  type: "toggle-radio";
  options: Array<string>;
  getOptionLabel?: (option: string) => string;
}

export default function RadioGroupField({
  options,
  name,
  getOptionLabel,
  value,
  defaultValue,
  onChange,
  ...radioGroupProps
}: RadioGroupFieldProps): ReactElement {
  const { getRadioProps } = useRadioGroup({
    value,
    defaultValue,
    onChange
  });

  return (
    <RadioGroup {...radioGroupProps}>
      {options.map((option) => (
        <Radio key={option} {...getRadioProps({ value: option })} name={name}>
          {getOptionLabel ? getOptionLabel(option) : option}
        </Radio>
      ))}
    </RadioGroup>
  );
}
