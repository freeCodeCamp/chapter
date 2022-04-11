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
    it.each([
      [1642032000000, 'Thu, Jan 13 @ 00:00'],
      [1643936700000, 'Fri, Feb 4 @ 01:05'],
      [1647806100000, 'Sun, Mar 20 @ 19:55'],
      [1649844600000, 'Wed, Apr 13 @ 10:10'],
      [1654027200000, 'Tue, May 31 @ 20:00'],
      [1654056300000, 'Wed, Jun 1 @ 04:05'],
      [1658426460000, 'Thu, Jul 21 @ 18:01'],
      [1661352060000, 'Wed, Aug 24 @ 14:41'],
      [1662231600000, 'Sat, Sep 3 @ 19:00'],
      [1664971200000, 'Wed, Oct 5 @ 12:00'],
      [1667826900000, 'Mon, Nov 7 @ 13:15'],
      [1671147900000, 'Thu, Dec 15 @ 23:45'],
    ])(
      'returns formatted date when passing timestamp in miliseconds #%#',
      (timestamp, expected) => {
        expect(formatDate(timestamp)).toBe(expected);
      },
    );
    it('returns formatted current date when not passing argument', () => {
      jest.useFakeTimers().setSystemTime(new Date('2022-04-08 21:00'));
      expect(formatDate()).toBe('Fri, Apr 8 @ 21:00');
    });
  });
});
