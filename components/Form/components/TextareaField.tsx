import { Textarea, TextareaProps } from "@chakra-ui/react";
import { ReactElement, useEffect } from "react";
import type {
  CommonFieldSpecificProps,
  OmitOverlap,
  ValidateFieldFn
} from "../types";
import { useField } from "../contexts/FieldContext";

export interface TextareaFieldProps
  extends CommonFieldSpecificProps<string>,
    OmitOverlap<TextareaProps> {
  type: "textarea";
}

export default function TextareaField({
  maxLength = 500,
  minLength = 250,
  rows = 6,
  ...textAreaProps
}: TextareaFieldProps): ReactElement {
  return (
    <Textarea
      maxLength={maxLength}
      minLength={minLength}
      rows={rows}
      {...textAreaProps}
      onChange={(e) => {
        textAreaProps.onChange?.(e.target.value);
      }}
    />
  );
}
