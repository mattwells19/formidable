import { createContext, useContext } from "react";

export interface FieldContextValue {
  isOptional: boolean;
}

const FieldContext = createContext<FieldContextValue | null>(null);

export function useField(): FieldContextValue {
  const context = useContext(FieldContext);
  if (!context) throw new Error();
  return context;
}

export const FieldContextProvider = FieldContext.Provider;
