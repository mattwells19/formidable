import {
  chakra,
  FormControl,
  FormControlProps,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  FormLabelProps,
  Tooltip,
  Icon,
  Text,
} from "@chakra-ui/react";
import { memo, ReactElement, useEffect } from "react";
import { useForm } from "./contexts/FormContext";
import TextField from "./components/TextField";
import NumberField from "./components/NumberField";
import SelectField from "./components/SelectField";
import TextareaField from "./components/TextareaField";
import CheckboxGroupField from "./components/CheckboxGroupField";
import RadioGroupField from "./components/RadioGroupField";
import type {
  FieldComponentProps,
  FieldProps,
  FieldSpecificProps,
} from "./types";
// import HelperTextIcon from "@/assets/HelperTextIcon";
import CurrencyField from "./components/CurrencyField";
import TextListField from "./components/TextListField";
import DateField from "./components/DateField";
import { useIntl } from "react-intl";

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
    case "date": {
      return <DateField {...props} />;
    }
    default:
      return null;
  }
}

function OptionalIndicator() {
  const { formatMessage } = useIntl();
  return (
    <Text as="span" paddingLeft="2" color="gray.400">
      ({formatMessage({ id: "optional" })})
    </Text>
  );
}

export default function FieldWrapper(props: FieldProps) {
  const formContext = useForm(props.name);

  return (
    <Field
      {...props}
      error={formContext?.error}
      isTouched={formContext?.isTouched}
      registerField={formContext?.registerField}
    />
  );
}

const Field = memo(function Field({
  id,
  name,
  tooltipText,
  label,
  isOptional = false,
  isDisabled = false,
  helperText,
  error,
  isTouched,
  registerField,
  ...rest
}: FieldComponentProps): ReactElement {
  console.log("render", name);

  useEffect(() => {
    if (!registerField) {
      return;
    }

    registerField({
      name,
      type: rest.type,
      isRequired: !isOptional,
    });
  }, [name, rest.type, isOptional, registerField]);

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
          id,
        };
      default:
        return {
          isRequired: true,
          id: name ?? id,
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
      isDisabled={isDisabled}
      isInvalid={Boolean(error && isTouched)}
      {...formControlProps}
    >
      <FormLabel
        display="flex"
        alignItems="center"
        optionalIndicator={isOptional ? <OptionalIndicator /> : undefined}
        {...labelProps}
      >
        {label}
        {tooltipText ? (
          <Tooltip label={tooltipText}>
            <Icon viewBox="0 0 24 24" color="blue.300" marginLeft="2">
              <circle
                x="50%"
                y="50%"
                cx="12"
                cy="12"
                r="12"
                fill="currentColor"
              />
              <text x="40%" y="75%" fontWeight="bold">
                i
              </text>
            </Icon>
          </Tooltip>
        ) : null}
      </FormLabel>
      <FieldComponent name={name} {...rest} />
      {/* eslint-disable-next-line no-nested-ternary */}
      {error && isTouched ? (
        <FormErrorMessage>{error}</FormErrorMessage>
      ) : helperText ? (
        <FormHelperText>{helperText}</FormHelperText>
      ) : null}
    </FormControl>
  );
});
