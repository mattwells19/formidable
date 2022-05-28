import {
  Button,
  useDisclosure,
  ButtonGroup,
  Heading,
  Divider,
  Flex,
  Box,
} from "@chakra-ui/react";
import Form, { Field } from "../components/Form";
import zod from "zod";
import { useMemo, useReducer, useState } from "react";
import { useIntl } from "react-intl";
import FormSubmissionModal from "../components/FormSubmissionModal";
import { getUTCDate } from "../components/Form/utils";

const movieOptions = ["The Peanut Butter Falcon", "Harry Potter", "Arrival"];
const bookOptions = ["Anxious People", "Martyn Pig", "Lucas", "Other"];
const foodOptions = ["Pizza", "Burger", "Salmon", "Anything else"];
const colorOptions = ["Blue", "Orange", "Red", "Green"];

type FormValues = {
  textInput: string;
  currency: number;
  numberInput: number;
  optionalInput?: string;
  textArea: string;
  checkbox: Array<string>;
  radio: string;
  limitedCheckbox: Array<string>;
  textList: Array<string>;
  date: Date;
  dependentInput?: string;
};

function useFormValidation(isOpen: boolean) {
  const { formatMessage } = useIntl();

  return useMemo(() => {
    const formValidationNoOther = zod.object({
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
      checkbox: zod
        .string()
        .array()
        .min(1, {
          message: formatMessage({ id: "fieldIsRequired" }),
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

    const formValidationWithOther = formValidationNoOther.merge(
      zod.object({
        dependentInput: zod.string({
          required_error: formatMessage({ id: "fieldIsRequired" }),
        }),
      })
    );

    return isOpen ? formValidationWithOther : formValidationNoOther;
  }, [isOpen]);
}

export default function App() {
  const [key, reset] = useReducer((prev) => !prev, true);
  const [ignoreTouch, toggleIgnoreTouch] = useReducer((prev) => !prev, false);
  const [values, setValues] = useState<FormValues | null>(null);

  const { onOpen, isOpen, onClose } = useDisclosure();
  const formValidation = useFormValidation(isOpen);

  const handleSubmit = (formValues: FormValues) => {
    setValues(formValues);
  };

  return (
    <>
      <Box marginY="10" width="fit-content" padding="9" margin="auto">
        <Heading as="h1" textAlign="center">
          Formidable
        </Heading>
        <Divider marginY="5" />
        <Flex flexWrap="wrap" gap="20" justifyContent="center">
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
          >
            {(formValidationState) => (
              <>
                <Field type="text" name="textInput" label="Basic text" />
                <Field
                  type="currency"
                  name="currency"
                  label="Currency field"
                  helperText="Min of $250k"
                />
                <Field
                  type="number"
                  name="numberInput"
                  label="Numbers only"
                  tooltipText="Has to be positive"
                  min={0}
                />
                <Field
                  type="select"
                  name="optionalInput"
                  label="Optional select"
                  isOptional
                  options={movieOptions}
                  placeholder="Make a selection"
                />
                <Field
                  type="textarea"
                  name="textArea"
                  label="Text area field"
                  helperText="Min 10 characters"
                  minLength={10}
                  maxLength={500}
                />
                <Field
                  type="toggle-checkbox"
                  options={bookOptions}
                  name="checkbox"
                  label="Checkbox group with Other"
                  onChange={(values) => {
                    if (values.includes("Other") && !isOpen) {
                      onOpen();
                    } else if (!values.includes("Other") && isOpen) {
                      onClose();
                    }
                  }}
                />
                {isOpen ? (
                  <Field
                    type="text"
                    name="dependentInput"
                    label="Other input"
                  />
                ) : null}
                <Field
                  type="toggle-checkbox"
                  options={colorOptions}
                  name="limitedCheckbox"
                  label="Limited checkbox group"
                  helperText="Select up to 2"
                  limit={2}
                />
                <Field
                  type="toggle-radio"
                  name="radio"
                  label="Radio group"
                  options={foodOptions}
                  getOptionLabel={(option) => option.toUpperCase()}
                />
                <Field
                  type="multi-select"
                  name="textList"
                  label="Text list"
                  helperText="Separate by commas."
                />
                <Field
                  type="date"
                  name="date"
                  label="Date field"
                  helperText="Cannot be today."
                />
                <Button
                  disabled={formValidationState !== "complete"}
                  type="submit"
                >
                  Submit
                </Button>
                <ButtonGroup variant="outline">
                  <Button onClick={reset}>Reset</Button>
                  <Button onClick={toggleIgnoreTouch}>
                    Ignore touch: {`${ignoreTouch}`}
                  </Button>
                </ButtonGroup>
              </>
            )}
          </Form>
        </Flex>
      </Box>
      <FormSubmissionModal
        formValues={values}
        onClose={() => setValues(null)}
      />
    </>
  );
}
