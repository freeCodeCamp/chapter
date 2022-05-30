import { format, addMinutes } from 'date-fns';

export const formatDate = (date: string) => {
  const offset = new Date().getTimezoneOffset();
  const zonedDate = addMinutes(new Date(date), offset);
  return format(zonedDate, 'E, LLL d @ HH:mm');
};
