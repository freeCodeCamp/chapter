import { events_venue_type_enum } from '@prisma/client';
import {
  chapterAdminUnsubscribeText,
  chapterUnsubscribeText,
  chapterUserRoleChange,
  dateChangeText,
  eventUnsubscribeText,
  eventListUnsubscribeText,
  instanceUserRoleChange,
  invalidTokenNotification,
  physicalLocationChangeText,
  streamingUrlChangeText,
  venueTypeChangeText,
} from '../src/email-templates';

const url = 'unsubscribe-url';
const streaming_url = 'http://streaming.url/abcd';

describe('email-templates', () => {
  describe('streamingUrlChangeText', () => {
    it('should return url when url is given', () => {
      expect(streamingUrlChangeText({ streaming_url })).toEqual(
        'Streaming URL: http://streaming.url/abcd',
      );
    });
    it('should return TBD when url is not given', () => {
      expect(streamingUrlChangeText({})).toEqual(
        'Streaming URL: Undecided/TBD',
      );
    });
  });

  describe('physicalLocationChangeText', () => {
    const venue = {
      name: 'Borer - Hills',
      street_address: '',
      city: 'East Get',
      region: 'Alaska',
      postal_code: '35389',
      country: 'No',
    };
    const venue_id = 1;
    it('should return venue details when not all details are given', () => {
      const expected = `The event is now being held at <br />
<br />
- Borer - Hills <br />
- East Get <br />
- Alaska <br />
- 35389`;
      expect(physicalLocationChangeText({ venue, venue_id })).toEqual(expected);
    });

    it('should return venue details when all venue details are given', () => {
      const expected = `The event is now being held at <br />
<br />
- Borer - Hills <br />
- 588 Lon Stravenue <br />
- East Get <br />
- Alaska <br />
- 35389`;
      expect(
        physicalLocationChangeText({
          venue: { ...venue, street_address: '588 Lon Stravenue' },
          venue_id,
        }),
      ).toEqual(expected);
    });

    it('should return TBD when venue is not given', () => {
      expect(
        physicalLocationChangeText({ venue: null, venue_id: null }),
      ).toEqual('Location of event is currently Undecided/TBD.');
    });
  });

  describe('dateChangeText', () => {
    it('should return expected text', () => {
      const expected =
        '\n- Start: Thu, Feb 9 @ 15:00 GMT+00:00<br />\n- End: Wed, Feb 15 @ 10:00 GMT+00:00';
      expect(
        dateChangeText({
          ends_at: new Date('2023-02-15 10:00'),
          start_at: new Date('2023-02-09 15:00'),
        }),
      ).toEqual(expected);
    });
  });

  describe('chapterUserRoleChange', () => {
    const data = {
      chapterName: 'Romaguera, Kozey and Swaniawski',
      userName: 'Not the Owner',
      oldChapterRole: 'Role 1',
      newChapterRole: 'Role 2',
    };
    it('should return object with expected subject', () => {
      const expected = {
        subject: 'Role changed in Romaguera, Kozey and Swaniawski',
      };
      expect(chapterUserRoleChange(data)).toMatchObject(expected);
    });

    it('should return object with expected emailText', () => {
      const expected = {
        emailText: `Hi Not the Owner.<br />\nYour role in chapter Romaguera, Kozey and Swaniawski has been changed from Role 1 to Role 2.<br />\n`,
      };
      expect(chapterUserRoleChange(data)).toMatchObject(expected);
    });
  });

  describe('instanceUserRoleChange', () => {
    const data = { name: 'The Owner', newRole: 'HiperOwner' };
    it('should return object with expected subject', () => {
      const expected = { subject: 'Instance role changed' };
      expect(instanceUserRoleChange(data)).toMatchObject(expected);
    });

    it('should return object with expected emailText', () => {
      const expected = {
        emailText:
          'Hello, The Owner.<br />\nYour instance role has been changed to HiperOwner.',
      };
      expect(instanceUserRoleChange(data)).toMatchObject(expected);
    });
  });

  describe('invalidTokenNotification', () => {
    it('should return object with expected subject', () => {
      const expected = { subject: 'Token marked as invalid' };
      expect(invalidTokenNotification()).toMatchObject(expected);
    });
    it('should return object with expected emailText', () => {
      const expected = {
        emailText:
          "One of the calendar actions was unsuccessful due to issues with validity of the saved authentication token. It's required to reauthenticate with calendar api in the Calendar dashboard.",
      };
      expect(invalidTokenNotification()).toMatchObject(expected);
    });
  });

  describe('venueTypeChangeText', () => {
    it.each([
      {
        from: events_venue_type_enum.Online,
        to: events_venue_type_enum.Online,
        expected: null,
        desc: 'null',
      },
      {
        from: events_venue_type_enum.Online,
        to: events_venue_type_enum.Physical,
        expected:
          'Event was online-only, but now it will be in-person only. It will no longer be possible to attend online.',
        desc: 'expected string',
      },
      {
        from: events_venue_type_enum.Online,
        to: events_venue_type_enum.PhysicalAndOnline,
        expected:
          'Event was online-only, but now it will be held also in-person. Online attendees are still welcome.',
        desc: 'expected string',
      },
      {
        from: events_venue_type_enum.Physical,
        to: events_venue_type_enum.Online,
        expected:
          'Event was in-person only, but now it will be online-only. It will no longer be possible to attend in-person.',
        desc: 'expected string',
      },
      {
        from: events_venue_type_enum.Physical,
        to: events_venue_type_enum.Physical,
        expected: null,
        desc: 'null',
      },
      {
        from: events_venue_type_enum.Physical,
        to: events_venue_type_enum.PhysicalAndOnline,
        expected:
          'Event was online-only, but now it will be held also in-person. Online attendees are still welcome.',
        desc: 'expected string',
      },
      {
        from: events_venue_type_enum.PhysicalAndOnline,
        to: events_venue_type_enum.Online,
        expected:
          'Event was being held in-person and online, but now it will be online-only. It will no longer be possible to attend in-person. Online attendees are still welcome.',
        desc: 'expected string',
      },
      {
        from: events_venue_type_enum.PhysicalAndOnline,
        to: events_venue_type_enum.Physical,
        expected:
          'Event was being held in-person and online, but now it will be in-person only. It will no longer be possible to attend online. In-person attendees are still welcome.',
        desc: 'expected string',
      },
      {
        from: events_venue_type_enum.PhysicalAndOnline,
        to: events_venue_type_enum.PhysicalAndOnline,
        expected: null,
        desc: 'null',
      },
    ])(
      'should return $desc when changing venue_type from $from to $to',
      ({ from, to, expected }) => {
        expect(
          venueTypeChangeText({ newVenueType: to, oldVenueType: from }),
        ).toEqual(expected);
      },
    );
  });

  describe('chapterUnsubscribeText', () => {
    it('should return expected text', () => {
      const expected =
        '- To stop receiving notifications about new events in this chapter, <a href="unsubscribe-url">unsubscribe here</a>.';
      expect(chapterUnsubscribeText({ url })).toEqual(expected);
    });
  });

  describe('eventUnsubscribeText', () => {
    it('should return expected text', () => {
      const expected =
        '- To stop receiving notifications about this event, <a href="unsubscribe-url">unsubscribe here</a>.';
      expect(eventUnsubscribeText({ url })).toEqual(expected);
    });
  });

  describe('eventListUnsubscribeText', () => {
    it('should return expected text', () => {
      const expected = '<a href="unsubscribe-url">Cancel attendance</a>.';
      expect(eventListUnsubscribeText({ url })).toEqual(expected);
    });
  });

  describe('chapterAdminUnsubscribeText', () => {
    const expected = `<a href="unsubscribe-url">Unsubscribe from chapter emails</a>`;
    expect(chapterAdminUnsubscribeText({ url })).toEqual(expected);
  });
});
