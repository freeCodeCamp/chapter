export const truncate = (str: string, len = 100) => {
  if (str.length <= len) return str;
  const lastSpace = str.slice(0, len - 2).lastIndexOf(' ');
  return lastSpace === -1
    ? str.slice(0, len - 3) + '...'
    : str.slice(0, lastSpace) + '...';
};
