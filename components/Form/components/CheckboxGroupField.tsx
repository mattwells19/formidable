import {
  useCheckboxGroup,
  CheckboxGroup,
  Checkbox,
  CheckboxGroupProps
} from "@chakra-ui/react";
import { ReactElement, useEffect } from "react";
import type { CommonFieldSpecificProps, OmitOverlap } from "../types";
import { useField } from "../contexts/FieldContext";

export interface CheckboxGroupFieldProps
  extends CommonFieldSpecificProps<Array<string>>,
    OmitOverlap<CheckboxGroupProps> {
  type: "toggle-checkbox";
  options: Array<string>;
  getOptionLabel?: (option: string) => string;
  limit?: number;
}

export default function CheckboxGroupField({
  options,
  name,
  getOptionLabel,
  defaultValue,
  limit,
  onChange,
  value,
  type,
  ...checkboxGroupProps
}: CheckboxGroupFieldProps): ReactElement {
  const handleValuesChange = (changes: Array<string>): void => {
    if (limit && changes.length > limit) {
      return;
    }
    onChange?.(changes);
  };

  const { getCheckboxProps, value: groupValue } = useCheckboxGroup({
    onChange: handleValuesChange,
    value,
    defaultValue
  });

  return (
    <CheckboxGroup {...checkboxGroupProps}>
      {options.map((option) => (
        <Checkbox
          key={option}
          {...getCheckboxProps({
            value: option,
            name,
            disabled:
              limit &&
              groupValue.length === limit &&
              !groupValue.includes(option)
          })}
        >
          {getOptionLabel ? getOptionLabel(option) : option}
        </Checkbox>
      ))}
    </CheckboxGroup>
  );
}
