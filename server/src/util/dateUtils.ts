export const getDateTimeNMinutesBefore = (
  from: Date,
  nMinutesBefore: number,
): Date => {
  const remindDateTime = new Date(from);
  remindDateTime.setMinutes(remindDateTime.getMinutes() - nMinutesBefore);
  return remindDateTime;
};
