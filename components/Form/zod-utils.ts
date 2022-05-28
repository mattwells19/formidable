import zod from "zod";

const zodUtils = {
  radio: zod.string().min(1),
  text: zod.string().trim().min(1),
  multi: zod.preprocess((val) => {
    if (Array.isArray(val)) return val;
    if (val === undefined) return [];
    return [val];
  }, zod.string().array().min(1)),
  number: zod.number().min(0).default(-1),
};

export default zodUtils;
