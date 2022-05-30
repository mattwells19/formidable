import { Button, useDisclosure, ButtonGroup } from "@chakra-ui/react";
import Form, { Field, useZodUtils } from "../form";
import { useMemo, useReducer, useState } from "react";
import FormSubmissionModal from "../components/FormSubmissionModal";

const bookOptions = ["Anxious People", "Martyn Pig", "Lucas", "Other"];

type FormValues = {
  checkbox: Array<string>;
  dependentInput?: string;
};

function useFormValidation(isOpen: boolean) {
  const zu = useZodUtils();

  return useMemo(() => {
    const formValidationNoOther = zu.form({
      checkbox: zu.multiSelect(),
    });

    const formValidationWithOther = formValidationNoOther.extend({
      dependentInput: zu.text(),
    });

    return isOpen ? formValidationWithOther : formValidationNoOther;
  }, [isOpen, zu]);
}

export default function Dependent() {
  const [key, reset] = useReducer((prev) => !prev, true);
  const [ignoreTouch, toggleIgnoreTouch] = useReducer((prev) => !prev, false);
  const [values, setValues] = useState<FormValues | null>(null);

  const { onOpen, isOpen, onClose } = useDisclosure();
  const formValidation = useFormValidation(isOpen);

  const handleSubmit = (formValues: FormValues) => {
    setValues(formValues);
  };

  const handleCheckboxWithOtherChange = (values: string[]) => {
    if (values.includes("Other") && !isOpen) {
      onOpen();
    } else if (!values.includes("Other") && isOpen) {
      onClose();
    }
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
            <Field
              type="toggle-checkbox"
              options={bookOptions}
              name="checkbox"
              label="Checkbox group with Other"
              onChange={handleCheckboxWithOtherChange}
            />
            {isOpen ? (
              <Field type="text" name="dependentInput" label="Other input" />
            ) : null}
            <Button disabled={formValidationState !== "complete"} type="submit">
              Submit
            </Button>
            <ButtonGroup variant="outline">
              <Button
                onClick={() => {
                  reset();
                  onClose();
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
