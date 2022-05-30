import { createContext, useContext } from "react";
import { FormElement, FormValidationState } from "../types";

export interface FormContextValue {
  registerField: (formField: FormElement) => void;
  formErrorMap: Map<string, string>;
  touchedFields: Set<string>;
  ignoreTouch: boolean;
  formValidationState: FormValidationState;
}

const FormContext = createContext<FormContextValue | null>(null);
FormContext.displayName = "FormContext";

export const FormContextProvider = FormContext.Provider;
export const FormContextConsumer = FormContext.Consumer;

/**
 * Returns the full context of the Form
 */
export function useForm(): FormContextValue {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("💣️ Tried to useForm outside of a Form component.");
  }
  return context;
}

/**
 * Context to be consumed by the Field component.
 * It's split out like this so that memoization is easier
 * for the Field component.
 */
export interface UseFormResult extends Pick<FormContextValue, "registerField"> {
  error: string | undefined;
  isTouched: boolean;
}

export function useFormField(fieldName: string): UseFormResult | null {
  const context = useContext(FormContext);

  if (!context) return null;

  return {
    registerField: context.registerField,
    get error() {
      return context.formErrorMap.get(fieldName);
    },
    get isTouched() {
      return (
        context.ignoreTouch ||
        context.touchedFields.has(fieldName) ||
        // special formatted fields have a separate controlled input with a name
        // that's prefixed with 'formatted_{inputName}'
        context.touchedFields.has(`formatted_${fieldName}`)
      );
    },
  };
}
