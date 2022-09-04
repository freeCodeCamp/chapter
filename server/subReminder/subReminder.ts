import MailerService from '../src/services/MailerService';
import {
  lockForNotifying,
  getSubRemindersNewerThanDate,
  SubReminder,
} from '../src/services/SubReminders';
import { generateToken, SubscribeType } from '../src/services/SubscribeToken';

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

type LockCheck = (subReminder: SubReminder) => Promise<{ hasLock: boolean }>;

const processReminders = async (subReminders: SubReminder[], lock: LockCheck) =>
  await Promise.all(
    subReminders.map(async (subReminder) => {
      const { hasLock } = await lock(subReminder);
      if (!hasLock) {
        return;
      }
      await sendEmailForReminder(subReminder);
    }),
  );

interface ReminderMessageData {
  event: SubReminder['event_user']['event'];
  user: SubReminder['event_user']['user'];
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
- [Attend this event, but only turn off future notifications for this event](${process.env.CLIENT_LOCATION}/unsubscribe?token=${eventUnsubscribeToken})
- Or, [stop receiving all notifications by unfollowing ${event.chapter.name}](${process.env.CLIENT_LOCATION}/unsubscribe?token=${chapterUnsubscribeToken})

[Privacy Policy](link to privacy page)`;
};

const getEmailData = (subReminder: SubReminder) => {
  const date = dateFormatter.format(subReminder.event_user.event.start_at);
  const start_time = timeFormatter.format(
    subReminder.event_user.event.start_at,
  );
  const end_time = timeFormatter.format(subReminder.event_user.event.ends_at);
  console.log(`Event: ${subReminder.event_user.event.name}`);
  console.log(`${date} from ${start_time} to ${end_time} (GMT)`);
  console.log(
    `Remind at ${subReminder.remind_at.toUTCString()} to ${
      subReminder.event_user.user.email
    }`,
  );
  console.log();

  const chapterUnsubscribeToken = generateToken(
    SubscribeType.Chapter,
    subReminder.event_user.event.chapter_id,
    subReminder.event_user.user_id,
  );
  const eventUnsubscribeToken = generateToken(
    SubscribeType.Event,
    subReminder.event_user.event_id,
    subReminder.event_user.user_id,
  );

  const email = reminderMessage({
    event: subReminder.event_user.event,
    user: subReminder.event_user.user,
    date: date,
    start_time: start_time,
    end_time: end_time,
    chapterUnsubscribeToken: chapterUnsubscribeToken,
    eventUnsubscribeToken: eventUnsubscribeToken,
  });
  const subject = `Upcoming Event subReminder for ${subReminder.event_user.event.name}`;
  return { email: email, subject: subject };
};

const sendEmailForReminder = async (subReminder: SubReminder) => {
  const { email, subject } = getEmailData(subReminder);
  await new MailerService({
    emailList: [subReminder.event_user.user.email],
    subject: subject,
    htmlEmail: email,
  }).sendEmail();
};

async () => {
  const date = new Date();
  const reminders = await getSubRemindersNewerThanDate(date);
  console.log(
    `Reminders older than ${date.toUTCString()}: ${reminders.length}`,
  );
  console.log();
  await processReminders(reminders, lockForNotifying);
};
