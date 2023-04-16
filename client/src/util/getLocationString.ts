import { Venue } from '../generated/graphql';

export type PartialLocation = Pick<
  Venue,
  'street_address' | 'city' | 'postal_code' | 'region' | 'country'
>;

const getLocationString = (
  venue: PartialLocation,
  withCity = false,
): string => {
  const base = `${venue.region}, ${venue.country}, ${venue.postal_code}`;

  if (withCity) {
    return `${base}, ${venue.city}`;
  }

  return base;
};

export default getLocationString;
