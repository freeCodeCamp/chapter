type Obj = Record<string, number | string | undefined>;

const sanitizeFormData = (data: Obj): Obj => {
  return Object.keys(data).reduce((prev, curr) => {
    const item = data[curr];
    prev[curr] = item;

    if (typeof item === 'string' && item.length === 0) {
      prev[curr] = undefined;
    }

    return prev;
  }, {});
};

export default sanitizeFormData;
