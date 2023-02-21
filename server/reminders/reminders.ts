import mailerService from '../src/services/MailerService';
import {
  deleteReminder,
  getRemindersOlderThanDate,
  getOldReminders,
  lockForNotifying,
  lockForRetry,
  Reminder,
} from '../src/services/Reminders';
import {
  generateToken,
  UnsubscribeType,
} from '../src/services/UnsubscribeToken';

const processingLimitInMinutes = 10;
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

type LockCheck = (reminder: Reminder) => Promise<{ hasLock: boolean }>;

interface ReminderMessageData {
  event: Reminder['event_user']['event'];
  user: Reminder['event_user']['user'];
  date: string;
  start_time: string;
  end_time: string;
  chapterUnsubscribeToken: string;
  eventUnsubscribeToken: string;
}

const reminderMessage = ({
  event,
  user,
  date,
  start_time,
  end_time,
  chapterUnsubscribeToken,
  eventUnsubscribeToken,
}: ReminderMessageData) => {
  return `[${event.name}](Link to the event page, like https://{instance domain name}/chapters/${event.chapter.id}]) organized by ${event.chapter.name} is happening soon.<br />
<br />
Your RSVP Status: {rsvps.name} | [Need to change your RSVP?](link to the chapter page, like https://{instance domain name}/chapters/${event.chapter.id}/events/${event.id}, where there's an option to change the RSVP)<br />
<br />
When: ${date} from ${start_time} to ${end_time} (GMT)<br />
<br />
Where: ${event.venue?.name} | ${event.venue?.street_address} ${event.venue?.city}, ${event.venue?.region} ${event.venue?.postal_code}<br />
<br />
(post-MVP feature) Add to My Calendar: [Google](URL for Google) | [Outlook](URL for Outlook) | [Yahoo](URL for Yahoo) | [iCal](URL for iCal)<br />
<br />
This email was sent to ${user.email} by ${event.chapter.name} | ${event.chapter.city}, ${event.chapter.region} ${event.chapter.country}<br />
Copyright © {current year in YYYY format} {Organization}. All rights reserved.<br />


Unsubscribe Options
- [Attend this event, but only turn off future notifications for this event](${process.env.CLIENT_LOCATION}/unsubscribe?token=${eventUnsubscribeToken})
- Or, [stop receiving notifications about new events in chapter by unfollowing ${event.chapter.name}](${process.env.CLIENT_LOCATION}/unsubscribe?token=${chapterUnsubscribeToken})

[Privacy Policy](link to privacy page)`;
};

const getEmailData = (reminder: Reminder) => {
  const date = dateFormatter.format(reminder.event_user.event.start_at);
  const start_time = timeFormatter.format(reminder.event_user.event.start_at);
  const end_time = timeFormatter.format(reminder.event_user.event.ends_at);
  console.log(`Event: ${reminder.event_user.event.name}`);
  console.log(`${date} from ${start_time} to ${end_time} (GMT)`);
  console.log(`Remind at ${reminder.remind_at.toUTCString()}`);
  console.log();

  const chapterUnsubscribeToken = generateToken(
    UnsubscribeType.Chapter,
    reminder.event_user.event.chapter_id,
    reminder.event_user.user_id,
  );
  const eventUnsubscribeToken = generateToken(
    UnsubscribeType.Event,
    reminder.event_user.event_id,
    reminder.event_user.user_id,
  );

  const email = reminderMessage({
    event: reminder.event_user.event,
    user: reminder.event_user.user,
    date: date,
    start_time: start_time,
    end_time: end_time,
    chapterUnsubscribeToken: chapterUnsubscribeToken,
    eventUnsubscribeToken: eventUnsubscribeToken,
  });
  const subject = `Upcoming Event Reminder for ${reminder.event_user.event.name}`;
  return { email: email, subject: subject };
};

const sendEmailForReminder = async (reminder: Reminder) => {
  const { email, subject } = getEmailData(reminder);
  await mailerService.sendEmail({
    emailList: [reminder.event_user.user.email],
    subject: subject,
    htmlEmail: email,
  });
};

const processReminders = async (reminders: Reminder[], lock: LockCheck) =>
  await Promise.all(
    reminders.map(async (reminder) => {
      const { hasLock } = await lock(reminder);
      if (!hasLock) {
        return;
      }
      await sendEmailForReminder(reminder);
      await deleteReminder(reminder);
    }),
  );

(async () => {
  const date = new Date();
  const reminders = await getRemindersOlderThanDate(date);
  console.log(
    `Reminders older than ${date.toUTCString()}: ${reminders.length}`,
  );
  console.log();
  await processReminders(reminders, lockForNotifying);

  const updateDate = new Date();
  updateDate.setMinutes(updateDate.getMinutes() - processingLimitInMinutes);
  const oldReminders = await getOldReminders(updateDate);
  console.log(
    `Old reminders updated before ${updateDate.toUTCString()}: ${
      oldReminders.length
    }`,
  );
  await processReminders(oldReminders, lockForRetry);
})();
