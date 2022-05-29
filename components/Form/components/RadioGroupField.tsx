import {
  useRadioGroup,
  RadioGroupProps,
  useRadio,
  UseRadioProps,
  Flex,
} from "@chakra-ui/react";
import { ReactElement } from "react";
import type { CommonFieldSpecificProps, OmitOverlap } from "../types";
import ToggleButton from "./ToggleButton";

export interface RadioGroupFieldProps
  extends CommonFieldSpecificProps<string>,
    OmitOverlap<Omit<RadioGroupProps, "children">> {
  type: "toggle-radio";
  options: Array<string>;
  getOptionLabel?: (option: string) => string;
}

interface ToggleRadioProps
  extends UseRadioProps,
    Pick<RadioGroupFieldProps, "getOptionLabel"> {
  myvalue: string;
}

function ToggleRadio({ getOptionLabel, myvalue, ...props }: ToggleRadioProps) {
  const radioProps = useRadio({ ...props, value: myvalue });

  return (
    <ToggleButton
      {...radioProps}
      getOptionLabel={getOptionLabel}
      value={myvalue}
    />
  );
}

export default function RadioGroupField({
  options,
  name,
  getOptionLabel,
  value,
  defaultValue,
  onChange,
  ...containerProps
}: RadioGroupFieldProps): ReactElement {
  const { getRadioProps } = useRadioGroup({
    value,
    defaultValue,
    onChange,
  });

  return (
    <Flex justifyContent="space-evenly" gap="2" {...containerProps}>
      {options.map((option) => (
        <ToggleRadio
          key={option}
          myvalue={option}
          {...getRadioProps({ value: option })}
          id={`${name}-${option}`}
          name={name}
          getOptionLabel={getOptionLabel}
        />
      ))}
    </Flex>
  );
}
