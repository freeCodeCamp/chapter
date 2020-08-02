export const getId = (
  query: Record<string, string | string[]>,
): null | number => {
  if (query.id) {
    if (Array.isArray(query.id)) {
      return parseInt(query.id[0]);
    }

    return parseInt(query.id);
  }

  return 1;
};
