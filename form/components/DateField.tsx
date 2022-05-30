import { Input, InputProps } from "@chakra-ui/react";
import { ReactElement } from "react";
import type { CommonFieldSpecificProps, OmitOverlap } from "../types";

export interface DateFieldProps
  extends CommonFieldSpecificProps<Date | null>,
    OmitOverlap<InputProps> {
  type: "date";
}

export default function DateField({
  value,
  defaultValue,
  ...inputProps
}: DateFieldProps): ReactElement {
  return (
    <Input
      width={{ base: "full", md: "50%" }}
      {...inputProps}
      value={
        value === undefined
          ? undefined
          : value?.toISOString().split("T")[0] ?? ""
      }
      defaultValue={
        defaultValue === undefined
          ? undefined
          : defaultValue?.toISOString().split("T")[0] ?? ""
      }
      onChange={(e) => {
        inputProps.onChange?.(e.target.valueAsDate);
      }}
    />
  );
}
