import { formatDate } from '../src/util/date';

describe('date', () => {
  describe('formatDate', () => {
    it.each([
      ['2022-01-13T00:00:00.000Z', 'Thu, Jan 13 @ 00:00'],
      ['2022-02-04T01:05:00.000Z', 'Fri, Feb 4 @ 01:05'],
      ['2022-03-20T19:55:00.000Z', 'Sun, Mar 20 @ 19:55'],
      ['2022-04-13T10:10:00.000Z', 'Wed, Apr 13 @ 10:10'],
      ['2022-05-31T20:00:00.000Z', 'Tue, May 31 @ 20:00'],
      ['2022-06-01T04:05:00.000Z', 'Wed, Jun 1 @ 04:05'],
      ['2022-07-21T18:01:00.000Z', 'Thu, Jul 21 @ 18:01'],
      ['2022-08-24T14:41:00.000Z', 'Wed, Aug 24 @ 14:41'],
      ['2022-09-03T19:00:00.000Z', 'Sat, Sep 3 @ 19:00'],
      ['2022-10-05T12:00:00.000Z', 'Wed, Oct 5 @ 12:00'],
      ['2022-11-07T13:15:00.000Z', 'Mon, Nov 7 @ 13:15'],
      ['2022-12-15T23:45:00.000Z', 'Thu, Dec 15 @ 23:45'],
    ])(
      'returns formatted date when passing datetime string #%#',
      (date, expected) => {
        expect(formatDate(date)).toBe(expected);
      },
    );
  });
});
