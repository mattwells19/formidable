import { Button, ButtonGroup } from "@chakra-ui/react";
import Form, { Field, FieldProps, FieldType, useZodUtils } from "../form";
import type { ZodTypeAny } from "zod";
import { useMemo, useReducer, useState } from "react";
import FormSubmissionModal from "../components/FormSubmissionModal";
import { getUTCDate } from "../utils";
import FieldEditor from "../components/FieldEditor";

type CustomFormValues = Record<
  string,
  string | Array<string> | boolean | number
>;

export default function Custom() {
  const zu = useZodUtils();
  const validationSchemas = useMemo(
    (): Record<FieldType, ZodTypeAny> => ({
      text: zu.text(),
      currency: zu.number().min(250000),
      number: zu.number().min(0),
      textarea: zu.text().min(10).max(500),
      "toggle-checkbox": zu.multiSelect().max(2),
      "toggle-radio": zu.singleSelect(),
      "multi-select": zu.multiSelect(),
      date: zu
        .date()
        .refine((val) => getUTCDate(val).getTime() < getUTCDate().getTime()),
      select: zu.singleSelect(),
      switch: zu.switch(),
      autocomplete: zu.multiSelect(),
    }),
    [zu]
  );

  const [key, reset] = useReducer((prev) => !prev, true);
  const [ignoreTouch, toggleIgnoreTouch] = useReducer((prev) => !prev, false);
  const [values, setValues] = useState<CustomFormValues | null>(null);
  const [showFieldEditor, setShowFieldEditor] = useState<boolean>(false);

  const [formFields, setFormFields] = useState<Array<FieldProps>>([]);

  const formValidation = formFields.reduce((acc, formField) => {
    let schema = validationSchemas[formField.type];
    if (formField.isOptional) {
      schema = schema.optional();
    }

    return acc.extend({
      [formField.name]: schema,
    });
  }, zu.form({}));

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
