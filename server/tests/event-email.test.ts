import { events_venue_type_enum } from '@prisma/client';

import {
  buildEmailForUpdatedEvent,
  eventAttendanceCancelation,
  eventAttendanceConfirmation,
  eventAttendanceRequest,
  eventAttendeeToWaitlistEmail,
  eventCancelationEmail,
  eventConfirmAttendeeEmail,
  eventInviteEmail,
  eventNewAttendeeNotifyEmail,
  eventWaitlistConfirmation,
} from '../src/util/event-email';

const streaming_url = 'http://streaming.url/abcd';

describe('event-email', () => {
  describe('eventInviteEmail', () => {
    const data = {
      chapter: { id: 1, name: 'Not so serious' },
      chapter_id: 1,
      description: 'additional description',
      ends_at: new Date('2023-02-07 12:30'),
      id: 1,
      name: 'Very serious name',
      start_at: new Date('2023-02-07 12:00'),
      streaming_url: null,
      venue: null,
      venue_type: events_venue_type_enum.PhysicalAndOnline,
    };

    it('should return object with subject, emailText, attachUnsubscribe and attachUnsubscribeText properties', () => {
      const result = eventInviteEmail(data);
      expect(result).toHaveProperty('subject');
      expect(result).toHaveProperty('emailText');
      expect(result).toHaveProperty('attachUnsubscribe');
      expect(result).toHaveProperty('attachUnsubscribeText');
    });

    it('should return object with expected subject', () => {
      const { subject } = eventInviteEmail(data);
      expect(subject).toEqual('Invitation to Very serious name.');
    });

    it('should return object with expected emailText for Physical & Online event', () => {
      const { emailText } = eventInviteEmail(data);
      expect(emailText).toEqual(`Upcoming event for Not so serious.<br />
<br />
When: Tue Feb 07 2023 12:00:00 GMT+0000 (Coordinated Universal Time) to Tue Feb 07 2023 12:30:00 GMT+0000 (Coordinated Universal Time)
<br />
Where: Undecided/TBD<br />
Streaming URL: Undecided/TBD<br />
<br />
Go to <a href="http://localhost:3000/events/1?confirm_attendance=true">the event page</a> to confirm your attendance.<br />
----------------------------<br />
<br />

About the event: <br />
additional description<br />
----------------------------<br />
<br />

View all upcoming events for Not so serious: <a href='http://localhost:3000/chapters/1'>Not so serious chapter</a>.<br />
<br />`);
    });

    it('should return object with expected emailText for in-person only event', () => {
      const { emailText } = eventInviteEmail({
        ...data,
        venue_type: events_venue_type_enum.Physical,
      });
      expect(emailText).toEqual(`Upcoming event for Not so serious.<br />
<br />
When: Tue Feb 07 2023 12:00:00 GMT+0000 (Coordinated Universal Time) to Tue Feb 07 2023 12:30:00 GMT+0000 (Coordinated Universal Time)
<br />
Where: Undecided/TBD<br />
<br />
Go to <a href="http://localhost:3000/events/1?confirm_attendance=true">the event page</a> to confirm your attendance.<br />
----------------------------<br />
<br />

About the event: <br />
additional description<br />
----------------------------<br />
<br />

View all upcoming events for Not so serious: <a href='http://localhost:3000/chapters/1'>Not so serious chapter</a>.<br />
<br />`);
    });

    it('should return object with expected emailText for online-only event', () => {
      const { emailText } = eventInviteEmail({
        ...data,
        venue_type: events_venue_type_enum.Online,
      });
      expect(emailText).toEqual(`Upcoming event for Not so serious.<br />
<br />
When: Tue Feb 07 2023 12:00:00 GMT+0000 (Coordinated Universal Time) to Tue Feb 07 2023 12:30:00 GMT+0000 (Coordinated Universal Time)
<br />
Streaming URL: Undecided/TBD<br />
<br />
Go to <a href="http://localhost:3000/events/1?confirm_attendance=true">the event page</a> to confirm your attendance.<br />
----------------------------<br />
<br />

About the event: <br />
additional description<br />
----------------------------<br />
<br />

View all upcoming events for Not so serious: <a href='http://localhost:3000/chapters/1'>Not so serious chapter</a>.<br />
<br />`);
    });
  });

  describe('eventCancelationEmail', () => {
    const data = {
      name: 'Hammes - Sawayn',
      chapter: { id: 1, name: 'Stehr Group' },
    };
    it('should return object with subject, emailText, attachUnsubscribe and attachUnsubscribeText properties', () => {
      const result = eventCancelationEmail(data);
      expect(result).toHaveProperty('subject');
      expect(result).toHaveProperty('emailText');
      expect(result).toHaveProperty('attachUnsubscribe');
      expect(result).toHaveProperty('attachUnsubscribeText');
    });

    it('should return object with expected subject', () => {
      const expected = { subject: 'Event Hammes - Sawayn is canceled' };
      expect(eventCancelationEmail(data)).toMatchObject(expected);
    });

    it('should return object with expected emailText', () => {
      const expected = {
        emailText: `The upcoming event Hammes - Sawayn has been canceled.<br />
<br />
View upcoming events for Stehr Group: <a href='http://localhost:3000/chapters/1'>Stehr Group chapter</a>.<br />
You received this email because you Subscribed to Hammes - Sawayn Event.<br />`,
      };
      expect(eventCancelationEmail(data)).toMatchObject(expected);
    });
  });

  describe('eventConfirmAttendeeEmail', () => {
    const event = {
      name: 'Emard and Sons',
      streaming_url: 'http://streaming.url/abcd',
      venue: null,
      venue_type: events_venue_type_enum.PhysicalAndOnline,
      start_at: new Date('2023-02-07 12:00'),
      ends_at: new Date('2023-02-07 12:30'),
    };
    it('should return object with subject, emailText, attachUnsubscribe and attachUnsubscribeText properties', () => {
      const result = eventConfirmAttendeeEmail(event);
      expect(result).toHaveProperty('subject');
      expect(result).toHaveProperty('emailText');
      expect(result).toHaveProperty('attachUnsubscribe');
      expect(result).toHaveProperty('attachUnsubscribeText');
    });

    it('should return object with expected subject', () => {
      const expected = { subject: 'Your attendance is confirmed' };
      expect(eventConfirmAttendeeEmail(event)).toMatchObject(expected);
    });

    it('should return object with expected emailText', () => {
      const expected = {
        emailText: `Your reservation is confirmed. You can attend the event Emard and Sons.<br />
<br />
When: Tue Feb 07 2023 12:00:00 GMT+0000 (Coordinated Universal Time) to Tue Feb 07 2023 12:30:00 GMT+0000 (Coordinated Universal Time)
<br />
Where: Undecided/TBD<br />
Streaming URL: http://streaming.url/abcd<br />
<br />`,
      };
      expect(eventConfirmAttendeeEmail(event)).toMatchObject(expected);
    });
  });

  describe('eventAttendeeToWaitlistEmail', () => {
    const data = 'Emard and Sons';
    it('should return object with subject, emailText, attachUnsubscribe and attachUnsubscribeText properties', () => {
      const result = eventAttendeeToWaitlistEmail(data);
      expect(result).toHaveProperty('subject');
      expect(result).toHaveProperty('emailText');
      expect(result).toHaveProperty('attachUnsubscribe');
      expect(result).toHaveProperty('attachUnsubscribeText');
    });

    it('should return object with expected subject', () => {
      const expected = { subject: 'You have been put on the waitlist' };
      expect(eventAttendeeToWaitlistEmail(data)).toMatchObject(expected);
    });

    it('should return object with expected emailText', () => {
      const expected = {
        emailText: `Your attendance status for Emard and Sons was changed by the event administrator. You are now on the waitlist.`,
      };
      expect(eventAttendeeToWaitlistEmail(data)).toMatchObject(expected);
    });
  });

  describe('eventNewAttendeeNotifyEmail', () => {
    const data = { eventName: 'Howe LLC', userName: 'Not the Owner' };
    it('should return object with subject, emailText, attachUnsubscribe and attachUnsubscribeText properties', () => {
      const result = eventNewAttendeeNotifyEmail(data);
      expect(result).toHaveProperty('subject');
      expect(result).toHaveProperty('emailText');
      expect(result).toHaveProperty('attachUnsubscribe');
      expect(result).toHaveProperty('attachUnsubscribeText');
    });

    it('should return object with expected subject', () => {
      const expected = { subject: 'New attendee for Howe LLC' };
      expect(eventNewAttendeeNotifyEmail(data)).toMatchObject(expected);
    });

    it('should return object with expected emailText', () => {
      const expected = { emailText: `User Not the Owner is attending.` };
      expect(eventNewAttendeeNotifyEmail(data)).toMatchObject(expected);
    });
  });

  describe('eventAttendanceConfirmation', () => {
    const data = {
      event: {
        name: 'Howe LLC',
        start_at: new Date('2023-02-07 12:00'),
        ends_at: new Date('2023-02-07 12:30'),
        description: '',
        streaming_url: 'http://streaming.url/abcd',
        venue: { name: 'Nitzsche - Hills' },
        venue_type: events_venue_type_enum.PhysicalAndOnline,
      },
      userName: 'Not the Owner',
    };
    it('should return object with subject, emailText, attachUnsubscribe and attachUnsubscribeText properties', () => {
      const result = eventAttendanceConfirmation(data);
      expect(result).toHaveProperty('subject');
      expect(result).toHaveProperty('emailText');
      expect(result).toHaveProperty('attachUnsubscribe');
      expect(result).toHaveProperty('attachUnsubscribeText');
    });

    it('should return object with expected subject', () => {
      const expected = { subject: 'Confirmation of attendance: Howe LLC' };
      expect(eventAttendanceConfirmation(data)).toMatchObject(expected);
    });

    it('should return object with expected emailText', () => {
      const expected = {
        emailText: `Hi Not the Owner,<br />
Confirming your attendance of Howe LLC.<br />
<br />
When: Tue Feb 07 2023 12:00:00 GMT+0000 (Coordinated Universal Time) to Tue Feb 07 2023 12:30:00 GMT+0000 (Coordinated Universal Time)
<br />
Where: Nitzsche - Hills<br />
Streaming URL: http://streaming.url/abcd<br />
<br />
You should receive a calendar invite shortly. If you do not, you can add the event to your calendars by clicking on the links below:<br />
<br />
<a href=https://calendar.google.com/calendar/render?action=TEMPLATE&dates=20230207T120000Z%2F20230207T123000Z&details=&location=Nitzsche%20-%20Hills&text=Howe%20LLC>Google</a>
<br />
<a href=https://outlook.live.com/calendar/0/deeplink/compose?allday=false&body=&enddt=2023-02-07T12%3A30%3A00&location=Nitzsche%20-%20Hills&path=%2Fcalendar%2Faction%2Fcompose&rru=addevent&startdt=2023-02-07T12%3A00%3A00&subject=Howe%20LLC>Outlook</a>`,
      };
      expect(eventAttendanceConfirmation(data)).toMatchObject(expected);
    });
  });

  describe('buildEmailForUpdatedEvent', () => {
    const oldData = {
      name: 'Hammes, Stehr and Waters',
      start_at: new Date('2023-02-08 16:00'),
      ends_at: new Date('2023-02-09 16:00'),
      streaming_url: null,
      venue_type: events_venue_type_enum.Online,
      venue: null,
      venue_id: null,
    };

    it('should return object with subject, emailText, attachUnsubscribe and attachUnsubscribeText properties', () => {
      const result = buildEmailForUpdatedEvent({
        oldData,
        newData: {
          ...oldData,
          ends_at: new Date('2023-02-09 12:00'),
        },
      });
      expect(result).toHaveProperty('subject');
      expect(result).toHaveProperty('emailText');
      expect(result).toHaveProperty('attachUnsubscribe');
      expect(result).toHaveProperty('attachUnsubscribeText');
    });

    it('should return object with expected subject', () => {
      const expected = {
        subject: 'Details changed for event Hammes, Stehr and Waters',
      };
      expect(
        buildEmailForUpdatedEvent({ oldData, newData: oldData }),
      ).toMatchObject(expected);
    });

    it('should return object with expected emailText', () => {
      const expected = {
        emailText: `Updated venue details<br />

Event was online-only, but now it will be held also in-person. Online attendees are still welcome.<br />
----------------------------<br />
<br />

The event is now being held at <br />
<br />
- Unknown stage <br />
- 42402 Jacobi Camp <br />
- Laceyhaven <br />
- Over the Rainbow <br />
- 64751-5878<br />
----------------------------<br />
<br />

Streaming URL: http://streaming.url/abcd<br />
----------------------------<br />
<br />


- Start: Fri, Feb 10 @ 11:00 GMT+00:00<br />
- End: Sat, Feb 11 @ 11:00 GMT+00:00<br />
----------------------------<br />
<br />\n`,
      };
      expect(
        buildEmailForUpdatedEvent({
          newData: {
            ...oldData,
            start_at: new Date('2023-02-10 11:00'),
            ends_at: new Date('2023-02-11 11:00'),
            streaming_url,
            venue_type: events_venue_type_enum.PhysicalAndOnline,
            venue: {
              name: 'Unknown stage',
              street_address: '42402 Jacobi Camp',
              city: 'Laceyhaven',
              postal_code: '64751-5878',
              region: 'Over the Rainbow',
            },
            venue_id: 3,
          },
          oldData,
        }),
      ).toMatchObject(expected);
    });
  });

  describe('eventAttendanceCancelation', () => {
    const data = { event: { name: 'Huel - Lynch' }, userName: 'The Owner' };
    it('should return object with subject, emailText, attachUnsubscribe and attachUnsubscribeText properties', () => {
      const result = eventAttendanceCancelation(data);
      expect(result).toHaveProperty('subject');
      expect(result).toHaveProperty('emailText');
      expect(result).toHaveProperty('attachUnsubscribe');
      expect(result).toHaveProperty('attachUnsubscribeText');
    });

    it('should return object with expected subject', () => {
      const expected = { subject: 'Cancelation of attendance: Huel - Lynch' };
      expect(eventAttendanceCancelation(data)).toMatchObject(expected);
    });

    it('should return object with expected emailText for Physical & Online event', () => {
      const expected = {
        emailText: `Hi The Owner,<br />\nYour attendance was canceled.`,
      };
      expect(eventAttendanceCancelation(data)).toMatchObject(expected);
    });
  });

  describe('eventWaitlistConfirmation', () => {
    const data = { event: { name: 'Huel - Lynch' }, userName: 'The Owner' };
    it('should return object with subject, emailText, attachUnsubscribe and attachUnsubscribeText properties', () => {
      const result = eventWaitlistConfirmation(data);
      expect(result).toHaveProperty('subject');
      expect(result).toHaveProperty('emailText');
      expect(result).toHaveProperty('attachUnsubscribe');
      expect(result).toHaveProperty('attachUnsubscribeText');
    });

    it('should return object with expected subject', () => {
      const expected = { subject: 'Added to waitlist: Huel - Lynch' };
      expect(eventWaitlistConfirmation(data)).toMatchObject(expected);
    });

    it('should return object with expected emailText for Physical & Online event', () => {
      const expected = {
        emailText: `Hi The Owner,<br />
You were added to waitlist for Huel - Lynch.<br />
Once there will be available free spot, you will be moved to attendees. You will receive another email when that happens.`,
      };
      expect(eventWaitlistConfirmation(data)).toMatchObject(expected);
    });
  });

  describe('eventAttendanceRequest', () => {
    const data = { event: { name: 'Huel - Lynch' }, userName: 'The Owner' };
    it('should return object with subject, emailText, attachUnsubscribe and attachUnsubscribeText properties', () => {
      const result = eventAttendanceRequest(data);
      expect(result).toHaveProperty('subject');
      expect(result).toHaveProperty('emailText');
      expect(result).toHaveProperty('attachUnsubscribe');
      expect(result).toHaveProperty('attachUnsubscribeText');
    });

    it('should return object with expected subject', () => {
      const expected = { subject: 'Attendance request: Huel - Lynch' };
      expect(eventAttendanceRequest(data)).toMatchObject(expected);
    });

    it('should return object with expected emailText for Physical & Online event', () => {
      const expected = {
        emailText: `Hi The Owner,<br />
This is confirmation of your request to attend Huel - Lynch. Once event administrator will accept your request, you will receive another email.`,
      };
      expect(eventAttendanceRequest(data)).toMatchObject(expected);
    });
  });
});
