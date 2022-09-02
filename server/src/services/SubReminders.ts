import { prisma } from '../prisma';

export interface SubReminderData {
  eventId: number;
  remindAt: Date;
  userId: number;
}

export type SquentReminder = Awaited<
  ReturnType<typeof getSubRemindersNewerThanDate>
>[number];

const subReminderIncludes = {
  event_user: {
    include: {
      user: true,
      event: {
        include: {
          venue: true,
          chapter: true,
        },
      },
    },
  },
};

export const createSubReminder = async ({
  eventId,
  remindAt,
  userId,
}: SubReminderData) =>
  await prisma.event_reminders.create({
    data: {
      event_user: {
        connect: {
          user_id_event_id: { event_id: eventId, user_id: userId },
        },
      },
      remind_at: remindAt,
    },
  });

export const updateRemindAt = async ({
  eventId,
  remindAt,
  userId,
}: SubReminderData) =>
  await prisma.event_reminders.update({
    data: { remind_at: remindAt },
    where: {
      user_id_event_id: { event_id: eventId, user_id: userId },
    },
  });

export const getSubRemindersNewerThanDate = async (date: Date) =>
  await prisma.event_reminders.findMany({
    include: subReminderIncludes,
    where: {
      remind_at: {
        lte: date,
      },
      notifying: false,
    },
    orderBy: {
      remind_at: 'asc',
    },
  });

export const lockForNotifying = async (reminder: SquentReminder) => {
  const lock = await prisma.event_reminders.updateMany({
    data: { notifying: true },
    where: {
      user_id: reminder.user_id,
      event_id: reminder.event_id,
      notifying: false,
    },
  });
  return { hasLock: lock.count !== 0 };
};

export const lockForRetry = async (reminder: SquentReminder) => {
  const lock = await prisma.event_reminders.updateMany({
    data: { updated_at: new Date() },
    where: {
      user_id: reminder.user_id,
      event_id: reminder.event_id,
      updated_at: reminder.updated_at,
    },
  });
  return { hasLock: lock.count !== 0 };
};
