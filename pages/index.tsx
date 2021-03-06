import { Button, ButtonGroup } from "@chakra-ui/react";
import { useMemo, useReducer, useState } from "react";
import { useIntl } from "react-intl";
import FormSubmissionModal from "../components/FormSubmissionModal";
import { getUTCDate } from "../utils";
import Form, { useZodUtils, Field, FieldProps } from "../form";

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
  const zu = useZodUtils();

  return useMemo(() => {
    const formValidation = zu.form({
      textInput: zu.text(),
      currency: zu.number().min(250000, {
        message: formatMessage({ id: "min250k" }),
      }),
      numberInput: zu.number().min(0, {
        message: formatMessage({ id: "notNegative" }),
      }),
      optionalInput: zu.singleSelect().optional(),
      textArea: zu
        .text()
        .min(10, {
          message: formatMessage({ id: "min10Chars" }),
        })
        .max(500, {
          message: formatMessage({ id: "max500Chars" }),
        }),
      limitedCheckbox: zu.multiSelect().max(2),
      radio: zu.singleSelect(),
      textList: zu.multiSelect().min(2, {
        message: formatMessage({ id: "needX" }, { x: 2 }),
      }),
      autocomplete: zu.multiSelect().min(1, {
        message: "Field is required. Must be a valid option.",
      }),
      date: zu
        .date()
        .refine((val) => getUTCDate(val).getTime() < getUTCDate().getTime(), {
          message: formatMessage({ id: "mustBeInThePast" }),
        }),
      agree: zu.switch(),
    });

    return formValidation;
  }, [formatMessage, zu]);
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
    type: "currency",
    name: "currency",
    label: "Currency amount",
    helperText: "Minimum of $250k",
    min: 250000,
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
    type: "autocomplete",
    name: "autocomplete",
    label: "Autocomplete",
    helperText: "Click to see your options.",
    options: [
      "React",
      "Vue",
      "Angular",
      "Remix",
      "NextJS",
      "Chakra UI",
      "Material UI",
      "ExpressJS",
      "Zod",
    ],
  },
  {
    type: "date",
    name: "date",
    label: "Date field",
    helperText: "Cannot be today.",
  },
  {
    type: "switch",
    name: "agree",
    label: "Agree?",
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
        showDebugForm
        display="flex"
        flexDir="column"
        gap="8"
        maxWidth="md"
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
