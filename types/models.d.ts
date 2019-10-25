export enum SponsorType {
  Food = 'FOOD',
  Venue = 'VENUE',
  Other = 'OTHER',
}

export interface IEventSponsor {
  eventId: number;
  sponsorId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISponsor {
  id: number;
  name: string;
  website: string;
  logoPath: string;
  type: SponsorType;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISocialProviderUser {
  id: number;
  providerId: number;
  providerUserId: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISocialProvider {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEvent {
  id: number;
  name: string;
  description: string;
  startsAt: Date;
  endsAt: Date;
  chapterId: number;
  venueId: number;
  tagId: number;
  canceled: boolean;
  capacity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITag {
  id: string;
  name: string;
}

export interface IVenue {
  id: number;
  name: string;
  locationId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILocation {
  id: number;
  countryCode: string;
  city: string;
  region: string;
  postalCode: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  passwordDigest: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserBan {
  userId: number;
  chapterId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IChapter {
  id: number;
  name: string;
  description: string;
  category: string;
  details: string;
  locationId: number;
  creatorId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserChapter {
  userId: number;
  chapterId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRsvp {
  userId: number;
  eventId: number;
  date: Date;
  onWaitlist: boolean;
  createdAt: Date;
  updatedAt: Date;
}
