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

  // ref to keep the user's raw input even if they lose focus
  const inputValueRef = useRef<string>(
    listValues.length > 0 ? listValues.join(", ") : ""
  );

  return (
    <>
      {isOpen ? (
        <Input
          {...inputProps}
          ref={(ref) => ref?.focus()}
          onChange={(e) => {
            inputValueRef.current = e.target.value;
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
          defaultValue={inputValueRef.current}
          name={`formatted_${name}`}
        />
      ) : (
        <Input
          as="button"
          onClick={onOpen}
          onFocus={onOpen}
          title={`Edit ${inputValueRef.current}`.trim()}
          name={`formatted_${name}`}
          display="flex"
          alignItems="center"
          flexWrap="wrap"
          gap="1"
          paddingX="2.5"
          paddingY="1"
          height="auto"
          minHeight="10"
        >
          {listValues.map((v) => (
            <Tag key={v}>{v}</Tag>
          ))}
        </Input>
      )}
      <input
        aria-label={name}
        ref={hiddenInputRef}
        readOnly
        hidden
        name={name}
      />
    </>
  );
}
