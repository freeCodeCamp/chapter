import { prisma } from '../prisma';

export type Reminder = Awaited<
  ReturnType<typeof getRemindersOlderThanDate>
>[number];

export interface ReminderData {
  eventId: number;
  remindAt: Date;
  userId: number;
  rsvpName: string;
}

export const createReminder = async ({
  eventId,
  remindAt,
  userId,
  rsvpName,
}: ReminderData) =>
  await prisma.event_reminders.create({
    data: {
      event_user: {
        connect: {
          user_id_event_id: {
            rsvp_name: rsvpName,
            event_id: eventId,
            user_id: userId,
          },
        },
      },
      remind_at: remindAt,
    },
  });

export const deleteReminder = async (reminder: Reminder) =>
  await prisma.event_reminders.delete({
    where: {
      user_id_event_id: {
        user_id: reminder.user_id,
        event_id: reminder.event_id,
        rsvp_name: reminder.rsvp_name,
      },
    },
  });

export const deleteEventReminders = async (eventId: number) =>
  await prisma.event_reminders.deleteMany({ where: { event_id: eventId } });

const reminderIncludes = {
  event_user: {
    include: {
      user: true,
      event: {
        include: {
          venue: true,
          chapter: true,
          rsvp: true,
        },
      },
    },
  },
};

export const updateRemindAt = async ({
  eventId,
  remindAt,
  userId,
  rsvpName,
}: ReminderData) =>
  await prisma.event_reminders.update({
    data: { remind_at: remindAt },
    where: {
      user_id_event_id: {
        event_id: eventId,
        user_id: userId,
        rsvp_name: rsvpName,
      },
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

export const getOldReminders = async (date: Date) =>
  await prisma.event_reminders.findMany({
    include: reminderIncludes,
    where: {
      notifying: true,
      updated_at: {
        lte: date,
      },
    },
  });

export const lockForNotifying = async (reminder: Reminder) => {
  const lock = await prisma.event_reminders.updateMany({
    data: { notifying: true },
    where: {
      user_id: reminder.user_id,
      event_id: reminder.event_id,
      rsvp_name: reminder.rsvp_name,
      notifying: false,
    },
  });
  return { hasLock: lock.count !== 0 };
};

export const lockForRetry = async (reminder: Reminder) => {
  const lock = await prisma.event_reminders.updateMany({
    data: { updated_at: new Date() },
    where: {
      user_id: reminder.user_id,
      event_id: reminder.event_id,
      rsvp_name: reminder.rsvp_name,
      updated_at: reminder.updated_at,
    },
  });
  return { hasLock: lock.count !== 0 };
};
function connect(
  arg0: { data: { event_user: { rsvp: any } } },
  arg1: { name: void },
  connect: any,
  arg3: { user_id_event_id: { event_id: number; user_id: number } },
) {
  throw new Error('Function not implemented.');
}
