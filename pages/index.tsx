import { Button, ButtonGroup } from "@chakra-ui/react";
import Form, { Field, FieldProps } from "../components/Form";
import zod from "zod";
import { useMemo, useReducer, useState } from "react";
import { useIntl } from "react-intl";
import FormSubmissionModal from "../components/FormSubmissionModal";
import { getUTCDate } from "../components/Form/utils";

type FormValues = {
  textInput: string;
  currency: number;
  numberInput: number;
  optionalInput?: string;
  textArea: string;
  radio: string;
  limitedCheckbox: Array<string>;
  textList: Array<string>;
  date: Date;
};

function useFormValidation() {
  const { formatMessage } = useIntl();

  return useMemo(() => {
    const formValidation = zod.object({
      textInput: zod.string().min(1, {
        message: formatMessage({ id: "fieldIsRequired" }),
      }),
      currency: zod
        .number({
          invalid_type_error: formatMessage({ id: "fieldIsRequired" }),
        })
        .min(250000, {
          message: formatMessage({ id: "min250k" }),
        }),
      numberInput: zod
        .number({
          invalid_type_error: formatMessage({ id: "fieldIsRequired" }),
        })
        .min(0, {
          message: formatMessage({ id: "notNegative" }),
        }),
      optionalInput: zod.string().optional(),
      textArea: zod
        .string()
        .min(10, {
          message: formatMessage({ id: "min10Chars" }),
        })
        .max(500, {
          message: formatMessage({ id: "max500Chars" }),
        }),
      limitedCheckbox: zod
        .string()
        .array()
        .min(1, {
          message: formatMessage({ id: "fieldIsRequired" }),
        })
        .max(2),
      radio: zod.string({
        required_error: formatMessage({ id: "fieldIsRequired" }),
      }),
      textList: zod
        .string()
        .array()
        .min(1, {
          message: formatMessage({ id: "fieldIsRequired" }),
        }),
      date: zod
        .date({
          invalid_type_error: formatMessage({ id: "fieldIsRequired" }),
        })
        .refine((val) => Boolean(val), {
          message: formatMessage({ id: "fieldIsRequired" }),
        })
        .refine((val) => getUTCDate(val).getTime() < getUTCDate().getTime(), {
          message: formatMessage({ id: "mustBeInThePast" }),
        }),
    });

    return formValidation;
  }, []);
}

const fields: Array<FieldProps> = [
  {
    type: "text",
    name: "textInput",
    label: "Basic text",
  },
  {
    type: "number",
    name: "numberInput",
    label: "Numbers only",
    tooltipText: "Has to be positive",
    min: 0,
  },
  {
    type: "select",
    name: "optionalInput",
    label: "Optional select",
    isOptional: true,
    options: ["The Peanut Butter Falcon", "Harry Potter", "Arrival"],
    placeholder: "Make a selection",
  },
  {
    type: "textarea",
    name: "textArea",
    label: "Text area field",
    helperText: "Min 10 characters",
    minLength: 10,
    maxLength: 500,
  },
  {
    type: "toggle-checkbox",
    options: ["Blue", "Orange", "Red", "Green"],
    name: "limitedCheckbox",
    label: "Limited checkbox group",
    helperText: "Select up to 2",
    limit: 2,
  },
  {
    type: "toggle-radio",
    name: "radio",
    label: "Radio group",
    options: ["Pizza", "Burger", "Salmon", "Anything else"],
    getOptionLabel: (option) => option.toUpperCase(),
  },
  {
    type: "multi-select",
    name: "textList",
    label: "Text list",
    helperText: "Separate by commas.",
  },
  {
    type: "date",
    name: "date",
    label: "Date field",
    helperText: "Cannot be today.",
  },
];

export default function App() {
  const [key, reset] = useReducer((prev) => !prev, true);
  const [ignoreTouch, toggleIgnoreTouch] = useReducer((prev) => !prev, false);
  const [values, setValues] = useState<FormValues | null>(null);

  const formValidation = useFormValidation();

  const handleSubmit = (formValues: FormValues) => {
    setValues(formValues);
  };

  return (
    <>
      <Form
        key={`${key}`}
        onSubmit={handleSubmit}
        validationShape={formValidation}
        ignoreTouch={ignoreTouch}
        display="flex"
        flexDir="column"
        gap="8"
        justifyContent="flex-start"
        marginY="4"
        showDebugForm
      >
        {(formValidationState) => (
          <>
            {fields.map((fieldProps) => (
              <Field key={fieldProps.name} {...fieldProps} />
            ))}
            <Button disabled={formValidationState !== "complete"} type="submit">
              Submit
            </Button>
            <ButtonGroup variant="outline">
              <Button
                onClick={() => {
                  reset();
                }}
              >
                Reset
              </Button>
              <Button onClick={toggleIgnoreTouch}>
                Ignore touch: {`${ignoreTouch}`}
              </Button>
            </ButtonGroup>
          </>
        )}
      </Form>
      <FormSubmissionModal
        formValues={values}
        onClose={() => setValues(null)}
      />
    </>
  );
}
