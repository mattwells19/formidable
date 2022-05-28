import {
  chakra,
  FormControl,
  FormControlProps,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  FormLabelProps,
  Tooltip,
} from "@chakra-ui/react";
import { ReactElement, useEffect } from "react";
import { useForm } from "./contexts/FormContext";
import TextField from "./components/TextField";
import NumberField from "./components/NumberField";
import SelectField from "./components/SelectField";
import TextareaField from "./components/TextareaField";
import CheckboxGroupField from "./components/CheckboxGroupField";
import RadioGroupField from "./components/RadioGroupField";
import type { FieldProps, FieldSpecificProps } from "./types";
// import HelperTextIcon from "@/assets/HelperTextIcon";
import CurrencyField from "./components/CurrencyField";
import TextListField from "./components/TextListField";

function FieldComponent(props: FieldSpecificProps): ReactElement | null {
  switch (props.type) {
    case "number": {
      return <NumberField {...props} />;
    }
    case "text": {
      return <TextField {...props} />;
    }
    case "select": {
      return <SelectField {...props} />;
    }
    case "textarea": {
      return <TextareaField {...props} />;
    }
    case "toggle-checkbox": {
      return <CheckboxGroupField {...props} />;
    }
    case "toggle-radio": {
      return <RadioGroupField {...props} />;
    }
    case "currency": {
      return <CurrencyField {...props} />;
    }
    case "multi-select": {
      return <TextListField {...props} />;
    }
    default:
      return null;
  }
}

export default function Field({
  id,
  name,
  tooltipText,
  label,
  isOptional = false,
  isDisabled = false,
  helperText,
  ...rest
}: FieldProps): ReactElement {
  const formContext = useForm(name);

  useEffect(() => {
    if (!formContext) {
      return;
    }

    formContext.registerField({
      name,
      type: rest.type,
      isRequired: !isOptional,
    });
  }, [name, rest.type, isOptional, formContext]);

  const formControlProps = ((): FormControlProps => {
    if (isOptional) {
      return {
        isRequired: false,
      };
    }
    switch (rest.type) {
      case "toggle-radio":
      case "toggle-checkbox":
        return {
          isRequired: false,
          as: "fieldset",
        };
      default:
        return {
          isRequired: true,
        };
    }
  })();

  const labelProps = ((): FormLabelProps => {
    switch (rest.type) {
      case "toggle-radio":
      case "toggle-checkbox":
        return {
          as: "legend",
        };
      default:
        return {};
    }
  })();

  return (
    <FormControl
      id={id ?? name}
      isDisabled={isDisabled}
      isInvalid={Boolean(formContext?.error && formContext?.isTouched)}
      {...formControlProps}
    >
      <FormLabel {...labelProps}>
        {label}
        {tooltipText ? (
          <Tooltip shouldWrapChildren label={tooltipText}>
            <chakra.span bg="blue.500" marginLeft="2" padding="1">
              {"ℹ️"}
            </chakra.span>
          </Tooltip>
        ) : null}
      </FormLabel>
      <FieldComponent name={name} {...rest} />
      {/* eslint-disable-next-line no-nested-ternary */}
      {formContext?.error && formContext?.isTouched ? (
        <FormErrorMessage>{formContext.error}</FormErrorMessage>
      ) : helperText ? (
        <FormHelperText>{helperText}</FormHelperText>
      ) : null}
    </FormControl>
  );
}
