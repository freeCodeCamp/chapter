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

export const deleteEventReminders = async (eventId: number) =>
  await prisma.event_reminders.deleteMany({ where: { event_id: eventId } });

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
