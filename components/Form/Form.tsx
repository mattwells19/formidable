import { chakra, StyleProps } from "@chakra-ui/react";
import {
  FormEvent,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ZodObject, ZodRawShape } from "zod";
import zod from "zod";
import { FormContextProvider } from "./contexts/FormContext";
import DebugForm from "../DebugForm";
import type { FormValidationState, FormElement } from "./types";
import { extractFormValues } from "./utils";

export interface FormProps<FormValues extends ZodRawShape = {}>
  extends StyleProps,
    Omit<HTMLAttributes<HTMLFormElement>, "onSubmit" | "color" | "children"> {
  onSubmit: (formValues: zod.infer<ZodObject<FormValues>>) => void;
  children:
    | ReactNode
    | ((formValidationState: FormValidationState) => ReactNode);
  validationShape: ZodObject<FormValues>;
  ignoreTouch?: boolean;
}

export default function Form<FormValues extends ZodRawShape>({
  children,
  onSubmit,
  validationShape,
  ignoreTouch = false,
  ...rest
}: FormProps<FormValues>): ReactElement {
  const [fields, setFields] = useState<Array<FormElement>>([]);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(
    () => new Set()
  );
  const [formErrorMap, setFormErrorMap] = useState<Map<string, string>>(
    () => new Map()
  );
  const formRef = useRef<HTMLFormElement | null>(null);

  const formValidationState = useMemo(() => {
    const allRequiredFields = fields.filter((field) => field.isRequired);

    if (formErrorMap.size >= allRequiredFields.length) {
      return "none";
    }
    if (formErrorMap.size > 0) {
      return "partial";
    }
    return "complete";
  }, [formErrorMap, fields]);

  function handleSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    const formDataObj = new FormData(e.currentTarget);
    const formData = extractFormValues(fields, formDataObj);
    const validation = validationShape.safeParse(formData);

    if (validation.success) {
      onSubmit(validation.data);
    }
  }

  /**
   * All fields need to be registered to be properly extracted from the FormData object
   * and to determine formValidationState
   */
  const registerField = useCallback((formField: FormElement): void => {
    setFields((prev) => {
      if (prev.every((field) => field.name !== formField.name)) {
        return [...prev, formField];
      }
      return prev;
    });
  }, []);

  /**
   * Merge the errors from onChange with existing errors to avoid unecessary re-renders
   */
  const onFieldErrors = (fieldsErrors: Map<string, string>) => {
    setFormErrorMap((prevErr) => {
      if (fieldsErrors.size === 0 && prevErr.size > 0) return new Map();

      let changed = false;
      const newErrMap = new Map(prevErr);

      fields.forEach(({ name }) => {
        const incomingErr = fieldsErrors.get(name);
        const existingErr = newErrMap.get(name);

        if (incomingErr && incomingErr !== existingErr) {
          newErrMap.set(name, incomingErr);
          changed = true;
        } else if (existingErr && !incomingErr) {
          newErrMap.delete(name);
          changed = true;
        }
      });

      return changed ? newErrMap : prevErr;
    });
  };

  /**
   * Get all form fields and run validation schema to get error messages
   */
  function validateAllFields(formElement: HTMLFormElement) {
    const formDataObj = new FormData(formElement);
    const formData = extractFormValues(fields, formDataObj);
    const validation = validationShape.safeParse(formData);

    const errors = new Map<string, string>();
    if (!validation.success) {
      const allFieldErrors = validation.error.formErrors.fieldErrors;
      Object.entries(allFieldErrors).forEach(([name, fieldErrors]) => {
        if (!Array.isArray(fieldErrors)) {
          throw new Error(
            `fieldError wasn't an array somehow - ${name}\n${fieldErrors}`
          );
        }
        errors.set(name, fieldErrors[0]);
      });
    }

    onFieldErrors(errors);
  }

  function handleTouch(e: React.FocusEvent<HTMLFormElement>) {
    const inputName = e.target.name;
    if (!inputName) return;

    setTouchedFields((prevTouched) => {
      if (prevTouched.has(inputName)) {
        return prevTouched;
      }

      const newTouchedSet = new Set(prevTouched);
      newTouchedSet.add(inputName);
      return newTouchedSet;
    });
  }

  // handles fields mounting/unmounting
  useEffect(() => {
    if (!formRef.current) return;

    setFields((prevFields) => {
      const newFields = prevFields.filter((prevField) =>
        Boolean(formRef.current?.elements.namedItem(prevField.name))
      );

      return newFields.length === prevFields.length ? prevFields : newFields;
    });

    setFormErrorMap((prevErr) => {
      const newFields = Array.from(prevErr).filter(([name]) => {
        return Boolean(formRef.current?.elements.namedItem(name));
      });
      const newFieldMap = new Map(newFields);

      return newFieldMap.size === prevErr.size ? prevErr : newFieldMap;
    });
  });

  // validate on load and when a field mounts/unmounts
  useEffect(() => {
    if (formRef.current) {
      validateAllFields(formRef.current);
    }
  }, [fields.length]);

  const contextValue = useMemo(
    () => ({
      registerField,
      formErrorMap,
      touchedFields,
      ignoreTouch,
    }),
    [registerField, formErrorMap, touchedFields, ignoreTouch]
  );

  return (
    <FormContextProvider value={contextValue}>
      <chakra.form
        onSubmit={handleSubmit}
        ref={formRef}
        onBlur={handleTouch}
        onChange={(e) => validateAllFields(e.currentTarget)}
        {...rest}
      >
        {typeof children === "function"
          ? children(formValidationState)
          : children}
      </chakra.form>
      <DebugForm
        fields={fields}
        formErrorMap={formErrorMap}
        touchedFields={touchedFields}
        formValidationState={formValidationState}
        formRef={formRef}
      />
    </FormContextProvider>
  );
}
