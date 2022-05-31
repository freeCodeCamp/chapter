import { format } from 'date-fns';

export const formatDate = (date: string | Date) => {
  return format(new Date(date), 'E, LLL d @ HH:mm');
};
