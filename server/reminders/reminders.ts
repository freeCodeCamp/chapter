import { EventWithEverything, UserEventRole } from '../src/graphql-types';
import { prisma } from '../src/prisma';
import MailerService from '../src/services/MailerService';

const daysForward = 5;

const SEND_MAIL = true;
const FLIP_NOTIFY = true;

const getDateTimeRanges = (daysForward: number) => {
  const now = new Date();

  const startDateTime = new Date(now);
  startDateTime.setUTCHours(0, 0, 0);

  const endDateTime = new Date(now);
  endDateTime.setDate(endDateTime.getDate() + daysForward);
  endDateTime.setUTCHours(23, 59, 59);

  return { startDateTime, endDateTime };
};

const getEventsWithRemindersInRange = async (
  startDateTime: Date,
  endDateTime: Date,
) =>
  await prisma.events.findMany({
    include: {
      chapter: true,
      venue: true,
      rsvps: true,
      event_reminders: {
        include: { user: true },
      },
    },
    where: {
      canceled: false,
      start_at: {
        gte: startDateTime,
        lte: endDateTime,
      },
      event_reminders: {
        some: {
          notified: false,
        },
      },
    },
    orderBy: {
      start_at: 'asc',
    },
  });

const reminderMessage = (
  event: Omit<EventWithEverything, 'sponsors' | 'rsvps'>,
  user: Omit<UserEventRole, 'event' | 'role_name' | 'subscribed'>,
  date: string,
  start_time: string,
  end_time: string,
) => {
  return `[${event.name}](Link to the event page, like https://{instance domain name}/chapters/${event.chapter.id}]) organized by ${event.chapter.name} is happening soon.</br>
</br>
Your RSVP Status: {rsvps.name} | [Need to change your RSVP?](link to the chapter page, like https://{instance domain name}/chapters/${event.chapter.id}/events/${event.id}, where there's an option to change the RSVP)</br>
</br>
When: ${date} from ${start_time} to ${end_time} (GMT)</br>
</br>
Where: ${event.venue?.name} | ${event.venue?.street_address} ${event.venue?.city}, ${event.venue?.region} ${event.venue?.postal_code}</br>
</br>
(post-MVP feature) Add to My Calendar: [Google](URL for Google) | [Outlook](URL for Outlook) | [Yahoo](URL for Yahoo) | [iCal](URL for iCal)</br>
</br>
This email was sent to ${user.user.email} by ${event.chapter.name} | ${event.chapter.city}, ${event.chapter.region} ${event.chapter.country}</br>
Copyright © {current year in YYYY format} {Organization}. All rights reserved.</br>


Unsubscribe Options
- [Attend this event, but only turn off future notifications for this event](Unsubscribe link, like https://{instance domain name}/rsvp/unsubscribe/{users.id}/{events.id}/{unsigned JWOT token} which will set the appropriate {event_users.subscribed} to false when clicked)
- Or, [stop receiving all notifications by unfollowing ${event.chapter.name}](Unsubscribe link, like https://{instance domain name}/chapter/unsubscribe/{users.id}/{chapter.id}/{unsigned JWOT token} which will set the appropriate {chapter_users.subscribed} to false when clicked)

[Privacy Policy](link to privacy page)`;
};

(async () => {
  const { startDateTime, endDateTime } = getDateTimeRanges(daysForward);

  const eventsWithReminders = await getEventsWithRemindersInRange(
    startDateTime,
    endDateTime,
  );
  console.log(
    `Events from ${startDateTime.toUTCString()} to ${endDateTime.toUTCString()}`,
  );
  console.log(
    `Events in next ${daysForward} days with reminders: ${eventsWithReminders.length}`,
  );
  console.log();

  const dateFormatter = new Intl.DateTimeFormat('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'GMT',
  });
  const timeFormatter = new Intl.DateTimeFormat('en-us', {
    hour: 'numeric',
    minute: 'numeric',
    timeZone: 'GMT',
  });

  eventsWithReminders.forEach((event) => {
    const reminders = event.event_reminders;

    const date = dateFormatter.format(event.start_at);
    const start_time = timeFormatter.format(event.start_at);
    const end_time = timeFormatter.format(event.ends_at);
    console.log(`Event: ${event.name}`);
    console.log(`${date} from ${start_time} to ${end_time} (GMT)`);
    console.log(`Reminders to send to subscribed users: ${reminders.length}`);

    reminders.forEach(async (user) => {
      const email = reminderMessage(event, user, date, start_time, end_time);
      const subject = `Upcoming Event Reminder for ${event.name}`;
      console.log(`Reminder for ${user.user.email}`);
      if (SEND_MAIL) {
        await new MailerService([user.user.email], subject, email).sendEmail();
      }

      if (FLIP_NOTIFY) {
        await prisma.event_reminders.update({
          data: {
            notified: true,
          },
          where: {
            user_id_event_id: {
              user_id: user.user_id,
              event_id: event.id,
            },
          },
        });
      }
    });
    console.log();
  });
})();
