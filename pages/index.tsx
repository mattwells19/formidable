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
  dependentInput?: string;
};

function useFormValidation(isOpen: boolean) {
  const { formatMessage } = useIntl();

  return useMemo(() => {
    const formValidationNoOther = zod.object({
      textInput: zod.string({
        required_error: formatMessage({ id: "fieldIsRequired" }),
      }),
      currency: zod
        .number({
          required_error: formatMessage({ id: "fieldIsRequired" }),
        })
        .min(250000, {
          message: formatMessage({ id: "min250k" }),
        }),
      numberInput: zod.number({
        required_error: formatMessage({ id: "fieldIsRequired" }),
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
        .string({
          required_error: formatMessage({ id: "fieldIsRequired" }),
        })
        .array(),
      limitedCheckbox: zod
        .string({
          required_error: formatMessage({ id: "fieldIsRequired" }),
        })
        .array(),
      radio: zod.string({
        required_error: formatMessage({ id: "fieldIsRequired" }),
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
                <Field type="currency" name="currency" label="Currency field" />
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
