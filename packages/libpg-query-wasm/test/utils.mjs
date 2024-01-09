const isObject = (v) => typeof v === "object" && v !== null;

export const omitUndefinedProps = (obj) => {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) continue;

    let newValue = value;
    if (Array.isArray(value)) {
      newValue = value.map((v) => (isObject(v) ? omitUndefinedProps(v) : v));
    } else if (isObject(value)) {
      newValue = omitUndefinedProps(value);
    }

    result[key] = newValue;
  }
  return result;
};
