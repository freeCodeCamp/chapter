import { events_venue_type_enum } from '@prisma/client';

import {
  eventAttendanceConfirmation,
  eventCancelationEmail,
  eventConfirmAttendeeEmail,
  eventInviteEmail,
  eventNewAttendeeNotifyEmail,
} from '../src/util/event-email';

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
    const data = 'Emard and Sons';
    it('should return object with subject, emailText, attachUnsubscribe and attachUnsubscribeText properties', () => {
      const result = eventConfirmAttendeeEmail(data);
      expect(result).toHaveProperty('subject');
      expect(result).toHaveProperty('emailText');
      expect(result).toHaveProperty('attachUnsubscribe');
      expect(result).toHaveProperty('attachUnsubscribeText');
    });

    it('should return object with expected subject', () => {
      const expected = { subject: 'Your attendance is confirmed' };
      expect(eventConfirmAttendeeEmail(data)).toMatchObject(expected);
    });

    it('should return object with expected emailText', () => {
      const expected = {
        emailText:
          'Your reservation is confirmed. You can attend the event Emard and Sons',
      };
      expect(eventConfirmAttendeeEmail(data)).toMatchObject(expected);
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
        start_at: new Date('2023-02-07 21:00'),
        ends_at: new Date('2023-02-08, 22:00'),
        description: '',
        venue: { name: 'Nitzsche - Hills' },
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

    // it('should return object with expected subject', () => {

    // });

    // it('should return object with expected emailText', () => {

    // });
  });

  // describe('buildEmailForUpdatedEvent', () => {});
});
