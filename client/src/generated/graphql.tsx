import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type AuthenticateType = {
  __typename?: 'AuthenticateType';
  token: Scalars['String'];
  user: User;
};

export type Chapter = {
  __typename?: 'Chapter';
  category: Scalars['String'];
  chatUrl?: Maybe<Scalars['String']>;
  city: Scalars['String'];
  country: Scalars['String'];
  creator_id: Scalars['Int'];
  description: Scalars['String'];
  id: Scalars['Int'];
  imageUrl: Scalars['String'];
  name: Scalars['String'];
  region: Scalars['String'];
};

export type ChapterPermission = {
  __typename?: 'ChapterPermission';
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type ChapterRole = {
  __typename?: 'ChapterRole';
  chapter_role_permissions: Array<ChapterRolePermission>;
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type ChapterRolePermission = {
  __typename?: 'ChapterRolePermission';
  chapter_permission: ChapterPermission;
};

export type ChapterUser = {
  __typename?: 'ChapterUser';
  chapter_id: Scalars['Int'];
  chapter_role: ChapterRole;
  joined_date: Scalars['DateTime'];
  subscribed: Scalars['Boolean'];
  user: User;
  user_id: Scalars['Int'];
};

export type ChapterWithRelations = {
  __typename?: 'ChapterWithRelations';
  category: Scalars['String'];
  chapter_users: Array<ChapterUser>;
  chatUrl?: Maybe<Scalars['String']>;
  city: Scalars['String'];
  country: Scalars['String'];
  creator_id: Scalars['Int'];
  description: Scalars['String'];
  events: Array<Event>;
  id: Scalars['Int'];
  imageUrl: Scalars['String'];
  name: Scalars['String'];
  region: Scalars['String'];
};

export type CreateChapterInputs = {
  category: Scalars['String'];
  chatUrl?: InputMaybe<Scalars['String']>;
  city: Scalars['String'];
  country: Scalars['String'];
  description: Scalars['String'];
  imageUrl: Scalars['String'];
  name: Scalars['String'];
  region: Scalars['String'];
};

export type CreateEventInputs = {
  capacity: Scalars['Float'];
  chapter_id: Scalars['Int'];
  description: Scalars['String'];
  ends_at: Scalars['DateTime'];
  image_url: Scalars['String'];
  invite_only?: InputMaybe<Scalars['Boolean']>;
  name: Scalars['String'];
  sponsor_ids: Array<Scalars['Int']>;
  start_at: Scalars['DateTime'];
  streaming_url?: InputMaybe<Scalars['String']>;
  tags: Array<Scalars['String']>;
  url?: InputMaybe<Scalars['String']>;
  venue_id?: InputMaybe<Scalars['Int']>;
  venue_type?: InputMaybe<VenueType>;
};

export type CreateSponsorInputs = {
  logo_path: Scalars['String'];
  name: Scalars['String'];
  type: Scalars['String'];
  website: Scalars['String'];
};

export type CreateVenueInputs = {
  city: Scalars['String'];
  country: Scalars['String'];
  latitude?: InputMaybe<Scalars['Float']>;
  longitude?: InputMaybe<Scalars['Float']>;
  name: Scalars['String'];
  postal_code: Scalars['String'];
  region: Scalars['String'];
  street_address?: InputMaybe<Scalars['String']>;
};

export type Email = {
  __typename?: 'Email';
  backupText: Scalars['String'];
  emailList: Array<Scalars['String']>;
  htmlEmail: Scalars['String'];
  ourEmail: Scalars['String'];
  subject: Scalars['String'];
};

export type Event = {
  __typename?: 'Event';
  canceled: Scalars['Boolean'];
  capacity: Scalars['Int'];
  description: Scalars['String'];
  ends_at: Scalars['DateTime'];
  id: Scalars['Int'];
  image_url: Scalars['String'];
  invite_only: Scalars['Boolean'];
  name: Scalars['String'];
  start_at: Scalars['DateTime'];
  streaming_url?: Maybe<Scalars['String']>;
  tags: Array<EventTag>;
  url?: Maybe<Scalars['String']>;
  venue_type: VenueType;
};

export type EventPermission = {
  __typename?: 'EventPermission';
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type EventRole = {
  __typename?: 'EventRole';
  event_role_permissions: Array<EventRolePermission>;
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type EventRolePermission = {
  __typename?: 'EventRolePermission';
  event_permission: EventPermission;
};

export type EventSponsor = {
  __typename?: 'EventSponsor';
  sponsor: Sponsor;
};

export type EventTag = {
  __typename?: 'EventTag';
  tag: Tag;
};

export type EventUser = {
  __typename?: 'EventUser';
  event_role: EventRole;
  rsvp: Rsvp;
  subscribed: Scalars['Boolean'];
  updated_at: Scalars['DateTime'];
  user: User;
};

export type EventWithChapter = {
  __typename?: 'EventWithChapter';
  canceled: Scalars['Boolean'];
  capacity: Scalars['Int'];
  chapter: Chapter;
  description: Scalars['String'];
  ends_at: Scalars['DateTime'];
  id: Scalars['Int'];
  image_url: Scalars['String'];
  invite_only: Scalars['Boolean'];
  name: Scalars['String'];
  start_at: Scalars['DateTime'];
  streaming_url?: Maybe<Scalars['String']>;
  tags: Array<EventTag>;
  url?: Maybe<Scalars['String']>;
  venue_type: VenueType;
};

export type EventWithRelations = {
  __typename?: 'EventWithRelations';
  canceled: Scalars['Boolean'];
  capacity: Scalars['Int'];
  chapter: Chapter;
  description: Scalars['String'];
  ends_at: Scalars['DateTime'];
  event_users: Array<EventUser>;
  id: Scalars['Int'];
  image_url: Scalars['String'];
  invite_only: Scalars['Boolean'];
  name: Scalars['String'];
  sponsors: Array<EventSponsor>;
  start_at: Scalars['DateTime'];
  streaming_url?: Maybe<Scalars['String']>;
  tags: Array<EventTag>;
  url?: Maybe<Scalars['String']>;
  venue?: Maybe<Venue>;
  venue_type: VenueType;
};

export type LoginInput = {
  email: Scalars['String'];
};

export type LoginType = {
  __typename?: 'LoginType';
  code: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  authenticate: AuthenticateType;
  cancelEvent: Event;
  changeChapterUserRole: ChapterUser;
  changeEventUserRole: EventUser;
  confirmRsvp: EventUser;
  createChapter: Chapter;
  createEvent: Event;
  createSponsor: Sponsor;
  createVenue: Venue;
  deleteChapter: Chapter;
  deleteEvent: Event;
  deleteRsvp: Scalars['Boolean'];
  deleteVenue: Scalars['Boolean'];
  initUserInterestForChapter: Scalars['Boolean'];
  joinChapter: ChapterUser;
  login: LoginType;
  register: User;
  rsvpEvent?: Maybe<EventUser>;
  sendEmail: Email;
  sendEventInvite: Scalars['Boolean'];
  subscribeToEvent: EventUser;
  toggleChapterSubscription: ChapterUser;
  unsubscribeFromEvent: EventUser;
  updateChapter: Chapter;
  updateEvent: Event;
  updateSponsor: Sponsor;
  updateVenue: Venue;
};

export type MutationAuthenticateArgs = {
  token: Scalars['String'];
};

export type MutationCancelEventArgs = {
  id: Scalars['Int'];
};

export type MutationChangeChapterUserRoleArgs = {
  chapterId: Scalars['Int'];
  roleId: Scalars['Int'];
  userId: Scalars['Int'];
};

export type MutationChangeEventUserRoleArgs = {
  eventId: Scalars['Int'];
  roleId: Scalars['Int'];
  userId: Scalars['Int'];
};

export type MutationConfirmRsvpArgs = {
  eventId: Scalars['Int'];
  userId: Scalars['Int'];
};

export type MutationCreateChapterArgs = {
  data: CreateChapterInputs;
};

export type MutationCreateEventArgs = {
  data: CreateEventInputs;
};

export type MutationCreateSponsorArgs = {
  data: CreateSponsorInputs;
};

export type MutationCreateVenueArgs = {
  data: CreateVenueInputs;
};

export type MutationDeleteChapterArgs = {
  id: Scalars['Int'];
};

export type MutationDeleteEventArgs = {
  id: Scalars['Int'];
};

export type MutationDeleteRsvpArgs = {
  eventId: Scalars['Int'];
  userId: Scalars['Int'];
};

export type MutationDeleteVenueArgs = {
  id: Scalars['Int'];
};

export type MutationInitUserInterestForChapterArgs = {
  event_id: Scalars['Int'];
};

export type MutationJoinChapterArgs = {
  chapterId: Scalars['Int'];
};

export type MutationLoginArgs = {
  data: LoginInput;
};

export type MutationRegisterArgs = {
  data: RegisterInput;
};

export type MutationRsvpEventArgs = {
  eventId: Scalars['Int'];
};

export type MutationSendEmailArgs = {
  data: SendEmailInputs;
};

export type MutationSendEventInviteArgs = {
  emailGroups?: InputMaybe<Array<Scalars['String']>>;
  id: Scalars['Int'];
};

export type MutationSubscribeToEventArgs = {
  eventId: Scalars['Int'];
};

export type MutationToggleChapterSubscriptionArgs = {
  chapterId: Scalars['Int'];
};

export type MutationUnsubscribeFromEventArgs = {
  eventId: Scalars['Int'];
};

export type MutationUpdateChapterArgs = {
  data: UpdateChapterInputs;
  id: Scalars['Int'];
};

export type MutationUpdateEventArgs = {
  data: UpdateEventInputs;
  id: Scalars['Int'];
};

export type MutationUpdateSponsorArgs = {
  data: UpdateSponsorInputs;
  id: Scalars['Int'];
};

export type MutationUpdateVenueArgs = {
  data: UpdateVenueInputs;
  id: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  chapter?: Maybe<ChapterWithRelations>;
  chapterRoles: Array<ChapterRole>;
  chapterUser: ChapterUser;
  chapters: Array<Chapter>;
  event?: Maybe<EventWithRelations>;
  eventRoles: Array<EventRole>;
  events: Array<EventWithRelations>;
  me?: Maybe<User>;
  paginatedEvents: Array<EventWithChapter>;
  sponsor?: Maybe<Sponsor>;
  sponsors: Array<Sponsor>;
  venue?: Maybe<Venue>;
  venues: Array<Venue>;
};

export type QueryChapterArgs = {
  id: Scalars['Int'];
};

export type QueryChapterUserArgs = {
  chapterId: Scalars['Int'];
};

export type QueryEventArgs = {
  id: Scalars['Int'];
};

export type QueryEventsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  showAll?: InputMaybe<Scalars['Boolean']>;
};

export type QueryPaginatedEventsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export type QuerySponsorArgs = {
  id: Scalars['Int'];
};

export type QueryVenueArgs = {
  id: Scalars['Int'];
};

export type RegisterInput = {
  email: Scalars['String'];
  first_name: Scalars['String'];
  last_name: Scalars['String'];
};

export type Rsvp = {
  __typename?: 'Rsvp';
  id: Scalars['Int'];
  name: Scalars['String'];
  updated_at: Scalars['DateTime'];
};

export type SendEmailInputs = {
  html: Scalars['String'];
  subject: Scalars['String'];
  to: Array<Scalars['String']>;
};

export type Sponsor = {
  __typename?: 'Sponsor';
  id: Scalars['Int'];
  logo_path: Scalars['String'];
  name: Scalars['String'];
  type: Scalars['String'];
  website: Scalars['String'];
};

export type Tag = {
  __typename?: 'Tag';
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type UpdateChapterInputs = {
  category?: InputMaybe<Scalars['String']>;
  chatUrl?: InputMaybe<Scalars['String']>;
  city?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  imageUrl?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  region?: InputMaybe<Scalars['String']>;
};

export type UpdateEventInputs = {
  capacity?: InputMaybe<Scalars['Float']>;
  chapter_id: Scalars['Int'];
  description?: InputMaybe<Scalars['String']>;
  ends_at?: InputMaybe<Scalars['DateTime']>;
  image_url?: InputMaybe<Scalars['String']>;
  invite_only?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  sponsor_ids: Array<Scalars['Int']>;
  start_at?: InputMaybe<Scalars['DateTime']>;
  streaming_url?: InputMaybe<Scalars['String']>;
  tags: Array<Scalars['String']>;
  url?: InputMaybe<Scalars['String']>;
  venue_id?: InputMaybe<Scalars['Int']>;
  venue_type?: InputMaybe<VenueType>;
};

export type UpdateSponsorInputs = {
  logo_path: Scalars['String'];
  name: Scalars['String'];
  type: Scalars['String'];
  website: Scalars['String'];
};

export type UpdateVenueInputs = {
  city?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  latitude?: InputMaybe<Scalars['Float']>;
  longitude?: InputMaybe<Scalars['Float']>;
  name?: InputMaybe<Scalars['String']>;
  postal_code?: InputMaybe<Scalars['String']>;
  region?: InputMaybe<Scalars['String']>;
  street_address?: InputMaybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  email: Scalars['String'];
  first_name: Scalars['String'];
  id: Scalars['Int'];
  last_name: Scalars['String'];
  name: Scalars['String'];
};

export type Venue = {
  __typename?: 'Venue';
  city: Scalars['String'];
  country: Scalars['String'];
  id: Scalars['Int'];
  latitude?: Maybe<Scalars['Float']>;
  longitude?: Maybe<Scalars['Float']>;
  name: Scalars['String'];
  postal_code: Scalars['String'];
  region: Scalars['String'];
  street_address?: Maybe<Scalars['String']>;
};

/** All possible venue types for an event */
export enum VenueType {
  Online = 'Online',
  Physical = 'Physical',
  PhysicalAndOnline = 'PhysicalAndOnline',
}

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
}>;

export type LoginMutation = {
  __typename?: 'Mutation';
  login: { __typename?: 'LoginType'; code: string };
};

export type RegisterMutationVariables = Exact<{
  email: Scalars['String'];
  first_name: Scalars['String'];
  last_name: Scalars['String'];
}>;

export type RegisterMutation = {
  __typename?: 'Mutation';
  register: { __typename?: 'User'; id: number };
};

export type AuthenticateMutationVariables = Exact<{
  token: Scalars['String'];
}>;

export type AuthenticateMutation = {
  __typename?: 'Mutation';
  authenticate: {
    __typename?: 'AuthenticateType';
    token: string;
    user: {
      __typename?: 'User';
      id: number;
      first_name: string;
      last_name: string;
    };
  };
};

export type MeQueryVariables = Exact<{ [key: string]: never }>;

export type MeQuery = {
  __typename?: 'Query';
  me?: {
    __typename?: 'User';
    id: number;
    first_name: string;
    last_name: string;
  } | null;
};

export type JoinChapterMutationVariables = Exact<{
  chapterId: Scalars['Int'];
}>;

export type JoinChapterMutation = {
  __typename?: 'Mutation';
  joinChapter: {
    __typename?: 'ChapterUser';
    chapter_role: { __typename?: 'ChapterRole'; name: string };
  };
};

export type ToggleChapterSubscriptionMutationVariables = Exact<{
  chapterId: Scalars['Int'];
}>;

export type ToggleChapterSubscriptionMutation = {
  __typename?: 'Mutation';
  toggleChapterSubscription: {
    __typename?: 'ChapterUser';
    subscribed: boolean;
  };
};

export type ChapterQueryVariables = Exact<{
  id: Scalars['Int'];
}>;

export type ChapterQuery = {
  __typename?: 'Query';
  chapter?: {
    __typename?: 'ChapterWithRelations';
    id: number;
    name: string;
    description: string;
    category: string;
    city: string;
    region: string;
    country: string;
    imageUrl: string;
    chatUrl?: string | null;
    events: Array<{
      __typename?: 'Event';
      id: number;
      name: string;
      description: string;
      start_at: any;
      invite_only: boolean;
      canceled: boolean;
      image_url: string;
      tags: Array<{
        __typename?: 'EventTag';
        tag: { __typename?: 'Tag'; id: number; name: string };
      }>;
    }>;
  } | null;
};

export type ChapterUsersQueryVariables = Exact<{
  id: Scalars['Int'];
}>;

export type ChapterUsersQuery = {
  __typename?: 'Query';
  chapter?: {
    __typename?: 'ChapterWithRelations';
    chapter_users: Array<{
      __typename?: 'ChapterUser';
      subscribed: boolean;
      user: { __typename?: 'User'; id: number; name: string; email: string };
      chapter_role: { __typename?: 'ChapterRole'; id: number; name: string };
    }>;
  } | null;
};

export type ChapterUserQueryVariables = Exact<{
  chapterId: Scalars['Int'];
}>;

export type ChapterUserQuery = {
  __typename?: 'Query';
  chapterUser: {
    __typename?: 'ChapterUser';
    subscribed: boolean;
    user: { __typename?: 'User'; name: string };
    chapter_role: { __typename?: 'ChapterRole'; name: string };
  };
};

export type ChaptersQueryVariables = Exact<{ [key: string]: never }>;

export type ChaptersQuery = {
  __typename?: 'Query';
  chapters: Array<{
    __typename?: 'Chapter';
    id: number;
    name: string;
    description: string;
    category: string;
    imageUrl: string;
  }>;
};

export type CreateChapterMutationVariables = Exact<{
  data: CreateChapterInputs;
}>;

export type CreateChapterMutation = {
  __typename?: 'Mutation';
  createChapter: {
    __typename?: 'Chapter';
    id: number;
    name: string;
    description: string;
    city: string;
    region: string;
    country: string;
    chatUrl?: string | null;
  };
};

export type UpdateChapterMutationVariables = Exact<{
  id: Scalars['Int'];
  data: UpdateChapterInputs;
}>;

export type UpdateChapterMutation = {
  __typename?: 'Mutation';
  updateChapter: {
    __typename?: 'Chapter';
    id: number;
    name: string;
    description: string;
    city: string;
    region: string;
    country: string;
    chatUrl?: string | null;
  };
};

export type ChangeChapterUserRoleMutationVariables = Exact<{
  chapterId: Scalars['Int'];
  roleId: Scalars['Int'];
  userId: Scalars['Int'];
}>;

export type ChangeChapterUserRoleMutation = {
  __typename?: 'Mutation';
  changeChapterUserRole: {
    __typename?: 'ChapterUser';
    chapter_role: { __typename?: 'ChapterRole'; id: number };
  };
};

export type ChapterRolesQueryVariables = Exact<{ [key: string]: never }>;

export type ChapterRolesQuery = {
  __typename?: 'Query';
  chapterRoles: Array<{ __typename?: 'ChapterRole'; id: number; name: string }>;
};

export type CreateEventMutationVariables = Exact<{
  data: CreateEventInputs;
}>;

export type CreateEventMutation = {
  __typename?: 'Mutation';
  createEvent: {
    __typename?: 'Event';
    id: number;
    name: string;
    canceled: boolean;
    description: string;
    url?: string | null;
    streaming_url?: string | null;
    capacity: number;
    tags: Array<{
      __typename?: 'EventTag';
      tag: { __typename?: 'Tag'; id: number; name: string };
    }>;
  };
};

export type UpdateEventMutationVariables = Exact<{
  id: Scalars['Int'];
  data: UpdateEventInputs;
}>;

export type UpdateEventMutation = {
  __typename?: 'Mutation';
  updateEvent: {
    __typename?: 'Event';
    id: number;
    name: string;
    canceled: boolean;
    description: string;
    url?: string | null;
    streaming_url?: string | null;
    capacity: number;
    tags: Array<{
      __typename?: 'EventTag';
      tag: { __typename?: 'Tag'; id: number; name: string };
    }>;
  };
};

export type CancelEventMutationVariables = Exact<{
  id: Scalars['Int'];
}>;

export type CancelEventMutation = {
  __typename?: 'Mutation';
  cancelEvent: { __typename?: 'Event'; id: number; canceled: boolean };
};

export type DeleteEventMutationVariables = Exact<{
  id: Scalars['Int'];
}>;

export type DeleteEventMutation = {
  __typename?: 'Mutation';
  deleteEvent: { __typename?: 'Event'; id: number };
};

export type ConfirmRsvpMutationVariables = Exact<{
  eventId: Scalars['Int'];
  userId: Scalars['Int'];
}>;

export type ConfirmRsvpMutation = {
  __typename?: 'Mutation';
  confirmRsvp: {
    __typename?: 'EventUser';
    rsvp: { __typename?: 'Rsvp'; updated_at: any; name: string };
  };
};

export type DeleteRsvpMutationVariables = Exact<{
  eventId: Scalars['Int'];
  userId: Scalars['Int'];
}>;

export type DeleteRsvpMutation = {
  __typename?: 'Mutation';
  deleteRsvp: boolean;
};

export type SendEventInviteMutationVariables = Exact<{
  id: Scalars['Int'];
  emailGroups?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
}>;

export type SendEventInviteMutation = {
  __typename?: 'Mutation';
  sendEventInvite: boolean;
};

export type InitUserInterestForChapterMutationVariables = Exact<{
  event_id: Scalars['Int'];
}>;

export type InitUserInterestForChapterMutation = {
  __typename?: 'Mutation';
  initUserInterestForChapter: boolean;
};

export type ChangeEventUserRoleMutationVariables = Exact<{
  eventId: Scalars['Int'];
  roleId: Scalars['Int'];
  userId: Scalars['Int'];
}>;

export type ChangeEventUserRoleMutation = {
  __typename?: 'Mutation';
  changeEventUserRole: {
    __typename?: 'EventUser';
    event_role: { __typename?: 'EventRole'; id: number };
  };
};

export type EventsQueryVariables = Exact<{ [key: string]: never }>;

export type EventsQuery = {
  __typename?: 'Query';
  events: Array<{
    __typename?: 'EventWithRelations';
    id: number;
    name: string;
    canceled: boolean;
    description: string;
    url?: string | null;
    invite_only: boolean;
    streaming_url?: string | null;
    start_at: any;
    capacity: number;
    venue_type: VenueType;
    venue?: { __typename?: 'Venue'; id: number; name: string } | null;
    tags: Array<{
      __typename?: 'EventTag';
      tag: { __typename?: 'Tag'; id: number; name: string };
    }>;
  }>;
};

export type EventQueryVariables = Exact<{
  id: Scalars['Int'];
}>;

export type EventQuery = {
  __typename?: 'Query';
  event?: {
    __typename?: 'EventWithRelations';
    id: number;
    name: string;
    description: string;
    url?: string | null;
    invite_only: boolean;
    streaming_url?: string | null;
    canceled: boolean;
    capacity: number;
    start_at: any;
    ends_at: any;
    image_url: string;
    venue_type: VenueType;
    chapter: { __typename?: 'Chapter'; id: number; name: string };
    tags: Array<{
      __typename?: 'EventTag';
      tag: { __typename?: 'Tag'; id: number; name: string };
    }>;
    sponsors: Array<{
      __typename?: 'EventSponsor';
      sponsor: {
        __typename?: 'Sponsor';
        name: string;
        website: string;
        logo_path: string;
        type: string;
        id: number;
      };
    }>;
    venue?: {
      __typename?: 'Venue';
      id: number;
      name: string;
      street_address?: string | null;
      city: string;
      postal_code: string;
      region: string;
      country: string;
    } | null;
    event_users: Array<{
      __typename?: 'EventUser';
      subscribed: boolean;
      rsvp: { __typename?: 'Rsvp'; name: string };
      user: { __typename?: 'User'; id: number; name: string };
      event_role: {
        __typename?: 'EventRole';
        id: number;
        name: string;
        event_role_permissions: Array<{
          __typename?: 'EventRolePermission';
          event_permission: { __typename?: 'EventPermission'; name: string };
        }>;
      };
    }>;
  } | null;
};

export type EventVenuesQueryVariables = Exact<{
  id: Scalars['Int'];
}>;

export type EventVenuesQuery = {
  __typename?: 'Query';
  event?: {
    __typename?: 'EventWithRelations';
    id: number;
    name: string;
    description: string;
    url?: string | null;
    streaming_url?: string | null;
    capacity: number;
    start_at: any;
    ends_at: any;
    tags: Array<{
      __typename?: 'EventTag';
      tag: { __typename?: 'Tag'; id: number; name: string };
    }>;
    venue?: { __typename?: 'Venue'; id: number } | null;
  } | null;
  venues: Array<{ __typename?: 'Venue'; id: number; name: string }>;
};

export type SponsorsQueryVariables = Exact<{ [key: string]: never }>;

export type SponsorsQuery = {
  __typename?: 'Query';
  sponsors: Array<{
    __typename?: 'Sponsor';
    id: number;
    name: string;
    website: string;
    logo_path: string;
    type: string;
  }>;
};

export type EventRolesQueryVariables = Exact<{ [key: string]: never }>;

export type EventRolesQuery = {
  __typename?: 'Query';
  eventRoles: Array<{ __typename?: 'EventRole'; id: number; name: string }>;
};

export type CreateSponsorMutationVariables = Exact<{
  data: CreateSponsorInputs;
}>;

export type CreateSponsorMutation = {
  __typename?: 'Mutation';
  createSponsor: {
    __typename?: 'Sponsor';
    name: string;
    website: string;
    logo_path: string;
    type: string;
  };
};

export type UpdateSponsorMutationVariables = Exact<{
  data: UpdateSponsorInputs;
  updateSponsorId: Scalars['Int'];
}>;

export type UpdateSponsorMutation = {
  __typename?: 'Mutation';
  updateSponsor: {
    __typename?: 'Sponsor';
    name: string;
    website: string;
    logo_path: string;
    type: string;
  };
};

export type SponsorQueryVariables = Exact<{
  sponsorId: Scalars['Int'];
}>;

export type SponsorQuery = {
  __typename?: 'Query';
  sponsor?: {
    __typename?: 'Sponsor';
    id: number;
    name: string;
    website: string;
    logo_path: string;
    type: string;
  } | null;
};

export type CreateVenueMutationVariables = Exact<{
  data: CreateVenueInputs;
}>;

export type CreateVenueMutation = {
  __typename?: 'Mutation';
  createVenue: {
    __typename?: 'Venue';
    id: number;
    name: string;
    street_address?: string | null;
    city: string;
    postal_code: string;
    region: string;
    country: string;
    latitude?: number | null;
    longitude?: number | null;
  };
};

export type UpdateVenueMutationVariables = Exact<{
  id: Scalars['Int'];
  data: UpdateVenueInputs;
}>;

export type UpdateVenueMutation = {
  __typename?: 'Mutation';
  updateVenue: {
    __typename?: 'Venue';
    id: number;
    name: string;
    street_address?: string | null;
    city: string;
    postal_code: string;
    region: string;
    country: string;
    latitude?: number | null;
    longitude?: number | null;
  };
};

export type VenuesQueryVariables = Exact<{ [key: string]: never }>;

export type VenuesQuery = {
  __typename?: 'Query';
  venues: Array<{
    __typename?: 'Venue';
    id: number;
    name: string;
    street_address?: string | null;
    city: string;
    postal_code: string;
    region: string;
    country: string;
    latitude?: number | null;
    longitude?: number | null;
  }>;
};

export type VenueQueryVariables = Exact<{
  id: Scalars['Int'];
}>;

export type VenueQuery = {
  __typename?: 'Query';
  venue?: {
    __typename?: 'Venue';
    id: number;
    name: string;
    street_address?: string | null;
    city: string;
    postal_code: string;
    region: string;
    country: string;
    latitude?: number | null;
    longitude?: number | null;
  } | null;
};

export type RsvpToEventMutationVariables = Exact<{
  eventId: Scalars['Int'];
}>;

export type RsvpToEventMutation = {
  __typename?: 'Mutation';
  rsvpEvent?: { __typename?: 'EventUser'; updated_at: any } | null;
};

export type SubscribeToEventMutationVariables = Exact<{
  eventId: Scalars['Int'];
}>;

export type SubscribeToEventMutation = {
  __typename?: 'Mutation';
  subscribeToEvent: { __typename?: 'EventUser'; subscribed: boolean };
};

export type UnsubscribeFromEventMutationVariables = Exact<{
  eventId: Scalars['Int'];
}>;

export type UnsubscribeFromEventMutation = {
  __typename?: 'Mutation';
  unsubscribeFromEvent: { __typename?: 'EventUser'; subscribed: boolean };
};

export type MinEventsQueryVariables = Exact<{ [key: string]: never }>;

export type MinEventsQuery = {
  __typename?: 'Query';
  events: Array<{
    __typename?: 'EventWithRelations';
    id: number;
    name: string;
    description: string;
    start_at: any;
    invite_only: boolean;
    canceled: boolean;
    image_url: string;
    tags: Array<{
      __typename?: 'EventTag';
      tag: { __typename?: 'Tag'; id: number; name: string };
    }>;
    chapter: {
      __typename?: 'Chapter';
      id: number;
      name: string;
      category: string;
    };
  }>;
};

export type HomeQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
}>;

export type HomeQuery = {
  __typename?: 'Query';
  paginatedEvents: Array<{
    __typename?: 'EventWithChapter';
    id: number;
    name: string;
    description: string;
    invite_only: boolean;
    canceled: boolean;
    start_at: any;
    image_url: string;
    tags: Array<{
      __typename?: 'EventTag';
      tag: { __typename?: 'Tag'; id: number; name: string };
    }>;
    chapter: {
      __typename?: 'Chapter';
      id: number;
      name: string;
      category: string;
    };
  }>;
  chapters: Array<{
    __typename?: 'Chapter';
    id: number;
    name: string;
    description: string;
    category: string;
    imageUrl: string;
  }>;
};

export const LoginDocument = gql`
  mutation login($email: String!) {
    login(data: { email: $email }) {
      code
    }
  }
`;
export type LoginMutationFn = Apollo.MutationFunction<
  LoginMutation,
  LoginMutationVariables
>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useLoginMutation(
  baseOptions?: Apollo.MutationHookOptions<
    LoginMutation,
    LoginMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<LoginMutation, LoginMutationVariables>(
    LoginDocument,
    options,
  );
}
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<
  LoginMutation,
  LoginMutationVariables
>;
export const RegisterDocument = gql`
  mutation register(
    $email: String!
    $first_name: String!
    $last_name: String!
  ) {
    register(
      data: { email: $email, first_name: $first_name, last_name: $last_name }
    ) {
      id
    }
  }
`;
export type RegisterMutationFn = Apollo.MutationFunction<
  RegisterMutation,
  RegisterMutationVariables
>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      email: // value for 'email'
 *      first_name: // value for 'first_name'
 *      last_name: // value for 'last_name'
 *   },
 * });
 */
export function useRegisterMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RegisterMutation,
    RegisterMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(
    RegisterDocument,
    options,
  );
}
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<
  RegisterMutation,
  RegisterMutationVariables
>;
export const AuthenticateDocument = gql`
  mutation authenticate($token: String!) {
    authenticate(token: $token) {
      token
      user {
        id
        first_name
        last_name
      }
    }
  }
`;
export type AuthenticateMutationFn = Apollo.MutationFunction<
  AuthenticateMutation,
  AuthenticateMutationVariables
>;

/**
 * __useAuthenticateMutation__
 *
 * To run a mutation, you first call `useAuthenticateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAuthenticateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [authenticateMutation, { data, loading, error }] = useAuthenticateMutation({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useAuthenticateMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AuthenticateMutation,
    AuthenticateMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    AuthenticateMutation,
    AuthenticateMutationVariables
  >(AuthenticateDocument, options);
}
export type AuthenticateMutationHookResult = ReturnType<
  typeof useAuthenticateMutation
>;
export type AuthenticateMutationResult =
  Apollo.MutationResult<AuthenticateMutation>;
export type AuthenticateMutationOptions = Apollo.BaseMutationOptions<
  AuthenticateMutation,
  AuthenticateMutationVariables
>;
export const MeDocument = gql`
  query me {
    me {
      id
      first_name
      last_name
    }
  }
`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(
  baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
}
export function useMeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
}
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const JoinChapterDocument = gql`
  mutation joinChapter($chapterId: Int!) {
    joinChapter(chapterId: $chapterId) {
      chapter_role {
        name
      }
    }
  }
`;
export type JoinChapterMutationFn = Apollo.MutationFunction<
  JoinChapterMutation,
  JoinChapterMutationVariables
>;

/**
 * __useJoinChapterMutation__
 *
 * To run a mutation, you first call `useJoinChapterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useJoinChapterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [joinChapterMutation, { data, loading, error }] = useJoinChapterMutation({
 *   variables: {
 *      chapterId: // value for 'chapterId'
 *   },
 * });
 */
export function useJoinChapterMutation(
  baseOptions?: Apollo.MutationHookOptions<
    JoinChapterMutation,
    JoinChapterMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<JoinChapterMutation, JoinChapterMutationVariables>(
    JoinChapterDocument,
    options,
  );
}
export type JoinChapterMutationHookResult = ReturnType<
  typeof useJoinChapterMutation
>;
export type JoinChapterMutationResult =
  Apollo.MutationResult<JoinChapterMutation>;
export type JoinChapterMutationOptions = Apollo.BaseMutationOptions<
  JoinChapterMutation,
  JoinChapterMutationVariables
>;
export const ToggleChapterSubscriptionDocument = gql`
  mutation toggleChapterSubscription($chapterId: Int!) {
    toggleChapterSubscription(chapterId: $chapterId) {
      subscribed
    }
  }
`;
export type ToggleChapterSubscriptionMutationFn = Apollo.MutationFunction<
  ToggleChapterSubscriptionMutation,
  ToggleChapterSubscriptionMutationVariables
>;

/**
 * __useToggleChapterSubscriptionMutation__
 *
 * To run a mutation, you first call `useToggleChapterSubscriptionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleChapterSubscriptionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleChapterSubscriptionMutation, { data, loading, error }] = useToggleChapterSubscriptionMutation({
 *   variables: {
 *      chapterId: // value for 'chapterId'
 *   },
 * });
 */
export function useToggleChapterSubscriptionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ToggleChapterSubscriptionMutation,
    ToggleChapterSubscriptionMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    ToggleChapterSubscriptionMutation,
    ToggleChapterSubscriptionMutationVariables
  >(ToggleChapterSubscriptionDocument, options);
}
export type ToggleChapterSubscriptionMutationHookResult = ReturnType<
  typeof useToggleChapterSubscriptionMutation
>;
export type ToggleChapterSubscriptionMutationResult =
  Apollo.MutationResult<ToggleChapterSubscriptionMutation>;
export type ToggleChapterSubscriptionMutationOptions =
  Apollo.BaseMutationOptions<
    ToggleChapterSubscriptionMutation,
    ToggleChapterSubscriptionMutationVariables
  >;
export const ChapterDocument = gql`
  query chapter($id: Int!) {
    chapter(id: $id) {
      id
      name
      description
      category
      city
      region
      country
      imageUrl
      chatUrl
      events {
        id
        name
        description
        start_at
        invite_only
        canceled
        image_url
        tags {
          tag {
            id
            name
          }
        }
        invite_only
        canceled
      }
    }
  }
`;

/**
 * __useChapterQuery__
 *
 * To run a query within a React component, call `useChapterQuery` and pass it any options that fit your needs.
 * When your component renders, `useChapterQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChapterQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useChapterQuery(
  baseOptions: Apollo.QueryHookOptions<ChapterQuery, ChapterQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ChapterQuery, ChapterQueryVariables>(
    ChapterDocument,
    options,
  );
}
export function useChapterLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ChapterQuery,
    ChapterQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ChapterQuery, ChapterQueryVariables>(
    ChapterDocument,
    options,
  );
}
export type ChapterQueryHookResult = ReturnType<typeof useChapterQuery>;
export type ChapterLazyQueryHookResult = ReturnType<typeof useChapterLazyQuery>;
export type ChapterQueryResult = Apollo.QueryResult<
  ChapterQuery,
  ChapterQueryVariables
>;
export const ChapterUsersDocument = gql`
  query chapterUsers($id: Int!) {
    chapter(id: $id) {
      chapter_users {
        user {
          id
          name
          email
        }
        chapter_role {
          id
          name
        }
        subscribed
      }
    }
  }
`;

/**
 * __useChapterUsersQuery__
 *
 * To run a query within a React component, call `useChapterUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useChapterUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChapterUsersQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useChapterUsersQuery(
  baseOptions: Apollo.QueryHookOptions<
    ChapterUsersQuery,
    ChapterUsersQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ChapterUsersQuery, ChapterUsersQueryVariables>(
    ChapterUsersDocument,
    options,
  );
}
export function useChapterUsersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ChapterUsersQuery,
    ChapterUsersQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ChapterUsersQuery, ChapterUsersQueryVariables>(
    ChapterUsersDocument,
    options,
  );
}
export type ChapterUsersQueryHookResult = ReturnType<
  typeof useChapterUsersQuery
>;
export type ChapterUsersLazyQueryHookResult = ReturnType<
  typeof useChapterUsersLazyQuery
>;
export type ChapterUsersQueryResult = Apollo.QueryResult<
  ChapterUsersQuery,
  ChapterUsersQueryVariables
>;
export const ChapterUserDocument = gql`
  query chapterUser($chapterId: Int!) {
    chapterUser(chapterId: $chapterId) {
      user {
        name
      }
      chapter_role {
        name
      }
      subscribed
    }
  }
`;

/**
 * __useChapterUserQuery__
 *
 * To run a query within a React component, call `useChapterUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useChapterUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChapterUserQuery({
 *   variables: {
 *      chapterId: // value for 'chapterId'
 *   },
 * });
 */
export function useChapterUserQuery(
  baseOptions: Apollo.QueryHookOptions<
    ChapterUserQuery,
    ChapterUserQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ChapterUserQuery, ChapterUserQueryVariables>(
    ChapterUserDocument,
    options,
  );
}
export function useChapterUserLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ChapterUserQuery,
    ChapterUserQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ChapterUserQuery, ChapterUserQueryVariables>(
    ChapterUserDocument,
    options,
  );
}
export type ChapterUserQueryHookResult = ReturnType<typeof useChapterUserQuery>;
export type ChapterUserLazyQueryHookResult = ReturnType<
  typeof useChapterUserLazyQuery
>;
export type ChapterUserQueryResult = Apollo.QueryResult<
  ChapterUserQuery,
  ChapterUserQueryVariables
>;
export const ChaptersDocument = gql`
  query chapters {
    chapters {
      id
      name
      description
      category
      imageUrl
    }
  }
`;

/**
 * __useChaptersQuery__
 *
 * To run a query within a React component, call `useChaptersQuery` and pass it any options that fit your needs.
 * When your component renders, `useChaptersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChaptersQuery({
 *   variables: {
 *   },
 * });
 */
export function useChaptersQuery(
  baseOptions?: Apollo.QueryHookOptions<ChaptersQuery, ChaptersQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ChaptersQuery, ChaptersQueryVariables>(
    ChaptersDocument,
    options,
  );
}
export function useChaptersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ChaptersQuery,
    ChaptersQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ChaptersQuery, ChaptersQueryVariables>(
    ChaptersDocument,
    options,
  );
}
export type ChaptersQueryHookResult = ReturnType<typeof useChaptersQuery>;
export type ChaptersLazyQueryHookResult = ReturnType<
  typeof useChaptersLazyQuery
>;
export type ChaptersQueryResult = Apollo.QueryResult<
  ChaptersQuery,
  ChaptersQueryVariables
>;
export const CreateChapterDocument = gql`
  mutation createChapter($data: CreateChapterInputs!) {
    createChapter(data: $data) {
      id
      name
      description
      city
      region
      country
      chatUrl
    }
  }
`;
export type CreateChapterMutationFn = Apollo.MutationFunction<
  CreateChapterMutation,
  CreateChapterMutationVariables
>;

/**
 * __useCreateChapterMutation__
 *
 * To run a mutation, you first call `useCreateChapterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateChapterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createChapterMutation, { data, loading, error }] = useCreateChapterMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateChapterMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateChapterMutation,
    CreateChapterMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateChapterMutation,
    CreateChapterMutationVariables
  >(CreateChapterDocument, options);
}
export type CreateChapterMutationHookResult = ReturnType<
  typeof useCreateChapterMutation
>;
export type CreateChapterMutationResult =
  Apollo.MutationResult<CreateChapterMutation>;
export type CreateChapterMutationOptions = Apollo.BaseMutationOptions<
  CreateChapterMutation,
  CreateChapterMutationVariables
>;
export const UpdateChapterDocument = gql`
  mutation updateChapter($id: Int!, $data: UpdateChapterInputs!) {
    updateChapter(id: $id, data: $data) {
      id
      name
      description
      city
      region
      country
      chatUrl
    }
  }
`;
export type UpdateChapterMutationFn = Apollo.MutationFunction<
  UpdateChapterMutation,
  UpdateChapterMutationVariables
>;

/**
 * __useUpdateChapterMutation__
 *
 * To run a mutation, you first call `useUpdateChapterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateChapterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateChapterMutation, { data, loading, error }] = useUpdateChapterMutation({
 *   variables: {
 *      id: // value for 'id'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateChapterMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateChapterMutation,
    UpdateChapterMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateChapterMutation,
    UpdateChapterMutationVariables
  >(UpdateChapterDocument, options);
}
export type UpdateChapterMutationHookResult = ReturnType<
  typeof useUpdateChapterMutation
>;
export type UpdateChapterMutationResult =
  Apollo.MutationResult<UpdateChapterMutation>;
export type UpdateChapterMutationOptions = Apollo.BaseMutationOptions<
  UpdateChapterMutation,
  UpdateChapterMutationVariables
>;
export const ChangeChapterUserRoleDocument = gql`
  mutation changeChapterUserRole(
    $chapterId: Int!
    $roleId: Int!
    $userId: Int!
  ) {
    changeChapterUserRole(
      chapterId: $chapterId
      roleId: $roleId
      userId: $userId
    ) {
      chapter_role {
        id
      }
    }
  }
`;
export type ChangeChapterUserRoleMutationFn = Apollo.MutationFunction<
  ChangeChapterUserRoleMutation,
  ChangeChapterUserRoleMutationVariables
>;

/**
 * __useChangeChapterUserRoleMutation__
 *
 * To run a mutation, you first call `useChangeChapterUserRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeChapterUserRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeChapterUserRoleMutation, { data, loading, error }] = useChangeChapterUserRoleMutation({
 *   variables: {
 *      chapterId: // value for 'chapterId'
 *      roleId: // value for 'roleId'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useChangeChapterUserRoleMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ChangeChapterUserRoleMutation,
    ChangeChapterUserRoleMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    ChangeChapterUserRoleMutation,
    ChangeChapterUserRoleMutationVariables
  >(ChangeChapterUserRoleDocument, options);
}
export type ChangeChapterUserRoleMutationHookResult = ReturnType<
  typeof useChangeChapterUserRoleMutation
>;
export type ChangeChapterUserRoleMutationResult =
  Apollo.MutationResult<ChangeChapterUserRoleMutation>;
export type ChangeChapterUserRoleMutationOptions = Apollo.BaseMutationOptions<
  ChangeChapterUserRoleMutation,
  ChangeChapterUserRoleMutationVariables
>;
export const ChapterRolesDocument = gql`
  query chapterRoles {
    chapterRoles {
      id
      name
    }
  }
`;

/**
 * __useChapterRolesQuery__
 *
 * To run a query within a React component, call `useChapterRolesQuery` and pass it any options that fit your needs.
 * When your component renders, `useChapterRolesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChapterRolesQuery({
 *   variables: {
 *   },
 * });
 */
export function useChapterRolesQuery(
  baseOptions?: Apollo.QueryHookOptions<
    ChapterRolesQuery,
    ChapterRolesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ChapterRolesQuery, ChapterRolesQueryVariables>(
    ChapterRolesDocument,
    options,
  );
}
export function useChapterRolesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ChapterRolesQuery,
    ChapterRolesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ChapterRolesQuery, ChapterRolesQueryVariables>(
    ChapterRolesDocument,
    options,
  );
}
export type ChapterRolesQueryHookResult = ReturnType<
  typeof useChapterRolesQuery
>;
export type ChapterRolesLazyQueryHookResult = ReturnType<
  typeof useChapterRolesLazyQuery
>;
export type ChapterRolesQueryResult = Apollo.QueryResult<
  ChapterRolesQuery,
  ChapterRolesQueryVariables
>;
export const CreateEventDocument = gql`
  mutation createEvent($data: CreateEventInputs!) {
    createEvent(data: $data) {
      id
      name
      canceled
      description
      url
      streaming_url
      capacity
      tags {
        tag {
          id
          name
        }
      }
    }
  }
`;
export type CreateEventMutationFn = Apollo.MutationFunction<
  CreateEventMutation,
  CreateEventMutationVariables
>;

/**
 * __useCreateEventMutation__
 *
 * To run a mutation, you first call `useCreateEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createEventMutation, { data, loading, error }] = useCreateEventMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateEventMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateEventMutation,
    CreateEventMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreateEventMutation, CreateEventMutationVariables>(
    CreateEventDocument,
    options,
  );
}
export type CreateEventMutationHookResult = ReturnType<
  typeof useCreateEventMutation
>;
export type CreateEventMutationResult =
  Apollo.MutationResult<CreateEventMutation>;
export type CreateEventMutationOptions = Apollo.BaseMutationOptions<
  CreateEventMutation,
  CreateEventMutationVariables
>;
export const UpdateEventDocument = gql`
  mutation updateEvent($id: Int!, $data: UpdateEventInputs!) {
    updateEvent(id: $id, data: $data) {
      id
      name
      canceled
      description
      url
      streaming_url
      capacity
      tags {
        tag {
          id
          name
        }
      }
    }
  }
`;
export type UpdateEventMutationFn = Apollo.MutationFunction<
  UpdateEventMutation,
  UpdateEventMutationVariables
>;

/**
 * __useUpdateEventMutation__
 *
 * To run a mutation, you first call `useUpdateEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateEventMutation, { data, loading, error }] = useUpdateEventMutation({
 *   variables: {
 *      id: // value for 'id'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateEventMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateEventMutation,
    UpdateEventMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdateEventMutation, UpdateEventMutationVariables>(
    UpdateEventDocument,
    options,
  );
}
export type UpdateEventMutationHookResult = ReturnType<
  typeof useUpdateEventMutation
>;
export type UpdateEventMutationResult =
  Apollo.MutationResult<UpdateEventMutation>;
export type UpdateEventMutationOptions = Apollo.BaseMutationOptions<
  UpdateEventMutation,
  UpdateEventMutationVariables
>;
export const CancelEventDocument = gql`
  mutation cancelEvent($id: Int!) {
    cancelEvent(id: $id) {
      id
      canceled
    }
  }
`;
export type CancelEventMutationFn = Apollo.MutationFunction<
  CancelEventMutation,
  CancelEventMutationVariables
>;

/**
 * __useCancelEventMutation__
 *
 * To run a mutation, you first call `useCancelEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelEventMutation, { data, loading, error }] = useCancelEventMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCancelEventMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CancelEventMutation,
    CancelEventMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CancelEventMutation, CancelEventMutationVariables>(
    CancelEventDocument,
    options,
  );
}
export type CancelEventMutationHookResult = ReturnType<
  typeof useCancelEventMutation
>;
export type CancelEventMutationResult =
  Apollo.MutationResult<CancelEventMutation>;
export type CancelEventMutationOptions = Apollo.BaseMutationOptions<
  CancelEventMutation,
  CancelEventMutationVariables
>;
export const DeleteEventDocument = gql`
  mutation deleteEvent($id: Int!) {
    deleteEvent(id: $id) {
      id
    }
  }
`;
export type DeleteEventMutationFn = Apollo.MutationFunction<
  DeleteEventMutation,
  DeleteEventMutationVariables
>;

/**
 * __useDeleteEventMutation__
 *
 * To run a mutation, you first call `useDeleteEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteEventMutation, { data, loading, error }] = useDeleteEventMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteEventMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteEventMutation,
    DeleteEventMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeleteEventMutation, DeleteEventMutationVariables>(
    DeleteEventDocument,
    options,
  );
}
export type DeleteEventMutationHookResult = ReturnType<
  typeof useDeleteEventMutation
>;
export type DeleteEventMutationResult =
  Apollo.MutationResult<DeleteEventMutation>;
export type DeleteEventMutationOptions = Apollo.BaseMutationOptions<
  DeleteEventMutation,
  DeleteEventMutationVariables
>;
export const ConfirmRsvpDocument = gql`
  mutation confirmRsvp($eventId: Int!, $userId: Int!) {
    confirmRsvp(eventId: $eventId, userId: $userId) {
      rsvp {
        updated_at
        name
      }
    }
  }
`;
export type ConfirmRsvpMutationFn = Apollo.MutationFunction<
  ConfirmRsvpMutation,
  ConfirmRsvpMutationVariables
>;

/**
 * __useConfirmRsvpMutation__
 *
 * To run a mutation, you first call `useConfirmRsvpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useConfirmRsvpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [confirmRsvpMutation, { data, loading, error }] = useConfirmRsvpMutation({
 *   variables: {
 *      eventId: // value for 'eventId'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useConfirmRsvpMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ConfirmRsvpMutation,
    ConfirmRsvpMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<ConfirmRsvpMutation, ConfirmRsvpMutationVariables>(
    ConfirmRsvpDocument,
    options,
  );
}
export type ConfirmRsvpMutationHookResult = ReturnType<
  typeof useConfirmRsvpMutation
>;
export type ConfirmRsvpMutationResult =
  Apollo.MutationResult<ConfirmRsvpMutation>;
export type ConfirmRsvpMutationOptions = Apollo.BaseMutationOptions<
  ConfirmRsvpMutation,
  ConfirmRsvpMutationVariables
>;
export const DeleteRsvpDocument = gql`
  mutation deleteRsvp($eventId: Int!, $userId: Int!) {
    deleteRsvp(eventId: $eventId, userId: $userId)
  }
`;
export type DeleteRsvpMutationFn = Apollo.MutationFunction<
  DeleteRsvpMutation,
  DeleteRsvpMutationVariables
>;

/**
 * __useDeleteRsvpMutation__
 *
 * To run a mutation, you first call `useDeleteRsvpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteRsvpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteRsvpMutation, { data, loading, error }] = useDeleteRsvpMutation({
 *   variables: {
 *      eventId: // value for 'eventId'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useDeleteRsvpMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteRsvpMutation,
    DeleteRsvpMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeleteRsvpMutation, DeleteRsvpMutationVariables>(
    DeleteRsvpDocument,
    options,
  );
}
export type DeleteRsvpMutationHookResult = ReturnType<
  typeof useDeleteRsvpMutation
>;
export type DeleteRsvpMutationResult =
  Apollo.MutationResult<DeleteRsvpMutation>;
export type DeleteRsvpMutationOptions = Apollo.BaseMutationOptions<
  DeleteRsvpMutation,
  DeleteRsvpMutationVariables
>;
export const SendEventInviteDocument = gql`
  mutation sendEventInvite($id: Int!, $emailGroups: [String!]) {
    sendEventInvite(id: $id, emailGroups: $emailGroups)
  }
`;
export type SendEventInviteMutationFn = Apollo.MutationFunction<
  SendEventInviteMutation,
  SendEventInviteMutationVariables
>;

/**
 * __useSendEventInviteMutation__
 *
 * To run a mutation, you first call `useSendEventInviteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendEventInviteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendEventInviteMutation, { data, loading, error }] = useSendEventInviteMutation({
 *   variables: {
 *      id: // value for 'id'
 *      emailGroups: // value for 'emailGroups'
 *   },
 * });
 */
export function useSendEventInviteMutation(
  baseOptions?: Apollo.MutationHookOptions<
    SendEventInviteMutation,
    SendEventInviteMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    SendEventInviteMutation,
    SendEventInviteMutationVariables
  >(SendEventInviteDocument, options);
}
export type SendEventInviteMutationHookResult = ReturnType<
  typeof useSendEventInviteMutation
>;
export type SendEventInviteMutationResult =
  Apollo.MutationResult<SendEventInviteMutation>;
export type SendEventInviteMutationOptions = Apollo.BaseMutationOptions<
  SendEventInviteMutation,
  SendEventInviteMutationVariables
>;
export const InitUserInterestForChapterDocument = gql`
  mutation initUserInterestForChapter($event_id: Int!) {
    initUserInterestForChapter(event_id: $event_id)
  }
`;
export type InitUserInterestForChapterMutationFn = Apollo.MutationFunction<
  InitUserInterestForChapterMutation,
  InitUserInterestForChapterMutationVariables
>;

/**
 * __useInitUserInterestForChapterMutation__
 *
 * To run a mutation, you first call `useInitUserInterestForChapterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInitUserInterestForChapterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [initUserInterestForChapterMutation, { data, loading, error }] = useInitUserInterestForChapterMutation({
 *   variables: {
 *      event_id: // value for 'event_id'
 *   },
 * });
 */
export function useInitUserInterestForChapterMutation(
  baseOptions?: Apollo.MutationHookOptions<
    InitUserInterestForChapterMutation,
    InitUserInterestForChapterMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    InitUserInterestForChapterMutation,
    InitUserInterestForChapterMutationVariables
  >(InitUserInterestForChapterDocument, options);
}
export type InitUserInterestForChapterMutationHookResult = ReturnType<
  typeof useInitUserInterestForChapterMutation
>;
export type InitUserInterestForChapterMutationResult =
  Apollo.MutationResult<InitUserInterestForChapterMutation>;
export type InitUserInterestForChapterMutationOptions =
  Apollo.BaseMutationOptions<
    InitUserInterestForChapterMutation,
    InitUserInterestForChapterMutationVariables
  >;
export const ChangeEventUserRoleDocument = gql`
  mutation changeEventUserRole($eventId: Int!, $roleId: Int!, $userId: Int!) {
    changeEventUserRole(eventId: $eventId, roleId: $roleId, userId: $userId) {
      event_role {
        id
      }
    }
  }
`;
export type ChangeEventUserRoleMutationFn = Apollo.MutationFunction<
  ChangeEventUserRoleMutation,
  ChangeEventUserRoleMutationVariables
>;

/**
 * __useChangeEventUserRoleMutation__
 *
 * To run a mutation, you first call `useChangeEventUserRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeEventUserRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeEventUserRoleMutation, { data, loading, error }] = useChangeEventUserRoleMutation({
 *   variables: {
 *      eventId: // value for 'eventId'
 *      roleId: // value for 'roleId'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useChangeEventUserRoleMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ChangeEventUserRoleMutation,
    ChangeEventUserRoleMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    ChangeEventUserRoleMutation,
    ChangeEventUserRoleMutationVariables
  >(ChangeEventUserRoleDocument, options);
}
export type ChangeEventUserRoleMutationHookResult = ReturnType<
  typeof useChangeEventUserRoleMutation
>;
export type ChangeEventUserRoleMutationResult =
  Apollo.MutationResult<ChangeEventUserRoleMutation>;
export type ChangeEventUserRoleMutationOptions = Apollo.BaseMutationOptions<
  ChangeEventUserRoleMutation,
  ChangeEventUserRoleMutationVariables
>;
export const EventsDocument = gql`
  query events {
    events(showAll: true) {
      id
      name
      canceled
      description
      url
      invite_only
      streaming_url
      start_at
      capacity
      venue_type
      venue {
        id
        name
      }
      tags {
        tag {
          id
          name
        }
      }
    }
  }
`;

/**
 * __useEventsQuery__
 *
 * To run a query within a React component, call `useEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventsQuery({
 *   variables: {
 *   },
 * });
 */
export function useEventsQuery(
  baseOptions?: Apollo.QueryHookOptions<EventsQuery, EventsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<EventsQuery, EventsQueryVariables>(
    EventsDocument,
    options,
  );
}
export function useEventsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<EventsQuery, EventsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<EventsQuery, EventsQueryVariables>(
    EventsDocument,
    options,
  );
}
export type EventsQueryHookResult = ReturnType<typeof useEventsQuery>;
export type EventsLazyQueryHookResult = ReturnType<typeof useEventsLazyQuery>;
export type EventsQueryResult = Apollo.QueryResult<
  EventsQuery,
  EventsQueryVariables
>;
export const EventDocument = gql`
  query event($id: Int!) {
    event(id: $id) {
      id
      name
      description
      url
      invite_only
      streaming_url
      canceled
      capacity
      start_at
      ends_at
      image_url
      chapter {
        id
        name
      }
      tags {
        tag {
          id
          name
        }
      }
      sponsors {
        sponsor {
          name
          website
          logo_path
          type
          id
        }
      }
      venue_type
      venue {
        id
        name
        street_address
        city
        postal_code
        region
        country
      }
      event_users {
        rsvp {
          name
        }
        user {
          id
          name
        }
        event_role {
          id
          name
          event_role_permissions {
            event_permission {
              name
            }
          }
        }
        subscribed
      }
    }
  }
`;

/**
 * __useEventQuery__
 *
 * To run a query within a React component, call `useEventQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useEventQuery(
  baseOptions: Apollo.QueryHookOptions<EventQuery, EventQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<EventQuery, EventQueryVariables>(
    EventDocument,
    options,
  );
}
export function useEventLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<EventQuery, EventQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<EventQuery, EventQueryVariables>(
    EventDocument,
    options,
  );
}
export type EventQueryHookResult = ReturnType<typeof useEventQuery>;
export type EventLazyQueryHookResult = ReturnType<typeof useEventLazyQuery>;
export type EventQueryResult = Apollo.QueryResult<
  EventQuery,
  EventQueryVariables
>;
export const EventVenuesDocument = gql`
  query eventVenues($id: Int!) {
    event(id: $id) {
      id
      name
      description
      url
      streaming_url
      capacity
      start_at
      ends_at
      tags {
        tag {
          id
          name
        }
      }
      venue {
        id
      }
    }
    venues {
      id
      name
    }
  }
`;

/**
 * __useEventVenuesQuery__
 *
 * To run a query within a React component, call `useEventVenuesQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventVenuesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventVenuesQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useEventVenuesQuery(
  baseOptions: Apollo.QueryHookOptions<
    EventVenuesQuery,
    EventVenuesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<EventVenuesQuery, EventVenuesQueryVariables>(
    EventVenuesDocument,
    options,
  );
}
export function useEventVenuesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    EventVenuesQuery,
    EventVenuesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<EventVenuesQuery, EventVenuesQueryVariables>(
    EventVenuesDocument,
    options,
  );
}
export type EventVenuesQueryHookResult = ReturnType<typeof useEventVenuesQuery>;
export type EventVenuesLazyQueryHookResult = ReturnType<
  typeof useEventVenuesLazyQuery
>;
export type EventVenuesQueryResult = Apollo.QueryResult<
  EventVenuesQuery,
  EventVenuesQueryVariables
>;
export const SponsorsDocument = gql`
  query sponsors {
    sponsors {
      id
      name
      website
      logo_path
      type
    }
  }
`;

/**
 * __useSponsorsQuery__
 *
 * To run a query within a React component, call `useSponsorsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSponsorsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSponsorsQuery({
 *   variables: {
 *   },
 * });
 */
export function useSponsorsQuery(
  baseOptions?: Apollo.QueryHookOptions<SponsorsQuery, SponsorsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<SponsorsQuery, SponsorsQueryVariables>(
    SponsorsDocument,
    options,
  );
}
export function useSponsorsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    SponsorsQuery,
    SponsorsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<SponsorsQuery, SponsorsQueryVariables>(
    SponsorsDocument,
    options,
  );
}
export type SponsorsQueryHookResult = ReturnType<typeof useSponsorsQuery>;
export type SponsorsLazyQueryHookResult = ReturnType<
  typeof useSponsorsLazyQuery
>;
export type SponsorsQueryResult = Apollo.QueryResult<
  SponsorsQuery,
  SponsorsQueryVariables
>;
export const EventRolesDocument = gql`
  query eventRoles {
    eventRoles {
      id
      name
    }
  }
`;

/**
 * __useEventRolesQuery__
 *
 * To run a query within a React component, call `useEventRolesQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventRolesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventRolesQuery({
 *   variables: {
 *   },
 * });
 */
export function useEventRolesQuery(
  baseOptions?: Apollo.QueryHookOptions<
    EventRolesQuery,
    EventRolesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<EventRolesQuery, EventRolesQueryVariables>(
    EventRolesDocument,
    options,
  );
}
export function useEventRolesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    EventRolesQuery,
    EventRolesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<EventRolesQuery, EventRolesQueryVariables>(
    EventRolesDocument,
    options,
  );
}
export type EventRolesQueryHookResult = ReturnType<typeof useEventRolesQuery>;
export type EventRolesLazyQueryHookResult = ReturnType<
  typeof useEventRolesLazyQuery
>;
export type EventRolesQueryResult = Apollo.QueryResult<
  EventRolesQuery,
  EventRolesQueryVariables
>;
export const CreateSponsorDocument = gql`
  mutation createSponsor($data: CreateSponsorInputs!) {
    createSponsor(data: $data) {
      name
      website
      logo_path
      type
    }
  }
`;
export type CreateSponsorMutationFn = Apollo.MutationFunction<
  CreateSponsorMutation,
  CreateSponsorMutationVariables
>;

/**
 * __useCreateSponsorMutation__
 *
 * To run a mutation, you first call `useCreateSponsorMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSponsorMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSponsorMutation, { data, loading, error }] = useCreateSponsorMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateSponsorMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateSponsorMutation,
    CreateSponsorMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateSponsorMutation,
    CreateSponsorMutationVariables
  >(CreateSponsorDocument, options);
}
export type CreateSponsorMutationHookResult = ReturnType<
  typeof useCreateSponsorMutation
>;
export type CreateSponsorMutationResult =
  Apollo.MutationResult<CreateSponsorMutation>;
export type CreateSponsorMutationOptions = Apollo.BaseMutationOptions<
  CreateSponsorMutation,
  CreateSponsorMutationVariables
>;
export const UpdateSponsorDocument = gql`
  mutation updateSponsor($data: UpdateSponsorInputs!, $updateSponsorId: Int!) {
    updateSponsor(data: $data, id: $updateSponsorId) {
      name
      website
      logo_path
      type
    }
  }
`;
export type UpdateSponsorMutationFn = Apollo.MutationFunction<
  UpdateSponsorMutation,
  UpdateSponsorMutationVariables
>;

/**
 * __useUpdateSponsorMutation__
 *
 * To run a mutation, you first call `useUpdateSponsorMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSponsorMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSponsorMutation, { data, loading, error }] = useUpdateSponsorMutation({
 *   variables: {
 *      data: // value for 'data'
 *      updateSponsorId: // value for 'updateSponsorId'
 *   },
 * });
 */
export function useUpdateSponsorMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateSponsorMutation,
    UpdateSponsorMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateSponsorMutation,
    UpdateSponsorMutationVariables
  >(UpdateSponsorDocument, options);
}
export type UpdateSponsorMutationHookResult = ReturnType<
  typeof useUpdateSponsorMutation
>;
export type UpdateSponsorMutationResult =
  Apollo.MutationResult<UpdateSponsorMutation>;
export type UpdateSponsorMutationOptions = Apollo.BaseMutationOptions<
  UpdateSponsorMutation,
  UpdateSponsorMutationVariables
>;
export const SponsorDocument = gql`
  query sponsor($sponsorId: Int!) {
    sponsor(id: $sponsorId) {
      id
      name
      website
      logo_path
      type
    }
  }
`;

/**
 * __useSponsorQuery__
 *
 * To run a query within a React component, call `useSponsorQuery` and pass it any options that fit your needs.
 * When your component renders, `useSponsorQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSponsorQuery({
 *   variables: {
 *      sponsorId: // value for 'sponsorId'
 *   },
 * });
 */
export function useSponsorQuery(
  baseOptions: Apollo.QueryHookOptions<SponsorQuery, SponsorQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<SponsorQuery, SponsorQueryVariables>(
    SponsorDocument,
    options,
  );
}
export function useSponsorLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    SponsorQuery,
    SponsorQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<SponsorQuery, SponsorQueryVariables>(
    SponsorDocument,
    options,
  );
}
export type SponsorQueryHookResult = ReturnType<typeof useSponsorQuery>;
export type SponsorLazyQueryHookResult = ReturnType<typeof useSponsorLazyQuery>;
export type SponsorQueryResult = Apollo.QueryResult<
  SponsorQuery,
  SponsorQueryVariables
>;
export const CreateVenueDocument = gql`
  mutation createVenue($data: CreateVenueInputs!) {
    createVenue(data: $data) {
      id
      name
      street_address
      city
      postal_code
      region
      country
      latitude
      longitude
    }
  }
`;
export type CreateVenueMutationFn = Apollo.MutationFunction<
  CreateVenueMutation,
  CreateVenueMutationVariables
>;

/**
 * __useCreateVenueMutation__
 *
 * To run a mutation, you first call `useCreateVenueMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateVenueMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createVenueMutation, { data, loading, error }] = useCreateVenueMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateVenueMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateVenueMutation,
    CreateVenueMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreateVenueMutation, CreateVenueMutationVariables>(
    CreateVenueDocument,
    options,
  );
}
export type CreateVenueMutationHookResult = ReturnType<
  typeof useCreateVenueMutation
>;
export type CreateVenueMutationResult =
  Apollo.MutationResult<CreateVenueMutation>;
export type CreateVenueMutationOptions = Apollo.BaseMutationOptions<
  CreateVenueMutation,
  CreateVenueMutationVariables
>;
export const UpdateVenueDocument = gql`
  mutation updateVenue($id: Int!, $data: UpdateVenueInputs!) {
    updateVenue(id: $id, data: $data) {
      id
      name
      street_address
      city
      postal_code
      region
      country
      latitude
      longitude
    }
  }
`;
export type UpdateVenueMutationFn = Apollo.MutationFunction<
  UpdateVenueMutation,
  UpdateVenueMutationVariables
>;

/**
 * __useUpdateVenueMutation__
 *
 * To run a mutation, you first call `useUpdateVenueMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateVenueMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateVenueMutation, { data, loading, error }] = useUpdateVenueMutation({
 *   variables: {
 *      id: // value for 'id'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateVenueMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateVenueMutation,
    UpdateVenueMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdateVenueMutation, UpdateVenueMutationVariables>(
    UpdateVenueDocument,
    options,
  );
}
export type UpdateVenueMutationHookResult = ReturnType<
  typeof useUpdateVenueMutation
>;
export type UpdateVenueMutationResult =
  Apollo.MutationResult<UpdateVenueMutation>;
export type UpdateVenueMutationOptions = Apollo.BaseMutationOptions<
  UpdateVenueMutation,
  UpdateVenueMutationVariables
>;
export const VenuesDocument = gql`
  query venues {
    venues {
      id
      name
      street_address
      city
      postal_code
      region
      country
      latitude
      longitude
    }
  }
`;

/**
 * __useVenuesQuery__
 *
 * To run a query within a React component, call `useVenuesQuery` and pass it any options that fit your needs.
 * When your component renders, `useVenuesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useVenuesQuery({
 *   variables: {
 *   },
 * });
 */
export function useVenuesQuery(
  baseOptions?: Apollo.QueryHookOptions<VenuesQuery, VenuesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<VenuesQuery, VenuesQueryVariables>(
    VenuesDocument,
    options,
  );
}
export function useVenuesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<VenuesQuery, VenuesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<VenuesQuery, VenuesQueryVariables>(
    VenuesDocument,
    options,
  );
}
export type VenuesQueryHookResult = ReturnType<typeof useVenuesQuery>;
export type VenuesLazyQueryHookResult = ReturnType<typeof useVenuesLazyQuery>;
export type VenuesQueryResult = Apollo.QueryResult<
  VenuesQuery,
  VenuesQueryVariables
>;
export const VenueDocument = gql`
  query venue($id: Int!) {
    venue(id: $id) {
      id
      name
      street_address
      city
      postal_code
      region
      country
      latitude
      longitude
    }
  }
`;

/**
 * __useVenueQuery__
 *
 * To run a query within a React component, call `useVenueQuery` and pass it any options that fit your needs.
 * When your component renders, `useVenueQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useVenueQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useVenueQuery(
  baseOptions: Apollo.QueryHookOptions<VenueQuery, VenueQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<VenueQuery, VenueQueryVariables>(
    VenueDocument,
    options,
  );
}
export function useVenueLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<VenueQuery, VenueQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<VenueQuery, VenueQueryVariables>(
    VenueDocument,
    options,
  );
}
export type VenueQueryHookResult = ReturnType<typeof useVenueQuery>;
export type VenueLazyQueryHookResult = ReturnType<typeof useVenueLazyQuery>;
export type VenueQueryResult = Apollo.QueryResult<
  VenueQuery,
  VenueQueryVariables
>;
export const RsvpToEventDocument = gql`
  mutation rsvpToEvent($eventId: Int!) {
    rsvpEvent(eventId: $eventId) {
      updated_at
    }
  }
`;
export type RsvpToEventMutationFn = Apollo.MutationFunction<
  RsvpToEventMutation,
  RsvpToEventMutationVariables
>;

/**
 * __useRsvpToEventMutation__
 *
 * To run a mutation, you first call `useRsvpToEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRsvpToEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [rsvpToEventMutation, { data, loading, error }] = useRsvpToEventMutation({
 *   variables: {
 *      eventId: // value for 'eventId'
 *   },
 * });
 */
export function useRsvpToEventMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RsvpToEventMutation,
    RsvpToEventMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<RsvpToEventMutation, RsvpToEventMutationVariables>(
    RsvpToEventDocument,
    options,
  );
}
export type RsvpToEventMutationHookResult = ReturnType<
  typeof useRsvpToEventMutation
>;
export type RsvpToEventMutationResult =
  Apollo.MutationResult<RsvpToEventMutation>;
export type RsvpToEventMutationOptions = Apollo.BaseMutationOptions<
  RsvpToEventMutation,
  RsvpToEventMutationVariables
>;
export const SubscribeToEventDocument = gql`
  mutation subscribeToEvent($eventId: Int!) {
    subscribeToEvent(eventId: $eventId) {
      subscribed
    }
  }
`;
export type SubscribeToEventMutationFn = Apollo.MutationFunction<
  SubscribeToEventMutation,
  SubscribeToEventMutationVariables
>;

/**
 * __useSubscribeToEventMutation__
 *
 * To run a mutation, you first call `useSubscribeToEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSubscribeToEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [subscribeToEventMutation, { data, loading, error }] = useSubscribeToEventMutation({
 *   variables: {
 *      eventId: // value for 'eventId'
 *   },
 * });
 */
export function useSubscribeToEventMutation(
  baseOptions?: Apollo.MutationHookOptions<
    SubscribeToEventMutation,
    SubscribeToEventMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    SubscribeToEventMutation,
    SubscribeToEventMutationVariables
  >(SubscribeToEventDocument, options);
}
export type SubscribeToEventMutationHookResult = ReturnType<
  typeof useSubscribeToEventMutation
>;
export type SubscribeToEventMutationResult =
  Apollo.MutationResult<SubscribeToEventMutation>;
export type SubscribeToEventMutationOptions = Apollo.BaseMutationOptions<
  SubscribeToEventMutation,
  SubscribeToEventMutationVariables
>;
export const UnsubscribeFromEventDocument = gql`
  mutation unsubscribeFromEvent($eventId: Int!) {
    unsubscribeFromEvent(eventId: $eventId) {
      subscribed
    }
  }
`;
export type UnsubscribeFromEventMutationFn = Apollo.MutationFunction<
  UnsubscribeFromEventMutation,
  UnsubscribeFromEventMutationVariables
>;

/**
 * __useUnsubscribeFromEventMutation__
 *
 * To run a mutation, you first call `useUnsubscribeFromEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnsubscribeFromEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unsubscribeFromEventMutation, { data, loading, error }] = useUnsubscribeFromEventMutation({
 *   variables: {
 *      eventId: // value for 'eventId'
 *   },
 * });
 */
export function useUnsubscribeFromEventMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UnsubscribeFromEventMutation,
    UnsubscribeFromEventMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UnsubscribeFromEventMutation,
    UnsubscribeFromEventMutationVariables
  >(UnsubscribeFromEventDocument, options);
}
export type UnsubscribeFromEventMutationHookResult = ReturnType<
  typeof useUnsubscribeFromEventMutation
>;
export type UnsubscribeFromEventMutationResult =
  Apollo.MutationResult<UnsubscribeFromEventMutation>;
export type UnsubscribeFromEventMutationOptions = Apollo.BaseMutationOptions<
  UnsubscribeFromEventMutation,
  UnsubscribeFromEventMutationVariables
>;
export const MinEventsDocument = gql`
  query minEvents {
    events {
      id
      name
      description
      start_at
      invite_only
      canceled
      image_url
      tags {
        tag {
          id
          name
        }
      }
      chapter {
        id
        name
        category
      }
    }
  }
`;

/**
 * __useMinEventsQuery__
 *
 * To run a query within a React component, call `useMinEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMinEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMinEventsQuery({
 *   variables: {
 *   },
 * });
 */
export function useMinEventsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    MinEventsQuery,
    MinEventsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<MinEventsQuery, MinEventsQueryVariables>(
    MinEventsDocument,
    options,
  );
}
export function useMinEventsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    MinEventsQuery,
    MinEventsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<MinEventsQuery, MinEventsQueryVariables>(
    MinEventsDocument,
    options,
  );
}
export type MinEventsQueryHookResult = ReturnType<typeof useMinEventsQuery>;
export type MinEventsLazyQueryHookResult = ReturnType<
  typeof useMinEventsLazyQuery
>;
export type MinEventsQueryResult = Apollo.QueryResult<
  MinEventsQuery,
  MinEventsQueryVariables
>;
export const HomeDocument = gql`
  query home($limit: Int, $offset: Int) {
    paginatedEvents(limit: $limit, offset: $offset) {
      id
      name
      description
      invite_only
      canceled
      start_at
      image_url
      tags {
        tag {
          id
          name
        }
      }
      chapter {
        id
        name
        category
      }
    }
    chapters {
      id
      name
      description
      category
      imageUrl
    }
  }
`;

/**
 * __useHomeQuery__
 *
 * To run a query within a React component, call `useHomeQuery` and pass it any options that fit your needs.
 * When your component renders, `useHomeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHomeQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useHomeQuery(
  baseOptions?: Apollo.QueryHookOptions<HomeQuery, HomeQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<HomeQuery, HomeQueryVariables>(HomeDocument, options);
}
export function useHomeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<HomeQuery, HomeQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<HomeQuery, HomeQueryVariables>(
    HomeDocument,
    options,
  );
}
export type HomeQueryHookResult = ReturnType<typeof useHomeQuery>;
export type HomeLazyQueryHookResult = ReturnType<typeof useHomeLazyQuery>;
export type HomeQueryResult = Apollo.QueryResult<HomeQuery, HomeQueryVariables>;

export interface PossibleTypesResultData {
  possibleTypes: {
    [key: string]: string[];
  };
}
const result: PossibleTypesResultData = {
  possibleTypes: {},
};
export default result;
