import { format } from 'date-fns';

export const formatDate = (date?: Date | string | number) =>
  format(new Date(date || Date.now()), 'E, LLL d @ HH:mm');
