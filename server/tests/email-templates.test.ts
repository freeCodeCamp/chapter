import {
  instanceUserRoleChange,
  invalidTokenNotification,
  physicalLocationChangeText,
  streamingUrlChangeText,
} from '../src/email-templates';

describe('email-templates', () => {
  describe('streamingUrlChangeText', () => {
    it('should return url when url is given', () => {
      const streaming_url = 'http://streaming.url/abcd';
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
    it('should return venue details when venue is given', () => {
      const venue = {
        name: 'Borer - Hills',
        street_address: '588 Lon Stravenue',
        city: 'East Get',
        region: 'Alaska',
        postal_code: '35389',
        country: 'No',
      };
      const venue_id = 1;
      expect(physicalLocationChangeText({ venue, venue_id }))
        .toEqual(`The event is now being held at <br />
<br />
- Borer - Hills <br />
- 588 Lon Stravenue <br />
- East Get <br />
- Alaska <br />
- 35389`);
    });
    it('should return TBD when venue is not given', () => {
      expect(
        physicalLocationChangeText({ venue: null, venue_id: null }),
      ).toEqual('Location of event is currently Undecided/TBD.');
    });
  });

  describe('instanceUserRoleChange', () => {
    const data = { name: 'The Owner', newRole: 'HiperOwner' };
    it('should return object with expected subject', () => {
      const { subject } = instanceUserRoleChange(data);
      expect(subject).toEqual('Instance role changed');
    });

    it('should return object with expected emailText', () => {
      const { emailText } = instanceUserRoleChange(data);
      expect(emailText).toEqual(
        'Hello, The Owner.<br />\nYour instance role has been changed to HiperOwner.',
      );
    });
  });

  describe('invalidTokenNotification', () => {
    it('should return object with expected subject', () => {
      const { subject } = invalidTokenNotification();
      expect(subject).toEqual('Token marked as invalid');
    });
    it('should return object with expected emailText', () => {
      const { emailText } = invalidTokenNotification();
      expect(emailText).toEqual(
        "One of the calendar actions was unsuccessful due to issues with validity of the saved authentication token. It's required to reauthenticate with calendar api in the Calendar dashboard.",
      );
    });
  });
});
