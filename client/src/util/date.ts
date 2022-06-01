import { format } from 'date-fns';

export const formatDate = (date: string | Date | number) => {
  return format(new Date(date), 'E, LLL d @ HH:mm');
};
