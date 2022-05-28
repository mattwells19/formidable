import { Input, InputProps, Tag, useDisclosure } from "@chakra-ui/react";
import { ReactElement, useRef, useState } from "react";
import type { CommonFieldSpecificProps, OmitOverlap } from "../types";

export interface TextListFieldProps
  extends CommonFieldSpecificProps<Array<string>>,
    OmitOverlap<InputProps> {
  type: "multi-select";
}

export default function TextListField({
  name,
  defaultValue,
  value,
  onChange,
  onBlur,
  ...inputProps
}: TextListFieldProps): ReactElement {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [listValues, setListValues] = useState<Array<string>>(
    defaultValue ?? value ?? []
  );
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);

  const inputValues = listValues.join(", ");

  return (
    <>
      <Input
        {...inputProps}
        ref={(ref) => ref?.focus()}
        onChange={(e) => {
          const inputValue = e.target.value.trim();
          let finalValue: Array<string> | null = null;

          if (inputValue === "") {
            finalValue = [];
          } else if (inputValue.includes(",")) {
            finalValue = inputValue
              .split(",")
              .map((v) => v.trim())
              .filter((v) => v.length > 0);
          } else {
            finalValue = [inputValue];
          }

          if (hiddenInputRef.current) {
            hiddenInputRef.current.value = finalValue.join(",");
          }

          setListValues(finalValue);
          onChange?.(finalValue);
        }}
        onBlur={(e) => {
          onClose();
          onBlur?.(e);
        }}
        hidden={!isOpen}
        defaultValue={inputValues}
        name={`formatted_${name}`}
      />
      <Input
        as="button"
        onClick={onOpen}
        onFocus={onOpen}
        hidden={isOpen}
        alignItems="center"
        padding="1"
        display="flex"
        gap="1"
        title={`Edit ${inputValues}`}
        name={`formatted_${name}`}
      >
        {listValues.map((v) => (
          <Tag key={v}>{v}</Tag>
        ))}
      </Input>
      <input ref={hiddenInputRef} readOnly hidden name={name} />
    </>
  );
}
