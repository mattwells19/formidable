import type { FormElement } from "./types";

export function extractFormValues(
  fields: Array<FormElement>,
  formDataObj: FormData
): Record<string, string | number | Array<string>> {
  return fields.reduce((acc, field) => {
    switch (field.type) {
      case "toggle-radio":
      case "textarea":
      case "select":
      case "text":
        return {
          ...acc,
          [field.name]: formDataObj.getAll(field.name)[0]?.toString(),
        };
      case "currency":
      case "number":
        return {
          ...acc,
          [field.name]: parseInt(
            formDataObj.getAll(field.name)[0]?.toString(),
            10
          ),
        };
      case "toggle-checkbox": {
        return {
          ...acc,
          [field.name]: formDataObj
            .getAll(field.name)
            .map((item) => item.toString()),
        };
      }
      case "multi-select": {
        const inputValue = formDataObj.getAll(field.name)[0].toString();
        const value =
          inputValue.length > 0
            ? inputValue.split(",").map((item) => item.toString())
            : [];

        return {
          ...acc,
          [field.name]: value,
        };
      }
      case "date": {
        const value = formDataObj.getAll(field.name)[0]?.toString();

        return {
          ...acc,
          [field.name]: value ? new Date(value) : null,
        };
      }
      case "switch": {
        return {
          ...acc,
          [field.name]: formDataObj.get(field.name) !== null,
        };
      }
      default:
        return acc;
    }
  }, {});
}

export function getUTCDate(date: Date = new Date()): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
}
