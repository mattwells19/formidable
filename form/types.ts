import type {
  TextFieldProps,
  NumberFieldProps,
  SelectFieldProps,
  TextareaFieldProps,
  CheckboxGroupFieldProps,
  RadioGroupFieldProps,
  CurrencyFieldProps,
  TextListFieldProps,
  DateFieldProps,
  SwitchFieldProps,
  AutocompleteFieldProps,
} from "./components";
import { UseFormResult } from "./contexts/FormContext";

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
  | "switch"
  | "autocomplete";

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

export type CommonOptionsProps = {
  options: Array<string>;
  getOptionLabel?: (option: string) => string;
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
  | SwitchFieldProps
  | AutocompleteFieldProps;

export type FieldProps = CommonFieldProps & FieldSpecificProps;

export type FieldComponentProps = FieldProps & Partial<UseFormResult>;

export type OmitOverlap<ExtendedProps, A extends string = ""> = Omit<
  ExtendedProps,
  "name" | "value" | "defaultValue" | "onChange" | A
>;
