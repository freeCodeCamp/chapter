import { prisma } from '../prisma';

export interface ReminderData {
  eventId: number;
  remindAt: Date;
  userId: number;
}

export const createReminder = async ({
  eventId,
  remindAt,
  userId,
}: ReminderData) =>
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

export const deleteReminder = async (reminder: SquentReminder) =>
  await prisma.event_reminders.delete({
    where: {
      user_id_event_id: {
        user_id: reminder.user_id,
        event_id: reminder.event_id,
      },
    },
  });

export const deleteEventReminders = async (eventId: number) =>
  await prisma.event_reminders.deleteMany({ where: { event_id: eventId } });

const reminderIncludes = {
  event_user: {
    include: {
      user: true,
      rsvp: true,
      event: {
        include: {
          venue: true,
          chapter: true,
        },
      },
    },
  },
};

export const updateRemindAt = async ({
  eventId,
  remindAt,
  userId,
}: ReminderData) =>
  await prisma.event_reminders.update({
    data: { remind_at: remindAt },
    where: {
      user_id_event_id: { event_id: eventId, user_id: userId },
    },
  });

export const getRemindersOlderThanDate = async (date: Date) =>
  await prisma.event_reminders.findMany({
    include: reminderIncludes,
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

export const getRemindersNewerThanDate = async (date: Date) =>
  await prisma.event_reminders.findMany({
    include: reminderIncludes,
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

export type SquentReminder = Awaited<
  ReturnType<typeof getRemindersNewerThanDate>
>[number];
