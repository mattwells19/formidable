import {
  Input,
  InputGroup,
  InputLeftElement,
  InputProps,
} from "@chakra-ui/react";
import { ReactElement, useRef, useState } from "react";
import { useIntl } from "react-intl";
import type { CommonFieldSpecificProps } from "../types";

export interface CurrencyFieldProps
  extends CommonFieldSpecificProps<number | null>,
    Omit<InputProps, "name" | "value" | "defaultValue" | "onChange"> {
  type: "currency";
}

const CurrencyField = ({
  name,
  value,
  defaultValue,
  ...props
}: CurrencyFieldProps): ReactElement => {
  const { formatNumber } = useIntl();
  const [inputValue, setInputValue] = useState<number | null>(
    defaultValue ?? null
  );
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);

  const fieldValue = value ?? inputValue;

  return (
    <InputGroup>
      <InputLeftElement pointerEvents="none">$</InputLeftElement>
      <input name={name} type="number" hidden readOnly ref={hiddenInputRef} />
      <Input
        {...props}
        width={{ base: "full", md: "50%" }}
        name={`formatted_${name}`}
        inputMode="numeric"
        type="text"
        value={fieldValue ? formatNumber(fieldValue, { currency: "USD" }) : ""}
        onChange={(e) => {
          const parsedNumber = parseInt(e.target.value.replaceAll(",", ""), 10);
          if (!Number.isNaN(parsedNumber) || e.target.value === "") {
            const finalValue = Number.isNaN(parsedNumber) ? null : parsedNumber;
            if (value === undefined) {
              setInputValue(finalValue);
            }

            if (hiddenInputRef.current) {
              hiddenInputRef.current.value = parsedNumber.toString();
            }

            props.onChange?.(finalValue);
          }
        }}
      />
    </InputGroup>
  );
};

export default CurrencyField;
