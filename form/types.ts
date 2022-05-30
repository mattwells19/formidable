import type { TextFieldProps } from "./components/TextField";
import type { NumberFieldProps } from "./components/NumberField";
import type { SelectFieldProps } from "./components/SelectField";
import type { TextareaFieldProps } from "./components/TextareaField";
import type { CheckboxGroupFieldProps } from "./components/CheckboxGroupField";
import type { RadioGroupFieldProps } from "./components/RadioGroupField";
import type { CurrencyFieldProps } from "./components/CurrencyField";
import type { TextListFieldProps } from "./components/TextListField";
import type { DateFieldProps } from "./components/DateField";
import type { UseFormResult } from "./contexts/FormContext";
import type { SwitchProps } from "./components/SwitchField";

export type FormElement = {
  name: string;
  type: FieldType;
  isRequired: boolean;
};

export type FormValidationState = "none" | "partial" | "complete";

export type FieldType =
  | "text"
  | "number"
  | "currency"
  | "select"
  | "multi-select"
  | "toggle-radio"
  | "toggle-checkbox"
  | "textarea"
  | "date"
  | "switch";

export type CommonFieldProps = {
  name: string;
  label: string;
  id?: string;
  tooltipText?: string;
  isOptional?: boolean;
  isDisabled?: boolean;
  helperText?: string;
};

export type CommonFieldSpecificProps<T> = {
  name: string;
  value?: T;
  onChange?: (value: T) => void;
  defaultValue?: T;
};

export type FieldSpecificProps =
  | TextFieldProps
  | NumberFieldProps
  | SelectFieldProps
  | TextareaFieldProps
  | CheckboxGroupFieldProps
  | RadioGroupFieldProps
  | CurrencyFieldProps
  | TextListFieldProps
  | DateFieldProps
  | SwitchProps;

export type FieldProps = CommonFieldProps & FieldSpecificProps;

export type FieldComponentProps = FieldProps & Partial<UseFormResult>;

export type OmitOverlap<ExtendedProps, A extends string = ""> = Omit<
  ExtendedProps,
  "name" | "value" | "defaultValue" | "onChange" | A
>;
