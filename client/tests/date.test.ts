import { formatDate } from '../src/util/date';

describe('date', () => {
  describe('formatDate', () => {
    it.each([
      [new Date('2022-01-13T00:00:00'), 'Thu, Jan 13 @ 00:00'],
      [new Date('2022-02-04T01:05:00'), 'Fri, Feb 4 @ 01:05'],
      [new Date('2022-03-20T19:55:00'), 'Sun, Mar 20 @ 19:55'],
      [new Date('2022-04-13T10:10:00'), 'Wed, Apr 13 @ 10:10'],
      [new Date('2022-05-31T20:00:00'), 'Tue, May 31 @ 20:00'],
      [new Date('2022-06-01T04:05:00'), 'Wed, Jun 1 @ 04:05'],
      [new Date('2022-07-21T18:01:00'), 'Thu, Jul 21 @ 18:01'],
      [new Date('2022-08-24T14:41:00'), 'Wed, Aug 24 @ 14:41'],
      [new Date('2022-09-03T19:00:00'), 'Sat, Sep 3 @ 19:00'],
      [new Date('2022-10-05T12:00:00'), 'Wed, Oct 5 @ 12:00'],
      [new Date('2022-11-07T13:15:00'), 'Mon, Nov 7 @ 13:15'],
      [new Date('2022-12-15T23:45:00'), 'Thu, Dec 15 @ 23:45'],
    ])(
      'returns formatted date when passing datetime string #%#',
      (date, expected) => {
        expect(formatDate(date)).toBe(expected);
      },
    );
  });
});
