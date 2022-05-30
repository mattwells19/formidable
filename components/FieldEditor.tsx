import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { ReactElement, useReducer } from "react";
import Form, { Field, FieldProps, FieldType } from "./Form";
import zod from "zod";

interface FieldEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newField: FieldProps) => void;
}

const fieldTypesEnum = zod.enum([
  "text",
  "number",
  "currency",
  "select",
  "multi-select",
  "toggle-radio",
  "toggle-checkbox",
  "textarea",
  "date",
  "switch",
]);

const defaultValidationShape = zod.object({
  type: fieldTypesEnum,
  name: zod.string().trim().min(1),
  label: zod.string().trim().min(1),
  helperText: zod.string().trim().optional(),
  tooltipText: zod.string().trim().optional(),
  isOptional: zod.boolean().default(false),
});

const FieldEditor = ({
  isOpen,
  onClose,
  onSubmit,
}: FieldEditorProps): ReactElement => {
  const [{ fieldType, validationShape }, setFieldType] = useReducer(
    (_: any, newFieldType: FieldType) => {
      if (
        newFieldType === "select" ||
        newFieldType === "toggle-checkbox" ||
        newFieldType === "toggle-radio"
      ) {
        return {
          fieldType: newFieldType,
          validationShape: defaultValidationShape.extend({
            options: zod.string().array().min(2),
          }),
        };
      } else {
        return {
          fieldType: newFieldType,
          validationShape: defaultValidationShape,
        };
      }
    },
    {
      fieldType: "text",
      validationShape: defaultValidationShape,
    }
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Field Editor</ModalHeader>
        <ModalCloseButton />
        <ModalBody paddingX="10">
          <Form
            validationShape={validationShape}
            onSubmit={(formValues) => {
              onSubmit(formValues as FieldProps);
            }}
            id="fieldEditorForm"
            display="flex"
            flexDir="column"
            gap="6"
          >
            <Field
              type="select"
              label="Field type"
              name="type"
              value={fieldType}
              options={fieldTypesEnum.options}
              onChange={(value) => setFieldType(value as FieldType)}
              autoFocus
            />
            <Field name="name" label="Field Name" type="text" />
            <Field name="label" label="Field Label" type="text" />
            {"options" in validationShape.shape ? (
              <Field
                name="options"
                label="Field Options"
                type="multi-select"
                helperText="Separate by commas."
              />
            ) : null}
            <Field
              name="helperText"
              isOptional
              label="Field Helper Text"
              type="text"
            />
            <Field
              name="tooltipText"
              isOptional
              label="Field Tooltip Text"
              type="text"
            />
            <Field
              name="isOptional"
              label="Make field optional?"
              type="switch"
              isOptional
            />
          </Form>
        </ModalBody>
        <ModalFooter gap="4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            form="fieldEditorForm"
            type="submit"
            variant="solid"
            colorScheme="teal"
          >
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FieldEditor;
