import { Container, Button, useDisclosure } from "@chakra-ui/react";
import Form, { Field, zu } from "../components/Form";
import zod from "zod";

const movieOptions = ["The Peanut Butter Falcon", "Harry Potter", "Arrival"];
const bookOptions = ["Anxious People", "Martyn Pig", "Lucas", "Other"];
const foodOptions = ["Pizza", "Burger", "Salmon", "Anything else"];

const formValidation = zod.object({
  textInput: zu.text,
  currency: zu.number,
  numberInput: zu.number,
  optionalInput: zod.string().optional(),
  textArea: zod.string().min(10).max(500),
  checkbox: zu.multi,
  radio: zu.radio,
});

const formValidationWithOther = formValidation.merge(
  zod.object({
    dependentInput: zu.text,
  })
);

type FormValues = {
  textInput: string;
  currency: number;
  numberInput: number;
  optionalInput?: string;
  textArea: string;
  checkbox: Array<string>;
  radio: string;
  dependentInput?: string;
};

export default function App() {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const handleSubmit = (formValues: FormValues) => {
    console.log(formValues);
  };

  return (
    <Container marginY="10">
      <Form
        onSubmit={handleSubmit}
        display="flex"
        flexDir="column"
        gap="5"
        justifyContent="flex-start"
        validationShape={isOpen ? formValidationWithOther : formValidation}
        ignoreTouch={false}
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
              <Field type="text" name="dependentInput" label="Other input" />
            ) : null}
            <Field
              type="toggle-radio"
              name="radio"
              label="Radio group"
              options={foodOptions}
              getOptionLabel={(option) => option.toUpperCase()}
            />
            <Button disabled={formValidationState !== "complete"} type="submit">
              Submit
            </Button>
          </>
        )}
      </Form>
    </Container>
  );
}
