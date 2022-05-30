import {
  Flex,
  Input,
  InputProps,
  Tag,
  TagCloseButton,
  TagLabel,
} from "@chakra-ui/react";
import { ReactElement, useRef, useState } from "react";
import { useForm } from "../contexts/FormContext";
import type {
  CommonFieldSpecificProps,
  CommonOptionsProps,
  OmitOverlap,
} from "../types";

export interface AutocompleteFieldProps
  extends CommonFieldSpecificProps<Array<string>>,
    CommonOptionsProps,
    OmitOverlap<InputProps> {
  type: "autocomplete";
}

// TODO add clear all button
export default function AutocompleteField({
  name,
  defaultValue,
  value,
  onChange,
  onBlur,
  getOptionLabel,
  options,
  onKeyDown,
  ...inputProps
}: AutocompleteFieldProps): ReactElement {
  const { manualOnChange } = useForm();
  const [listValues, setListValues] = useState<Array<string>>(
    defaultValue ?? value ?? []
  );
  const [query, setQuery] = useState<string>("");
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (newValues: Array<string>) => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = newValues.join(",");
    }

    setListValues(newValues);
    onChange?.(newValues);
  };

  return (
    <>
      <Input
        as={Flex}
        id={`${name}_container`}
        alignItems="center"
        paddingLeft={listValues.length > 0 ? "1" : undefined}
        paddingY="1"
        gap="1"
        flexWrap="wrap"
        height="auto"
      >
        {listValues.map((value) => (
          <Tag key={value}>
            <TagLabel>
              {getOptionLabel ? getOptionLabel(value) : value}
            </TagLabel>
            <TagCloseButton
              onClick={() => {
                handleChange(listValues.filter((v) => v !== value));
                manualOnChange();
              }}
            />
          </Tag>
        ))}
        <Input
          list={`${name}-options`}
          name={`formatted_${name}`}
          variant="unstyled"
          flex="1"
          minWidth="100px"
          isRequired={false}
          onKeyDown={(e) => {
            if (
              e.key === "Backspace" &&
              query.length === 0 &&
              listValues.length > 0
            ) {
              handleChange(listValues.slice(0, -1));
              manualOnChange();
            }
            onKeyDown?.(e);
          }}
          onChange={(e) => {
            const foundOption = options.find(
              (option) =>
                option.toLowerCase() === e.target.value.trim().toLowerCase()
            );
            if (foundOption) {
              handleChange([...listValues, foundOption]);
              setQuery("");
            } else {
              setQuery(e.target.value);
            }
          }}
          value={query}
          {...inputProps}
        />
      </Input>
      <input hidden readOnly name={name} ref={hiddenInputRef} />
      <datalist id={`${name}-options`}>
        {options
          .filter((option) => !listValues.includes(option))
          .map((option) => (
            <option key={option} value={option}>
              {getOptionLabel ? getOptionLabel(option) : option}
            </option>
          ))}
      </datalist>
    </>
  );
}
