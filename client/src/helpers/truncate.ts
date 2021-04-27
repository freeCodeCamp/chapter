export const truncate = (str: string, len?: number) => {
  const lastSpace = str.slice(0, len || 100).lastIndexOf(' ');
  return str.slice(0, lastSpace) + '...';
};
