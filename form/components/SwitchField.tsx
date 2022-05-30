import { SwitchProps, Switch } from "@chakra-ui/react";
import type { ReactElement } from "react";
import type { CommonFieldSpecificProps, OmitOverlap } from "../types";

export interface SwitchFieldProps
  extends CommonFieldSpecificProps<boolean>,
    OmitOverlap<SwitchProps> {
  type: "switch";
}

export default function SwitchField({
  value,
  defaultValue,
  ...switchProps
}: SwitchFieldProps): ReactElement {
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
