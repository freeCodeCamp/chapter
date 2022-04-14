import type { ParsedUrlQuery } from 'querystring';

export const getId = (query: ParsedUrlQuery): number | null => {
  if (query?.id === undefined) return null;
  if (Array.isArray(query.id)) return parseInt(query.id[0]);
  return parseInt(query.id);
};
