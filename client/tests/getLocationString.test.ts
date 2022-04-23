import getLocationString from '../src/util/getLocationString';

const venue = {
  street_address: null,
  city: 'West Laurieburgh',
  postal_code: '06846-9497',
  region: 'Pennsylvania',
  country: 'Bolivia',
};

describe('getLocationString', () => {
  it('returns correct string with region, country and postal-code', () => {
    expect(getLocationString(venue)).toBe('Pennsylvania, Bolivia, 06846-9497');
  });
  it('includes city, when withCity argument is true', () => {
    expect(getLocationString(venue, true)).toBe(
      'Pennsylvania, Bolivia, 06846-9497, West Laurieburgh',
    );
  });
});
