import { isOnline, isPhysical } from '../src/util/venueType';
import { VenueType } from '../src/generated/graphql';

describe('venueType', () => {
  describe('isOnline', () => {
    it.each([
      [VenueType.Online, true],
      [VenueType.Physical, false],
      [VenueType.PhysicalAndOnline, true],
    ])('%s should return %s', (type, expected) => {
      expect(isOnline(type)).toBe(expected);
    });
  });

  describe('isPhysical', () => {
    it.each([
      [VenueType.Online, false],
      [VenueType.Physical, true],
      [VenueType.PhysicalAndOnline, true],
    ])('%s should return %s', (type, expected) => {
      expect(isPhysical(type)).toBe(expected);
    });
  });
});
