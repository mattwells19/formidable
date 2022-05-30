import { useMemo } from "react";
import { useIntl } from "react-intl";
import zod from "zod";

const useZodUtils = () => {
  const { formatMessage } = useIntl();
  const defaultRequiredMsg = formatMessage({ id: "fieldIsRequired" });

  return useMemo(() => {
    const radio = () =>
      zod.string().min(1, {
        message: defaultRequiredMsg,
      });

    const text = () =>
      zod.string().trim().min(1, {
        message: defaultRequiredMsg,
      });

    const number = () =>
      zod.number({
        invalid_type_error: defaultRequiredMsg,
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
      radio,
      text,
      number,
      multiSelect,
      date,
      switch: switchV,
      form,
    };
  }, [defaultRequiredMsg]);
};

export default useZodUtils;
