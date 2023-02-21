export const allValuesAreDefined = (values: Array<unknown>) =>
  values.filter((val: unknown) => !val && val !== 0).length === 0;
