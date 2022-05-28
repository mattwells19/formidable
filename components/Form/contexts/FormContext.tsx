import { createContext, useContext } from "react";
import { FormElement } from "../types";

interface FormContextValue {
  registerField: (formField: FormElement) => void;
  formErrorMap: Map<string, string>;
  touchedFields: Set<string>;
  ignoreTouch: boolean;
}

const FormContext = createContext<FormContextValue | null>(null);

interface UseFormResult {
  registerField: (formField: FormElement) => void;
  error: string | undefined;
  isTouched: boolean;
}

export function useForm(fieldName: string): UseFormResult | null {
  const context = useContext(FormContext);

  if (!context) return null;

  return {
    registerField: context.registerField,
    get error() {
      return context.formErrorMap.get(fieldName);
    },
    get isTouched() {
      return context.ignoreTouch || context.touchedFields.has(fieldName);
    },
  };
}

export const FormContextProvider = FormContext.Provider;
