export const getDateTimeNMinutesBefore = (
  from: Date,
  nMinutesBefore: number,
): Date => {
  const dateTime = new Date(from);
  dateTime.setMinutes(dateTime.getMinutes() - nMinutesBefore);
  return dateTime;
};
