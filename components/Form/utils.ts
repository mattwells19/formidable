import type { FormElement } from "./types";

export function extractFormValues(
  fields: Array<FormElement>,
  formDataObj: FormData
): Record<string, string | number | Array<string>> {
  return fields.reduce((acc, field) => {
    if (!formDataObj.has(field.name)) return acc;
    switch (field.type) {
      case "toggle-radio":
      case "textarea":
      case "select":
      case "text":
        return {
          ...acc,
          [field.name]: formDataObj.getAll(field.name)[0].toString(),
        };
      case "currency":
      case "number":
        return {
          ...acc,
          [field.name]: parseInt(
            formDataObj.getAll(field.name)[0].toString(),
            10
          ),
        };
      case "toggle-checkbox":
        return {
          ...acc,
          [field.name]: formDataObj
            .getAll(field.name)
            .map((item) => item.toString()),
        };
      case "multi-select":
        const inputValue = formDataObj.getAll(field.name)[0].toString();
        const value =
          inputValue.length > 0
            ? inputValue.split(",").map((item) => item.toString())
            : [];

        return {
          ...acc,
          [field.name]: value,
        };
      default:
        return acc;
    }
  }, {});
}
