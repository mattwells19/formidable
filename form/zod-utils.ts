import { useMemo } from "react";
import { useIntl } from "react-intl";
import zod from "zod";

export const useZodUtils = () => {
  const { formatMessage } = useIntl();
  const defaultRequiredMsg = formatMessage({ id: "fieldIsRequired" });

  return useMemo(() => {
    const singleSelect = () =>
      zod.string({
        required_error: defaultRequiredMsg,
      });

    const text = () =>
      zod
        .string({
          required_error: defaultRequiredMsg,
        })
        .trim()
        .min(1, {
          message: defaultRequiredMsg,
        });

    const number = () =>
      zod.number({
        invalid_type_error: defaultRequiredMsg,
        required_error: defaultRequiredMsg,
      });

    const multiSelect = () =>
      zod.string().array().min(1, {
        message: defaultRequiredMsg,
      });

    const date = () =>
      zod
        .date({
          invalid_type_error: defaultRequiredMsg,
        })
        .refine((val) => Boolean(val), {
          message: defaultRequiredMsg,
        });

    const switchV = () =>
      zod
        .boolean()
        .default(false)
        .refine((val) => val, {
          message: defaultRequiredMsg,
        });

    const form = zod.object;

    return {
      singleSelect,
      text,
      number,
      multiSelect,
      date,
      switch: switchV,
      form,
    };
  }, [defaultRequiredMsg]);
};
