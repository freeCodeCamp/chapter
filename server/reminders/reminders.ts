import { EventWithEverything, User } from '../src/graphql-types';
import { prisma } from '../src/prisma';
import MailerService from '../src/services/MailerService';

const daysForward = 5;

const SEND_MAIL = true;
const FLIP_NOTIFY = true;

const getRemindersOlderThanDate = async (date: Date) =>
  await prisma.event_reminders.findMany({
    include: {
      rsvp: true,
      user: true,
      event: {
        include: {
          chapter: true,
          venue: true,
        },
      },
    },
    where: {
      remind_at: {
        lte: date,
      },
      notified: false,
    },
    orderBy: {
      remind_at: 'asc',
    },
  });

const reminderMessage = (
  event: Omit<EventWithEverything, 'sponsors' | 'rsvps'>,
  user: User,
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
This email was sent to ${user.email} by ${event.chapter.name} | ${event.chapter.city}, ${event.chapter.region} ${event.chapter.country}</br>
Copyright © {current year in YYYY format} {Organization}. All rights reserved.</br>


Unsubscribe Options
- [Attend this event, but only turn off future notifications for this event](Unsubscribe link, like https://{instance domain name}/rsvp/unsubscribe/{users.id}/{events.id}/{unsigned JWOT token} which will set the appropriate {event_users.subscribed} to false when clicked)
- Or, [stop receiving all notifications by unfollowing ${event.chapter.name}](Unsubscribe link, like https://{instance domain name}/chapter/unsubscribe/{users.id}/{chapter.id}/{unsigned JWOT token} which will set the appropriate {chapter_users.subscribed} to false when clicked)

[Privacy Policy](link to privacy page)`;
};

(async () => {
  const date = new Date();
  date.setDate(date.getDate() + daysForward);
  const reminders = await getRemindersOlderThanDate(date);
  console.log(
    `Reminders older than ${date.toUTCString()}: ${reminders.length}`,
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

  reminders.forEach(async (reminder) => {
    const date = dateFormatter.format(reminder.event.start_at);
    const start_time = timeFormatter.format(reminder.event.start_at);
    const end_time = timeFormatter.format(reminder.event.ends_at);
    console.log(`Event: ${reminder.event.name}`);
    console.log(`${date} from ${start_time} to ${end_time} (GMT)`);
    console.log(
      `Remind at ${reminder.remind_at.toUTCString()} to ${reminder.user.email}`,
    );

    const email = reminderMessage(
      reminder.event,
      reminder.user,
      date,
      start_time,
      end_time,
    );
    const subject = `Upcoming Event Reminder for ${reminder.event.name}`;
    if (SEND_MAIL) {
      await new MailerService(
        [reminder.user.email],
        subject,
        email,
      ).sendEmail();
    }

    if (FLIP_NOTIFY) {
      await prisma.event_reminders.update({
        data: {
          notified: true,
        },
        where: {
          user_id_event_id: {
            user_id: reminder.user.id,
            event_id: reminder.event.id,
          },
        },
      });
    }
    console.log();
  });
})();
