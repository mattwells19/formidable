import { SwitchProps as ChakraSwitchProps, Switch } from "@chakra-ui/react";
import type { ReactElement } from "react";
import type { CommonFieldSpecificProps, OmitOverlap } from "../types";

export interface SwitchProps
  extends CommonFieldSpecificProps<boolean>,
    OmitOverlap<ChakraSwitchProps> {
  type: "switch";
}

export default function SwitchField({
  value,
  defaultValue,
  ...switchProps
}: SwitchProps): ReactElement {
  return (
    <Switch
      isChecked={value}
      defaultChecked={defaultValue}
      {...switchProps}
      onChange={(e) => {
        switchProps.onChange?.(e.target.checked);
      }}
    />
  );
}
