import { VenueType } from '../generated/graphql';

export const isPhysical = (venue_type: VenueType) =>
  venue_type !== VenueType.Online;
export const isOnline = (venue_type: VenueType) =>
  venue_type !== VenueType.Physical;
