import type { ParsedUrlQuery } from 'querystring';

export const getId = (query: ParsedUrlQuery): number => {
  if (query.id) {
    if (Array.isArray(query.id)) {
      return parseInt(query.id[0]);
    }

    return parseInt(query.id);
  }

  throw new Error('No id in query');
};
