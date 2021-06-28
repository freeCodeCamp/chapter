export const makeBooleanIterator = (flip = false) => {
  return {
    next() {
      flip = !flip;
      return { value: flip, done: false };
    },
  };
};
