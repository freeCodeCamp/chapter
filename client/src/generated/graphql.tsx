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
  DateTime: any;
};

export type Chapter = {
  __typename?: 'Chapter';
  category: Scalars['String'];
  chat_url?: Maybe<Scalars['String']>;
  city: Scalars['String'];
  country: Scalars['String'];
  creator_id: Scalars['Int'];
  description: Scalars['String'];
  id: Scalars['Int'];
  image_url: Scalars['String'];
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
  is_bannable: Scalars['Boolean'];
  joined_date: Scalars['DateTime'];
  subscribed: Scalars['Boolean'];
  user: User;
  user_id: Scalars['Int'];
};

export type ChapterWithEvents = {
  __typename?: 'ChapterWithEvents';
  category: Scalars['String'];
  chat_url?: Maybe<Scalars['String']>;
  city: Scalars['String'];
  country: Scalars['String'];
  creator_id: Scalars['Int'];
  description: Scalars['String'];
  events: Array<Event>;
  id: Scalars['Int'];
  image_url: Scalars['String'];
  name: Scalars['String'];
  region: Scalars['String'];
};

export type ChapterWithRelations = {
  __typename?: 'ChapterWithRelations';
  category: Scalars['String'];
  chapter_users: Array<ChapterUser>;
  chat_url?: Maybe<Scalars['String']>;
  city: Scalars['String'];
  country: Scalars['String'];
  creator_id: Scalars['Int'];
  description: Scalars['String'];
  events: Array<Event>;
  id: Scalars['Int'];
  image_url: Scalars['String'];
  name: Scalars['String'];
  region: Scalars['String'];
  user_bans: Array<UserBan>;
};

export type CreateChapterInputs = {
  category: Scalars['String'];
  chat_url?: InputMaybe<Scalars['String']>;
  city: Scalars['String'];
  country: Scalars['String'];
  description: Scalars['String'];
  image_url: Scalars['String'];
  name: Scalars['String'];
  region: Scalars['String'];
};

export type CreateEventInputs = {
  capacity: Scalars['Float'];
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

export type InstancePermission = {
  __typename?: 'InstancePermission';
  name: Scalars['String'];
};

export type InstanceRole = {
  __typename?: 'InstanceRole';
  id: Scalars['Float'];
  instance_role_permissions: Array<InstanceRolePermission>;
  name: Scalars['String'];
};

export type InstanceRolePermission = {
  __typename?: 'InstanceRolePermission';
  instance_permission: InstancePermission;
};

export type Mutation = {
  __typename?: 'Mutation';
  banUser: UserBan;
  cancelEvent: Event;
  cancelRsvp?: Maybe<EventUser>;
  changeChapterUserRole: ChapterUser;
  changeInstanceUserRole: UserWithInstanceRole;
  confirmRsvp: EventUser;
  createChapter: Chapter;
  createEvent: Event;
  createSponsor: Sponsor;
  createVenue: Venue;
  deleteChapter: Chapter;
  deleteEvent: Event;
  deleteMe: User;
  deleteRsvp: Scalars['Boolean'];
  deleteVenue: Venue;
  joinChapter: ChapterUser;
  rsvpEvent: EventUser;
  sendEmail: Email;
  sendEventInvite: Scalars['Boolean'];
  subscribeToEvent: EventUser;
  toggleChapterSubscription: ChapterUser;
  unbanUser: UserBan;
  unsubscribe: Scalars['Boolean'];
  unsubscribeFromEvent: EventUser;
  updateChapter: Chapter;
  updateEvent: Event;
  updateMe: User;
  updateSponsor: Sponsor;
  updateVenue: Venue;
};

export type MutationBanUserArgs = {
  chapterId: Scalars['Int'];
  userId: Scalars['Int'];
};

export type MutationCancelEventArgs = {
  id: Scalars['Int'];
};

export type MutationCancelRsvpArgs = {
  eventId: Scalars['Int'];
};

export type MutationChangeChapterUserRoleArgs = {
  chapterId: Scalars['Int'];
  roleId: Scalars['Int'];
  userId: Scalars['Int'];
};

export type MutationChangeInstanceUserRoleArgs = {
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
  chapterId: Scalars['Int'];
  data: CreateEventInputs;
};

export type MutationCreateSponsorArgs = {
  data: CreateSponsorInputs;
};

export type MutationCreateVenueArgs = {
  chapterId: Scalars['Int'];
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
  chapterId: Scalars['Int'];
  venueId: Scalars['Int'];
};

export type MutationJoinChapterArgs = {
  chapterId: Scalars['Int'];
};

export type MutationRsvpEventArgs = {
  chapterId: Scalars['Int'];
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

export type MutationUnbanUserArgs = {
  chapterId: Scalars['Int'];
  userId: Scalars['Int'];
};

export type MutationUnsubscribeArgs = {
  token: Scalars['String'];
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

export type MutationUpdateMeArgs = {
  data: UpdateUserInputs;
};

export type MutationUpdateSponsorArgs = {
  data: UpdateSponsorInputs;
  id: Scalars['Int'];
};

export type MutationUpdateVenueArgs = {
  chapterId: Scalars['Int'];
  data: UpdateVenueInputs;
  venueId: Scalars['Int'];
};

export type PaginatedEventsWithTotal = {
  __typename?: 'PaginatedEventsWithTotal';
  events: Array<EventWithChapter>;
  total: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  chapter: ChapterWithRelations;
  chapterRoles: Array<ChapterRole>;
  chapterUser: ChapterUser;
  chapterUsers: Array<ChapterUser>;
  chapterVenues: Array<Venue>;
  chapters: Array<ChapterWithEvents>;
  dashboardChapter: ChapterWithRelations;
  dashboardEvent?: Maybe<EventWithRelations>;
  event?: Maybe<EventWithRelations>;
  eventRoles: Array<EventRole>;
  events: Array<EventWithRelations>;
  instanceRoles: Array<InstanceRole>;
  me?: Maybe<UserWithInstanceRole>;
  paginatedEvents: Array<EventWithChapter>;
  paginatedEventsWithTotal: PaginatedEventsWithTotal;
  sponsor?: Maybe<Sponsor>;
  sponsors: Array<Sponsor>;
  users: Array<UserWithInstanceRole>;
  venue?: Maybe<Venue>;
  venues: Array<Venue>;
};

export type QueryChapterArgs = {
  id: Scalars['Int'];
};

export type QueryChapterUserArgs = {
  chapterId: Scalars['Int'];
};

export type QueryChapterUsersArgs = {
  id: Scalars['Int'];
};

export type QueryChapterVenuesArgs = {
  chapterId: Scalars['Int'];
};

export type QueryDashboardChapterArgs = {
  id: Scalars['Int'];
};

export type QueryDashboardEventArgs = {
  eventId: Scalars['Int'];
};

export type QueryEventArgs = {
  eventId: Scalars['Int'];
};

export type QueryEventsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  showAll?: InputMaybe<Scalars['Boolean']>;
};

export type QueryPaginatedEventsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export type QueryPaginatedEventsWithTotalArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export type QuerySponsorArgs = {
  id: Scalars['Int'];
};

export type QueryVenueArgs = {
  venueId: Scalars['Int'];
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
  chat_url?: InputMaybe<Scalars['String']>;
  city?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  image_url?: InputMaybe<Scalars['String']>;
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

export type UpdateUserInputs = {
  name?: InputMaybe<Scalars['String']>;
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
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type UserBan = {
  __typename?: 'UserBan';
  chapter: Chapter;
  user: User;
};

export type UserWithInstanceRole = {
  __typename?: 'UserWithInstanceRole';
  admined_chapters: Array<Chapter>;
  email: Scalars['String'];
  id: Scalars['Int'];
  instance_role: InstanceRole;
  name: Scalars['String'];
};

export type Venue = {
  __typename?: 'Venue';
  chapter: ChapterWithEvents;
  chapter_id: Scalars['Int'];
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

export type DeleteMeMutationVariables = Exact<{ [key: string]: never }>;

export type DeleteMeMutation = {
  __typename?: 'Mutation';
  deleteMe: { __typename?: 'User'; id: number };
};

export type UpdateMeMutationVariables = Exact<{
  data: UpdateUserInputs;
}>;

export type UpdateMeMutation = {
  __typename?: 'Mutation';
  updateMe: { __typename?: 'User'; id: number; name: string };
};

export type MeQueryVariables = Exact<{ [key: string]: never }>;

export type MeQuery = {
  __typename?: 'Query';
  me?: {
    __typename?: 'UserWithInstanceRole';
    id: number;
    name: string;
    instance_role: {
      __typename?: 'InstanceRole';
      instance_role_permissions: Array<{
        __typename?: 'InstanceRolePermission';
        instance_permission: {
          __typename?: 'InstancePermission';
          name: string;
        };
      }>;
    };
    admined_chapters: Array<{
      __typename?: 'Chapter';
      id: number;
      name: string;
    }>;
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
  chapterId: Scalars['Int'];
}>;

export type ChapterQuery = {
  __typename?: 'Query';
  chapter: {
    __typename?: 'ChapterWithRelations';
    id: number;
    name: string;
    description: string;
    category: string;
    city: string;
    region: string;
    country: string;
    image_url: string;
    chat_url?: string | null;
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
  };
};

export type DashboardChapterUsersQueryVariables = Exact<{
  chapterId: Scalars['Int'];
}>;

export type DashboardChapterUsersQuery = {
  __typename?: 'Query';
  dashboardChapter: {
    __typename?: 'ChapterWithRelations';
    chapter_users: Array<{
      __typename?: 'ChapterUser';
      subscribed: boolean;
      is_bannable: boolean;
      user: { __typename?: 'User'; id: number; name: string; email: string };
      chapter_role: { __typename?: 'ChapterRole'; id: number; name: string };
    }>;
    user_bans: Array<{
      __typename?: 'UserBan';
      user: { __typename?: 'User'; id: number };
    }>;
  };
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
    __typename?: 'ChapterWithEvents';
    id: number;
    name: string;
    description: string;
    category: string;
    image_url: string;
    events: Array<{
      __typename?: 'Event';
      id: number;
      name: string;
      start_at: any;
    }>;
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
    chat_url?: string | null;
  };
};

export type UpdateChapterMutationVariables = Exact<{
  chapterId: Scalars['Int'];
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
    chat_url?: string | null;
  };
};

export type DeleteChapterMutationVariables = Exact<{
  chapterId: Scalars['Int'];
}>;

export type DeleteChapterMutation = {
  __typename?: 'Mutation';
  deleteChapter: { __typename?: 'Chapter'; id: number };
};

export type BanUserMutationVariables = Exact<{
  chapterId: Scalars['Int'];
  userId: Scalars['Int'];
}>;

export type BanUserMutation = {
  __typename?: 'Mutation';
  banUser: {
    __typename?: 'UserBan';
    user: { __typename?: 'User'; name: string };
  };
};

export type UnbanUserMutationVariables = Exact<{
  chapterId: Scalars['Int'];
  userId: Scalars['Int'];
}>;

export type UnbanUserMutation = {
  __typename?: 'Mutation';
  unbanUser: {
    __typename?: 'UserBan';
    user: { __typename?: 'User'; name: string };
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

export type DashboardChapterQueryVariables = Exact<{
  chapterId: Scalars['Int'];
}>;

export type DashboardChapterQuery = {
  __typename?: 'Query';
  dashboardChapter: {
    __typename?: 'ChapterWithRelations';
    id: number;
    name: string;
    description: string;
    category: string;
    city: string;
    region: string;
    country: string;
    image_url: string;
    chat_url?: string | null;
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
  };
};

export type CreateEventMutationVariables = Exact<{
  chapterId: Scalars['Int'];
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
  eventId: Scalars['Int'];
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
    invite_only: boolean;
    tags: Array<{
      __typename?: 'EventTag';
      tag: { __typename?: 'Tag'; id: number; name: string };
    }>;
  };
};

export type CancelEventMutationVariables = Exact<{
  eventId: Scalars['Int'];
}>;

export type CancelEventMutation = {
  __typename?: 'Mutation';
  cancelEvent: { __typename?: 'Event'; id: number; canceled: boolean };
};

export type DeleteEventMutationVariables = Exact<{
  eventId: Scalars['Int'];
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
  eventId: Scalars['Int'];
  emailGroups?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
}>;

export type SendEventInviteMutation = {
  __typename?: 'Mutation';
  sendEventInvite: boolean;
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

export type DashboardEventQueryVariables = Exact<{
  eventId: Scalars['Int'];
}>;

export type DashboardEventQuery = {
  __typename?: 'Query';
  dashboardEvent?: {
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

export type ChapterVenuesQueryVariables = Exact<{
  chapterId: Scalars['Int'];
}>;

export type ChapterVenuesQuery = {
  __typename?: 'Query';
  chapterVenues: Array<{ __typename?: 'Venue'; id: number; name: string }>;
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

export type ChangeInstanceUserRoleMutationVariables = Exact<{
  roleId: Scalars['Int'];
  userId: Scalars['Int'];
}>;

export type ChangeInstanceUserRoleMutation = {
  __typename?: 'Mutation';
  changeInstanceUserRole: {
    __typename?: 'UserWithInstanceRole';
    instance_role: { __typename?: 'InstanceRole'; id: number };
  };
};

export type InstanceRolesQueryVariables = Exact<{ [key: string]: never }>;

export type InstanceRolesQuery = {
  __typename?: 'Query';
  instanceRoles: Array<{
    __typename?: 'InstanceRole';
    id: number;
    name: string;
  }>;
};

export type UsersQueryVariables = Exact<{ [key: string]: never }>;

export type UsersQuery = {
  __typename?: 'Query';
  users: Array<{
    __typename?: 'UserWithInstanceRole';
    id: number;
    name: string;
    instance_role: { __typename?: 'InstanceRole'; id: number; name: string };
  }>;
};

export type CreateVenueMutationVariables = Exact<{
  chapterId: Scalars['Int'];
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
  venueId: Scalars['Int'];
  chapterId: Scalars['Int'];
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
    chapter_id: number;
    name: string;
    street_address?: string | null;
    city: string;
    postal_code: string;
    region: string;
    country: string;
    latitude?: number | null;
    longitude?: number | null;
    chapter: { __typename?: 'ChapterWithEvents'; id: number; name: string };
  }>;
};

export type VenueQueryVariables = Exact<{
  venueId: Scalars['Int'];
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
    chapter: {
      __typename?: 'ChapterWithEvents';
      id: number;
      name: string;
      events: Array<{
        __typename?: 'Event';
        id: number;
        name: string;
        canceled: boolean;
        invite_only: boolean;
      }>;
    };
  } | null;
};

export type RsvpToEventMutationVariables = Exact<{
  eventId: Scalars['Int'];
  chapterId: Scalars['Int'];
}>;

export type RsvpToEventMutation = {
  __typename?: 'Mutation';
  rsvpEvent: { __typename?: 'EventUser'; updated_at: any };
};

export type CancelRsvpMutationVariables = Exact<{
  eventId: Scalars['Int'];
}>;

export type CancelRsvpMutation = {
  __typename?: 'Mutation';
  cancelRsvp?: { __typename?: 'EventUser'; updated_at: any } | null;
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

export type PaginatedEventsWithTotalQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
}>;

export type PaginatedEventsWithTotalQuery = {
  __typename?: 'Query';
  paginatedEventsWithTotal: {
    __typename?: 'PaginatedEventsWithTotal';
    total: number;
    events: Array<{
      __typename?: 'EventWithChapter';
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
};

export type EventQueryVariables = Exact<{
  eventId: Scalars['Int'];
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
    __typename?: 'ChapterWithEvents';
    id: number;
    name: string;
    description: string;
    category: string;
    image_url: string;
    events: Array<{
      __typename?: 'Event';
      id: number;
      name: string;
      start_at: any;
    }>;
  }>;
};

export type UnsubscribeMutationVariables = Exact<{
  token: Scalars['String'];
}>;

export type UnsubscribeMutation = {
  __typename?: 'Mutation';
  unsubscribe: boolean;
};

export const DeleteMeDocument = gql`
  mutation deleteMe {
    deleteMe {
      id
    }
  }
`;
export type DeleteMeMutationFn = Apollo.MutationFunction<
  DeleteMeMutation,
  DeleteMeMutationVariables
>;

/**
 * __useDeleteMeMutation__
 *
 * To run a mutation, you first call `useDeleteMeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteMeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteMeMutation, { data, loading, error }] = useDeleteMeMutation({
 *   variables: {
 *   },
 * });
 */
export function useDeleteMeMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteMeMutation,
    DeleteMeMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeleteMeMutation, DeleteMeMutationVariables>(
    DeleteMeDocument,
    options,
  );
}
export type DeleteMeMutationHookResult = ReturnType<typeof useDeleteMeMutation>;
export type DeleteMeMutationResult = Apollo.MutationResult<DeleteMeMutation>;
export type DeleteMeMutationOptions = Apollo.BaseMutationOptions<
  DeleteMeMutation,
  DeleteMeMutationVariables
>;
export const UpdateMeDocument = gql`
  mutation updateMe($data: UpdateUserInputs!) {
    updateMe(data: $data) {
      id
      name
    }
  }
`;
export type UpdateMeMutationFn = Apollo.MutationFunction<
  UpdateMeMutation,
  UpdateMeMutationVariables
>;

/**
 * __useUpdateMeMutation__
 *
 * To run a mutation, you first call `useUpdateMeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMeMutation, { data, loading, error }] = useUpdateMeMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateMeMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateMeMutation,
    UpdateMeMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdateMeMutation, UpdateMeMutationVariables>(
    UpdateMeDocument,
    options,
  );
}
export type UpdateMeMutationHookResult = ReturnType<typeof useUpdateMeMutation>;
export type UpdateMeMutationResult = Apollo.MutationResult<UpdateMeMutation>;
export type UpdateMeMutationOptions = Apollo.BaseMutationOptions<
  UpdateMeMutation,
  UpdateMeMutationVariables
>;
export const MeDocument = gql`
  query me {
    me {
      id
      name
      instance_role {
        instance_role_permissions {
          instance_permission {
            name
          }
        }
      }
      admined_chapters {
        id
        name
      }
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
  query chapter($chapterId: Int!) {
    chapter(id: $chapterId) {
      id
      name
      description
      category
      city
      region
      country
      image_url
      chat_url
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
 *      chapterId: // value for 'chapterId'
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
export const DashboardChapterUsersDocument = gql`
  query dashboardChapterUsers($chapterId: Int!) {
    dashboardChapter(id: $chapterId) {
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
        is_bannable
      }
      user_bans {
        user {
          id
        }
      }
    }
  }
`;

/**
 * __useDashboardChapterUsersQuery__
 *
 * To run a query within a React component, call `useDashboardChapterUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useDashboardChapterUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDashboardChapterUsersQuery({
 *   variables: {
 *      chapterId: // value for 'chapterId'
 *   },
 * });
 */
export function useDashboardChapterUsersQuery(
  baseOptions: Apollo.QueryHookOptions<
    DashboardChapterUsersQuery,
    DashboardChapterUsersQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    DashboardChapterUsersQuery,
    DashboardChapterUsersQueryVariables
  >(DashboardChapterUsersDocument, options);
}
export function useDashboardChapterUsersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    DashboardChapterUsersQuery,
    DashboardChapterUsersQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    DashboardChapterUsersQuery,
    DashboardChapterUsersQueryVariables
  >(DashboardChapterUsersDocument, options);
}
export type DashboardChapterUsersQueryHookResult = ReturnType<
  typeof useDashboardChapterUsersQuery
>;
export type DashboardChapterUsersLazyQueryHookResult = ReturnType<
  typeof useDashboardChapterUsersLazyQuery
>;
export type DashboardChapterUsersQueryResult = Apollo.QueryResult<
  DashboardChapterUsersQuery,
  DashboardChapterUsersQueryVariables
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
      image_url
      events {
        id
        name
        start_at
      }
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
      chat_url
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
  mutation updateChapter($chapterId: Int!, $data: UpdateChapterInputs!) {
    updateChapter(id: $chapterId, data: $data) {
      id
      name
      description
      city
      region
      country
      chat_url
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
 *      chapterId: // value for 'chapterId'
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
export const DeleteChapterDocument = gql`
  mutation deleteChapter($chapterId: Int!) {
    deleteChapter(id: $chapterId) {
      id
    }
  }
`;
export type DeleteChapterMutationFn = Apollo.MutationFunction<
  DeleteChapterMutation,
  DeleteChapterMutationVariables
>;

/**
 * __useDeleteChapterMutation__
 *
 * To run a mutation, you first call `useDeleteChapterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteChapterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteChapterMutation, { data, loading, error }] = useDeleteChapterMutation({
 *   variables: {
 *      chapterId: // value for 'chapterId'
 *   },
 * });
 */
export function useDeleteChapterMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteChapterMutation,
    DeleteChapterMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    DeleteChapterMutation,
    DeleteChapterMutationVariables
  >(DeleteChapterDocument, options);
}
export type DeleteChapterMutationHookResult = ReturnType<
  typeof useDeleteChapterMutation
>;
export type DeleteChapterMutationResult =
  Apollo.MutationResult<DeleteChapterMutation>;
export type DeleteChapterMutationOptions = Apollo.BaseMutationOptions<
  DeleteChapterMutation,
  DeleteChapterMutationVariables
>;
export const BanUserDocument = gql`
  mutation banUser($chapterId: Int!, $userId: Int!) {
    banUser(chapterId: $chapterId, userId: $userId) {
      user {
        name
      }
    }
  }
`;
export type BanUserMutationFn = Apollo.MutationFunction<
  BanUserMutation,
  BanUserMutationVariables
>;

/**
 * __useBanUserMutation__
 *
 * To run a mutation, you first call `useBanUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBanUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [banUserMutation, { data, loading, error }] = useBanUserMutation({
 *   variables: {
 *      chapterId: // value for 'chapterId'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useBanUserMutation(
  baseOptions?: Apollo.MutationHookOptions<
    BanUserMutation,
    BanUserMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<BanUserMutation, BanUserMutationVariables>(
    BanUserDocument,
    options,
  );
}
export type BanUserMutationHookResult = ReturnType<typeof useBanUserMutation>;
export type BanUserMutationResult = Apollo.MutationResult<BanUserMutation>;
export type BanUserMutationOptions = Apollo.BaseMutationOptions<
  BanUserMutation,
  BanUserMutationVariables
>;
export const UnbanUserDocument = gql`
  mutation unbanUser($chapterId: Int!, $userId: Int!) {
    unbanUser(chapterId: $chapterId, userId: $userId) {
      user {
        name
      }
    }
  }
`;
export type UnbanUserMutationFn = Apollo.MutationFunction<
  UnbanUserMutation,
  UnbanUserMutationVariables
>;

/**
 * __useUnbanUserMutation__
 *
 * To run a mutation, you first call `useUnbanUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnbanUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unbanUserMutation, { data, loading, error }] = useUnbanUserMutation({
 *   variables: {
 *      chapterId: // value for 'chapterId'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useUnbanUserMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UnbanUserMutation,
    UnbanUserMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UnbanUserMutation, UnbanUserMutationVariables>(
    UnbanUserDocument,
    options,
  );
}
export type UnbanUserMutationHookResult = ReturnType<
  typeof useUnbanUserMutation
>;
export type UnbanUserMutationResult = Apollo.MutationResult<UnbanUserMutation>;
export type UnbanUserMutationOptions = Apollo.BaseMutationOptions<
  UnbanUserMutation,
  UnbanUserMutationVariables
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
export const DashboardChapterDocument = gql`
  query dashboardChapter($chapterId: Int!) {
    dashboardChapter(id: $chapterId) {
      id
      name
      description
      category
      city
      region
      country
      image_url
      chat_url
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
      }
    }
  }
`;

/**
 * __useDashboardChapterQuery__
 *
 * To run a query within a React component, call `useDashboardChapterQuery` and pass it any options that fit your needs.
 * When your component renders, `useDashboardChapterQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDashboardChapterQuery({
 *   variables: {
 *      chapterId: // value for 'chapterId'
 *   },
 * });
 */
export function useDashboardChapterQuery(
  baseOptions: Apollo.QueryHookOptions<
    DashboardChapterQuery,
    DashboardChapterQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<DashboardChapterQuery, DashboardChapterQueryVariables>(
    DashboardChapterDocument,
    options,
  );
}
export function useDashboardChapterLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    DashboardChapterQuery,
    DashboardChapterQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    DashboardChapterQuery,
    DashboardChapterQueryVariables
  >(DashboardChapterDocument, options);
}
export type DashboardChapterQueryHookResult = ReturnType<
  typeof useDashboardChapterQuery
>;
export type DashboardChapterLazyQueryHookResult = ReturnType<
  typeof useDashboardChapterLazyQuery
>;
export type DashboardChapterQueryResult = Apollo.QueryResult<
  DashboardChapterQuery,
  DashboardChapterQueryVariables
>;
export const CreateEventDocument = gql`
  mutation createEvent($chapterId: Int!, $data: CreateEventInputs!) {
    createEvent(chapterId: $chapterId, data: $data) {
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
 *      chapterId: // value for 'chapterId'
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
  mutation updateEvent($eventId: Int!, $data: UpdateEventInputs!) {
    updateEvent(id: $eventId, data: $data) {
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
      invite_only
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
 *      eventId: // value for 'eventId'
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
  mutation cancelEvent($eventId: Int!) {
    cancelEvent(id: $eventId) {
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
 *      eventId: // value for 'eventId'
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
  mutation deleteEvent($eventId: Int!) {
    deleteEvent(id: $eventId) {
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
 *      eventId: // value for 'eventId'
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
  mutation sendEventInvite($eventId: Int!, $emailGroups: [String!]) {
    sendEventInvite(id: $eventId, emailGroups: $emailGroups)
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
 *      eventId: // value for 'eventId'
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
export const DashboardEventDocument = gql`
  query dashboardEvent($eventId: Int!) {
    dashboardEvent(eventId: $eventId) {
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
 * __useDashboardEventQuery__
 *
 * To run a query within a React component, call `useDashboardEventQuery` and pass it any options that fit your needs.
 * When your component renders, `useDashboardEventQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDashboardEventQuery({
 *   variables: {
 *      eventId: // value for 'eventId'
 *   },
 * });
 */
export function useDashboardEventQuery(
  baseOptions: Apollo.QueryHookOptions<
    DashboardEventQuery,
    DashboardEventQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<DashboardEventQuery, DashboardEventQueryVariables>(
    DashboardEventDocument,
    options,
  );
}
export function useDashboardEventLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    DashboardEventQuery,
    DashboardEventQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<DashboardEventQuery, DashboardEventQueryVariables>(
    DashboardEventDocument,
    options,
  );
}
export type DashboardEventQueryHookResult = ReturnType<
  typeof useDashboardEventQuery
>;
export type DashboardEventLazyQueryHookResult = ReturnType<
  typeof useDashboardEventLazyQuery
>;
export type DashboardEventQueryResult = Apollo.QueryResult<
  DashboardEventQuery,
  DashboardEventQueryVariables
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
export const ChapterVenuesDocument = gql`
  query chapterVenues($chapterId: Int!) {
    chapterVenues(chapterId: $chapterId) {
      id
      name
    }
  }
`;

/**
 * __useChapterVenuesQuery__
 *
 * To run a query within a React component, call `useChapterVenuesQuery` and pass it any options that fit your needs.
 * When your component renders, `useChapterVenuesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChapterVenuesQuery({
 *   variables: {
 *      chapterId: // value for 'chapterId'
 *   },
 * });
 */
export function useChapterVenuesQuery(
  baseOptions: Apollo.QueryHookOptions<
    ChapterVenuesQuery,
    ChapterVenuesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ChapterVenuesQuery, ChapterVenuesQueryVariables>(
    ChapterVenuesDocument,
    options,
  );
}
export function useChapterVenuesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ChapterVenuesQuery,
    ChapterVenuesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ChapterVenuesQuery, ChapterVenuesQueryVariables>(
    ChapterVenuesDocument,
    options,
  );
}
export type ChapterVenuesQueryHookResult = ReturnType<
  typeof useChapterVenuesQuery
>;
export type ChapterVenuesLazyQueryHookResult = ReturnType<
  typeof useChapterVenuesLazyQuery
>;
export type ChapterVenuesQueryResult = Apollo.QueryResult<
  ChapterVenuesQuery,
  ChapterVenuesQueryVariables
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
export const ChangeInstanceUserRoleDocument = gql`
  mutation changeInstanceUserRole($roleId: Int!, $userId: Int!) {
    changeInstanceUserRole(roleId: $roleId, userId: $userId) {
      instance_role {
        id
      }
    }
  }
`;
export type ChangeInstanceUserRoleMutationFn = Apollo.MutationFunction<
  ChangeInstanceUserRoleMutation,
  ChangeInstanceUserRoleMutationVariables
>;

/**
 * __useChangeInstanceUserRoleMutation__
 *
 * To run a mutation, you first call `useChangeInstanceUserRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeInstanceUserRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeInstanceUserRoleMutation, { data, loading, error }] = useChangeInstanceUserRoleMutation({
 *   variables: {
 *      roleId: // value for 'roleId'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useChangeInstanceUserRoleMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ChangeInstanceUserRoleMutation,
    ChangeInstanceUserRoleMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    ChangeInstanceUserRoleMutation,
    ChangeInstanceUserRoleMutationVariables
  >(ChangeInstanceUserRoleDocument, options);
}
export type ChangeInstanceUserRoleMutationHookResult = ReturnType<
  typeof useChangeInstanceUserRoleMutation
>;
export type ChangeInstanceUserRoleMutationResult =
  Apollo.MutationResult<ChangeInstanceUserRoleMutation>;
export type ChangeInstanceUserRoleMutationOptions = Apollo.BaseMutationOptions<
  ChangeInstanceUserRoleMutation,
  ChangeInstanceUserRoleMutationVariables
>;
export const InstanceRolesDocument = gql`
  query instanceRoles {
    instanceRoles {
      id
      name
    }
  }
`;

/**
 * __useInstanceRolesQuery__
 *
 * To run a query within a React component, call `useInstanceRolesQuery` and pass it any options that fit your needs.
 * When your component renders, `useInstanceRolesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useInstanceRolesQuery({
 *   variables: {
 *   },
 * });
 */
export function useInstanceRolesQuery(
  baseOptions?: Apollo.QueryHookOptions<
    InstanceRolesQuery,
    InstanceRolesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<InstanceRolesQuery, InstanceRolesQueryVariables>(
    InstanceRolesDocument,
    options,
  );
}
export function useInstanceRolesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    InstanceRolesQuery,
    InstanceRolesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<InstanceRolesQuery, InstanceRolesQueryVariables>(
    InstanceRolesDocument,
    options,
  );
}
export type InstanceRolesQueryHookResult = ReturnType<
  typeof useInstanceRolesQuery
>;
export type InstanceRolesLazyQueryHookResult = ReturnType<
  typeof useInstanceRolesLazyQuery
>;
export type InstanceRolesQueryResult = Apollo.QueryResult<
  InstanceRolesQuery,
  InstanceRolesQueryVariables
>;
export const UsersDocument = gql`
  query users {
    users {
      id
      name
      instance_role {
        id
        name
      }
    }
  }
`;

/**
 * __useUsersQuery__
 *
 * To run a query within a React component, call `useUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useUsersQuery(
  baseOptions?: Apollo.QueryHookOptions<UsersQuery, UsersQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<UsersQuery, UsersQueryVariables>(
    UsersDocument,
    options,
  );
}
export function useUsersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<UsersQuery, UsersQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<UsersQuery, UsersQueryVariables>(
    UsersDocument,
    options,
  );
}
export type UsersQueryHookResult = ReturnType<typeof useUsersQuery>;
export type UsersLazyQueryHookResult = ReturnType<typeof useUsersLazyQuery>;
export type UsersQueryResult = Apollo.QueryResult<
  UsersQuery,
  UsersQueryVariables
>;
export const CreateVenueDocument = gql`
  mutation createVenue($chapterId: Int!, $data: CreateVenueInputs!) {
    createVenue(chapterId: $chapterId, data: $data) {
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
 *      chapterId: // value for 'chapterId'
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
  mutation updateVenue(
    $venueId: Int!
    $chapterId: Int!
    $data: UpdateVenueInputs!
  ) {
    updateVenue(venueId: $venueId, chapterId: $chapterId, data: $data) {
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
 *      venueId: // value for 'venueId'
 *      chapterId: // value for 'chapterId'
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
      chapter_id
      name
      street_address
      city
      postal_code
      region
      country
      latitude
      longitude
      chapter {
        id
        name
      }
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
  query venue($venueId: Int!) {
    venue(venueId: $venueId) {
      id
      name
      street_address
      city
      postal_code
      region
      country
      latitude
      longitude
      chapter {
        id
        name
        events {
          id
          name
          canceled
          invite_only
        }
      }
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
 *      venueId: // value for 'venueId'
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
  mutation rsvpToEvent($eventId: Int!, $chapterId: Int!) {
    rsvpEvent(eventId: $eventId, chapterId: $chapterId) {
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
 *      chapterId: // value for 'chapterId'
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
export const CancelRsvpDocument = gql`
  mutation cancelRsvp($eventId: Int!) {
    cancelRsvp(eventId: $eventId) {
      updated_at
    }
  }
`;
export type CancelRsvpMutationFn = Apollo.MutationFunction<
  CancelRsvpMutation,
  CancelRsvpMutationVariables
>;

/**
 * __useCancelRsvpMutation__
 *
 * To run a mutation, you first call `useCancelRsvpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelRsvpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelRsvpMutation, { data, loading, error }] = useCancelRsvpMutation({
 *   variables: {
 *      eventId: // value for 'eventId'
 *   },
 * });
 */
export function useCancelRsvpMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CancelRsvpMutation,
    CancelRsvpMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CancelRsvpMutation, CancelRsvpMutationVariables>(
    CancelRsvpDocument,
    options,
  );
}
export type CancelRsvpMutationHookResult = ReturnType<
  typeof useCancelRsvpMutation
>;
export type CancelRsvpMutationResult =
  Apollo.MutationResult<CancelRsvpMutation>;
export type CancelRsvpMutationOptions = Apollo.BaseMutationOptions<
  CancelRsvpMutation,
  CancelRsvpMutationVariables
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
export const PaginatedEventsWithTotalDocument = gql`
  query PaginatedEventsWithTotal($limit: Int, $offset: Int) {
    paginatedEventsWithTotal(limit: $limit, offset: $offset) {
      total
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
  }
`;

/**
 * __usePaginatedEventsWithTotalQuery__
 *
 * To run a query within a React component, call `usePaginatedEventsWithTotalQuery` and pass it any options that fit your needs.
 * When your component renders, `usePaginatedEventsWithTotalQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePaginatedEventsWithTotalQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function usePaginatedEventsWithTotalQuery(
  baseOptions?: Apollo.QueryHookOptions<
    PaginatedEventsWithTotalQuery,
    PaginatedEventsWithTotalQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    PaginatedEventsWithTotalQuery,
    PaginatedEventsWithTotalQueryVariables
  >(PaginatedEventsWithTotalDocument, options);
}
export function usePaginatedEventsWithTotalLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    PaginatedEventsWithTotalQuery,
    PaginatedEventsWithTotalQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    PaginatedEventsWithTotalQuery,
    PaginatedEventsWithTotalQueryVariables
  >(PaginatedEventsWithTotalDocument, options);
}
export type PaginatedEventsWithTotalQueryHookResult = ReturnType<
  typeof usePaginatedEventsWithTotalQuery
>;
export type PaginatedEventsWithTotalLazyQueryHookResult = ReturnType<
  typeof usePaginatedEventsWithTotalLazyQuery
>;
export type PaginatedEventsWithTotalQueryResult = Apollo.QueryResult<
  PaginatedEventsWithTotalQuery,
  PaginatedEventsWithTotalQueryVariables
>;
export const EventDocument = gql`
  query event($eventId: Int!) {
    event(eventId: $eventId) {
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
 *      eventId: // value for 'eventId'
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
      image_url
      events {
        id
        name
        start_at
      }
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
export const UnsubscribeDocument = gql`
  mutation unsubscribe($token: String!) {
    unsubscribe(token: $token)
  }
`;
export type UnsubscribeMutationFn = Apollo.MutationFunction<
  UnsubscribeMutation,
  UnsubscribeMutationVariables
>;

/**
 * __useUnsubscribeMutation__
 *
 * To run a mutation, you first call `useUnsubscribeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnsubscribeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unsubscribeMutation, { data, loading, error }] = useUnsubscribeMutation({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useUnsubscribeMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UnsubscribeMutation,
    UnsubscribeMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UnsubscribeMutation, UnsubscribeMutationVariables>(
    UnsubscribeDocument,
    options,
  );
}
export type UnsubscribeMutationHookResult = ReturnType<
  typeof useUnsubscribeMutation
>;
export type UnsubscribeMutationResult =
  Apollo.MutationResult<UnsubscribeMutation>;
export type UnsubscribeMutationOptions = Apollo.BaseMutationOptions<
  UnsubscribeMutation,
  UnsubscribeMutationVariables
>;

export interface PossibleTypesResultData {
  possibleTypes: {
    [key: string]: string[];
  };
}
const result: PossibleTypesResultData = {
  possibleTypes: {},
};
export default result;
