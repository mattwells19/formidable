import {
  useCheckboxGroup,
  FlexProps,
  Flex,
  useCheckbox,
  UseCheckboxProps,
} from "@chakra-ui/react";
import { ReactElement } from "react";
import type { CommonFieldSpecificProps, OmitOverlap } from "../types";
import ToggleButton from "./ToggleButton";

export interface CheckboxGroupFieldProps
  extends CommonFieldSpecificProps<Array<string>>,
    OmitOverlap<FlexProps> {
  type: "toggle-checkbox";
  options: Array<string>;
  getOptionLabel?: (option: string) => string;
  limit?: number;
}

interface CheckboxProps
  extends UseCheckboxProps,
    Pick<CheckboxGroupFieldProps, "getOptionLabel"> {
  value: string;
}

function ToggleCheckbox({ getOptionLabel, ...props }: CheckboxProps) {
  const checkboxProps = useCheckbox(props);

  return (
    <ToggleButton
      {...checkboxProps}
      getOptionLabel={getOptionLabel}
      value={props.value}
    />
  );
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
  ...containerProps
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
    defaultValue,
  });

  return (
    <Flex justifyContent="space-evenly" gap="2" {...containerProps}>
      {options.map((option) => (
        <ToggleCheckbox
          key={option}
          value={option}
          {...getCheckboxProps({
            value: option,
          })}
          id={`${name}-${option}`}
          isDisabled={Boolean(
            limit && groupValue.length === limit && !groupValue.includes(option)
          )}
          name={name}
          getOptionLabel={getOptionLabel}
        />
      ))}
    </Flex>
  );
}
