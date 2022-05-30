import { Button, ButtonGroup } from "@chakra-ui/react";
import Form, { Field, FieldProps, FieldType } from "../components/Form";
import zod, { ZodTypeAny } from "zod";
import { useReducer, useState } from "react";
import FormSubmissionModal from "../components/FormSubmissionModal";
import { getUTCDate } from "../components/Form/utils";
import FieldEditor from "../components/FieldEditor";

const validationSchemas: Record<FieldType, ZodTypeAny> = {
  text: zod.string().min(1),
  currency: zod.number().min(250000),
  number: zod.number().min(0),
  textarea: zod.string().min(10).max(500),
  "toggle-checkbox": zod.string().array().min(1).max(2),
  "toggle-radio": zod.string({}),
  "multi-select": zod.string().array().min(1),
  date: zod
    .date({})
    .refine((val) => Boolean(val))
    .refine((val) => getUTCDate(val).getTime() < getUTCDate().getTime()),
  select: zod.string().min(1),
  switch: zod
    .boolean()
    .default(false)
    .refine((val) => val),
};

type CustomFormValues = Record<
  string,
  string | Array<string> | boolean | number
>;

export default function Custom() {
  const [key, reset] = useReducer((prev) => !prev, true);
  const [ignoreTouch, toggleIgnoreTouch] = useReducer((prev) => !prev, false);
  const [values, setValues] = useState<CustomFormValues | null>(null);
  const [showFieldEditor, setShowFieldEditor] = useState<boolean>(false);

  const [formFields, setFormFields] = useState<Array<FieldProps>>([]);

  const formValidation = formFields.reduce((acc, formField) => {
    return acc.extend({
      [formField.name]: validationSchemas[formField.type],
    });
  }, zod.object({}));

  const handleSubmit = (formValues: CustomFormValues) => {
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
            {formFields.map((fieldProps) => (
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
              <Button onClick={() => setShowFieldEditor(true)}>
                Add new field
              </Button>
            </ButtonGroup>
          </>
        )}
      </Form>
      <FormSubmissionModal
        formValues={values}
        onClose={() => setValues(null)}
      />
      <FieldEditor
        isOpen={showFieldEditor}
        onClose={() => setShowFieldEditor(false)}
        onSubmit={(newField: FieldProps) => {
          setFormFields((prev) => [...prev, newField]);
          setShowFieldEditor(false);
        }}
      />
    </>
  );
}
