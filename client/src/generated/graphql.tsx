import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
const defaultOptions = {};
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
  banned_users: Array<UserBan>;
  category: Scalars['String'];
  city: Scalars['String'];
  country: Scalars['String'];
  created_at: Scalars['DateTime'];
  creator: User;
  description: Scalars['String'];
  details: Scalars['String'];
  events: Array<Event>;
  id: Scalars['Int'];
  name: Scalars['String'];
  region: Scalars['String'];
  updated_at: Scalars['DateTime'];
  users: Array<UserChapterRole>;
};

export type CreateChapterInputs = {
  category: Scalars['String'];
  city: Scalars['String'];
  country: Scalars['String'];
  description: Scalars['String'];
  details?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  region: Scalars['String'];
};

export type CreateEventInputs = {
  capacity: Scalars['Float'];
  chapterId: Scalars['Int'];
  description: Scalars['String'];
  ends_at: Scalars['DateTime'];
  invite_only?: Maybe<Scalars['Boolean']>;
  name: Scalars['String'];
  start_at: Scalars['DateTime'];
  url?: Maybe<Scalars['String']>;
  venueId?: Maybe<Scalars['Int']>;
  venue_type?: Maybe<VenueType>;
  video_url?: Maybe<Scalars['String']>;
};

export type CreateVenueInputs = {
  city: Scalars['String'];
  country: Scalars['String'];
  latitude?: Maybe<Scalars['Float']>;
  longitude?: Maybe<Scalars['Float']>;
  name: Scalars['String'];
  postal_code: Scalars['String'];
  region: Scalars['String'];
  street_address?: Maybe<Scalars['String']>;
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
  chapter: Chapter;
  created_at: Scalars['DateTime'];
  description: Scalars['String'];
  ends_at: Scalars['DateTime'];
  id: Scalars['Int'];
  invite_only: Scalars['Boolean'];
  name: Scalars['String'];
  rsvps: Array<Rsvp>;
  sponsors: Array<EventSponsor>;
  start_at: Scalars['DateTime'];
  tags?: Maybe<Array<Tag>>;
  updated_at: Scalars['DateTime'];
  url?: Maybe<Scalars['String']>;
  user_roles: Array<UserEventRole>;
  venue?: Maybe<Venue>;
  venue_type: VenueType;
  video_url?: Maybe<Scalars['String']>;
};

export type EventSponsor = {
  __typename?: 'EventSponsor';
  created_at: Scalars['DateTime'];
  event: Event;
  id: Scalars['Int'];
  sponsor: Sponsor;
  updated_at: Scalars['DateTime'];
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
  confirmRsvp: Rsvp;
  createChapter: Chapter;
  createEvent: Event;
  createVenue: Venue;
  deleteChapter: Scalars['Boolean'];
  deleteEvent: Scalars['Boolean'];
  deleteRsvp: Scalars['Boolean'];
  deleteVenue: Scalars['Boolean'];
  login: LoginType;
  register: User;
  rsvpEvent?: Maybe<Rsvp>;
  sendEmail: Email;
  sendEventInvite: Scalars['Boolean'];
  updateChapter: Chapter;
  updateEvent: Event;
  updateVenue: Venue;
};

export type MutationAuthenticateArgs = {
  token: Scalars['String'];
};

export type MutationCancelEventArgs = {
  id: Scalars['Int'];
};

export type MutationConfirmRsvpArgs = {
  id: Scalars['Int'];
};

export type MutationCreateChapterArgs = {
  data: CreateChapterInputs;
};

export type MutationCreateEventArgs = {
  data: CreateEventInputs;
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
  id: Scalars['Int'];
};

export type MutationDeleteVenueArgs = {
  id: Scalars['Int'];
};

export type MutationLoginArgs = {
  data: LoginInput;
};

export type MutationRegisterArgs = {
  data: RegisterInput;
};

export type MutationRsvpEventArgs = {
  id: Scalars['Int'];
};

export type MutationSendEmailArgs = {
  data: SendEmailInputs;
};

export type MutationSendEventInviteArgs = {
  emailGroups?: Maybe<Array<Scalars['String']>>;
  id: Scalars['Int'];
};

export type MutationUpdateChapterArgs = {
  data: UpdateChapterInputs;
  id: Scalars['Int'];
};

export type MutationUpdateEventArgs = {
  data: UpdateEventInputs;
  id: Scalars['Int'];
};

export type MutationUpdateVenueArgs = {
  data: UpdateVenueInputs;
  id: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  chapter?: Maybe<Chapter>;
  chapters: Array<Chapter>;
  event?: Maybe<Event>;
  events: Array<Event>;
  me?: Maybe<User>;
  paginatedEvents: Array<Event>;
  venue?: Maybe<Venue>;
  venues: Array<Venue>;
};

export type QueryChapterArgs = {
  id: Scalars['Int'];
};

export type QueryEventArgs = {
  id: Scalars['Int'];
};

export type QueryEventsArgs = {
  limit?: Maybe<Scalars['Int']>;
  showAll?: Maybe<Scalars['Boolean']>;
};

export type QueryPaginatedEventsArgs = {
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
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
  canceled: Scalars['Boolean'];
  confirmed_at: Scalars['DateTime'];
  created_at: Scalars['DateTime'];
  date: Scalars['DateTime'];
  event: Event;
  id: Scalars['Int'];
  interested: Scalars['Boolean'];
  on_waitlist: Scalars['Boolean'];
  updated_at: Scalars['DateTime'];
  user: User;
};

export type SendEmailInputs = {
  html: Scalars['String'];
  subject: Scalars['String'];
  to: Array<Scalars['String']>;
};

export type Sponsor = {
  __typename?: 'Sponsor';
  created_at: Scalars['DateTime'];
  events: Array<EventSponsor>;
  id: Scalars['Int'];
  logo_path: Scalars['String'];
  name: Scalars['String'];
  type: Scalars['String'];
  updated_at: Scalars['DateTime'];
  website: Scalars['String'];
};

export type Tag = {
  __typename?: 'Tag';
  created_at: Scalars['DateTime'];
  event: Event;
  id: Scalars['Int'];
  name: Scalars['String'];
  updated_at: Scalars['DateTime'];
};

export type UpdateChapterInputs = {
  category?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  details?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  region?: Maybe<Scalars['String']>;
};

export type UpdateEventInputs = {
  capacity?: Maybe<Scalars['Float']>;
  description?: Maybe<Scalars['String']>;
  ends_at?: Maybe<Scalars['DateTime']>;
  invite_only?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  start_at?: Maybe<Scalars['DateTime']>;
  url?: Maybe<Scalars['String']>;
  venueId?: Maybe<Scalars['Int']>;
  venue_type?: Maybe<VenueType>;
  video_url?: Maybe<Scalars['String']>;
};

export type UpdateVenueInputs = {
  city?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  latitude?: Maybe<Scalars['Float']>;
  longitude?: Maybe<Scalars['Float']>;
  name?: Maybe<Scalars['String']>;
  postal_code?: Maybe<Scalars['String']>;
  region?: Maybe<Scalars['String']>;
  street_address?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  banned_chapters: Array<UserBan>;
  chapter_roles: Array<UserChapterRole>;
  chapters: Array<UserChapterRole>;
  created_at: Scalars['DateTime'];
  created_chapters: Array<Chapter>;
  email: Scalars['String'];
  event_roles: Array<UserEventRole>;
  first_name: Scalars['String'];
  id: Scalars['Int'];
  instance_roles: Array<UserInstanceRole>;
  last_name: Scalars['String'];
  name: Scalars['String'];
  rsvps: Array<Rsvp>;
  updated_at: Scalars['DateTime'];
};

export type UserBan = {
  __typename?: 'UserBan';
  chapter: Chapter;
  created_at: Scalars['DateTime'];
  id: Scalars['Int'];
  updated_at: Scalars['DateTime'];
  user: User;
};

export type UserChapterRole = {
  __typename?: 'UserChapterRole';
  chapter: Chapter;
  chapter_id: Scalars['Int'];
  created_at: Scalars['DateTime'];
  id: Scalars['Int'];
  interested: Scalars['Boolean'];
  role_name: Scalars['String'];
  updated_at: Scalars['DateTime'];
  user: User;
  user_id: Scalars['Int'];
};

export type UserEventRole = {
  __typename?: 'UserEventRole';
  created_at: Scalars['DateTime'];
  event: Event;
  event_id: Scalars['Int'];
  id: Scalars['Int'];
  role_name: Scalars['String'];
  updated_at: Scalars['DateTime'];
  user: User;
  user_id: Scalars['Int'];
};

export type UserInstanceRole = {
  __typename?: 'UserInstanceRole';
  role_name: Scalars['String'];
  user: User;
  user_id: Scalars['Int'];
};

export type Venue = {
  __typename?: 'Venue';
  city: Scalars['String'];
  country: Scalars['String'];
  created_at: Scalars['DateTime'];
  events: Array<Event>;
  id: Scalars['Int'];
  latitude?: Maybe<Scalars['Float']>;
  longitude?: Maybe<Scalars['Float']>;
  name: Scalars['String'];
  postal_code: Scalars['String'];
  region: Scalars['String'];
  street_address?: Maybe<Scalars['String']>;
  updated_at: Scalars['DateTime'];
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
  me?:
    | { __typename?: 'User'; id: number; first_name: string; last_name: string }
    | null
    | undefined;
};

export type ChapterQueryVariables = Exact<{
  id: Scalars['Int'];
}>;

export type ChapterQuery = {
  __typename?: 'Query';
  chapter?:
    | {
        __typename?: 'Chapter';
        id: number;
        name: string;
        description: string;
        details: string;
        category: string;
        city: string;
        region: string;
        country: string;
        events: Array<{
          __typename?: 'Event';
          id: number;
          name: string;
          description: string;
          start_at: any;
          invite_only: boolean;
          canceled: boolean;
          tags?:
            | Array<{ __typename?: 'Tag'; id: number; name: string }>
            | null
            | undefined;
        }>;
      }
    | null
    | undefined;
};

export type ChapterUsersQueryVariables = Exact<{
  id: Scalars['Int'];
}>;

export type ChapterUsersQuery = {
  __typename?: 'Query';
  chapter?:
    | {
        __typename?: 'Chapter';
        users: Array<{
          __typename?: 'UserChapterRole';
          interested: boolean;
          user: { __typename?: 'User'; name: string; email: string };
        }>;
      }
    | null
    | undefined;
};

export type ChaptersQueryVariables = Exact<{ [key: string]: never }>;

export type ChaptersQuery = {
  __typename?: 'Query';
  chapters: Array<{
    __typename?: 'Chapter';
    id: number;
    name: string;
    description: string;
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
  };
};

export type EventsQueryVariables = Exact<{ [key: string]: never }>;

export type EventsQuery = {
  __typename?: 'Query';
  events: Array<{
    __typename?: 'Event';
    id: number;
    name: string;
    canceled: boolean;
    description: string;
    url?: string | null | undefined;
    invite_only: boolean;
    video_url?: string | null | undefined;
    start_at: any;
    capacity: number;
    venue?:
      | { __typename?: 'Venue'; id: number; name: string }
      | null
      | undefined;
    tags?:
      | Array<{ __typename?: 'Tag'; id: number; name: string }>
      | null
      | undefined;
  }>;
};

export type EventQueryVariables = Exact<{
  id: Scalars['Int'];
}>;

export type EventQuery = {
  __typename?: 'Query';
  event?:
    | {
        __typename?: 'Event';
        id: number;
        name: string;
        description: string;
        url?: string | null | undefined;
        invite_only: boolean;
        video_url?: string | null | undefined;
        canceled: boolean;
        capacity: number;
        start_at: any;
        ends_at: any;
        chapter: { __typename?: 'Chapter'; id: number; name: string };
        tags?:
          | Array<{ __typename?: 'Tag'; id: number; name: string }>
          | null
          | undefined;
        venue?:
          | {
              __typename?: 'Venue';
              id: number;
              name: string;
              street_address?: string | null | undefined;
              city: string;
              postal_code: string;
              region: string;
              country: string;
            }
          | null
          | undefined;
        rsvps: Array<{
          __typename?: 'Rsvp';
          id: number;
          on_waitlist: boolean;
          user: { __typename?: 'User'; id: number; name: string };
        }>;
      }
    | null
    | undefined;
};

export type EventVenuesQueryVariables = Exact<{
  id: Scalars['Int'];
}>;

export type EventVenuesQuery = {
  __typename?: 'Query';
  event?:
    | {
        __typename?: 'Event';
        id: number;
        name: string;
        description: string;
        url?: string | null | undefined;
        video_url?: string | null | undefined;
        capacity: number;
        start_at: any;
        ends_at: any;
        tags?:
          | Array<{ __typename?: 'Tag'; id: number; name: string }>
          | null
          | undefined;
        venue?: { __typename?: 'Venue'; id: number } | null | undefined;
      }
    | null
    | undefined;
  venues: Array<{ __typename?: 'Venue'; id: number; name: string }>;
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
    url?: string | null | undefined;
    video_url?: string | null | undefined;
    capacity: number;
    tags?:
      | Array<{ __typename?: 'Tag'; id: number; name: string }>
      | null
      | undefined;
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
    url?: string | null | undefined;
    video_url?: string | null | undefined;
    capacity: number;
    tags?:
      | Array<{ __typename?: 'Tag'; id: number; name: string }>
      | null
      | undefined;
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
  deleteEvent: boolean;
};

export type ConfirmRsvpMutationVariables = Exact<{
  id: Scalars['Int'];
}>;

export type ConfirmRsvpMutation = {
  __typename?: 'Mutation';
  confirmRsvp: {
    __typename?: 'Rsvp';
    id: number;
    confirmed_at: any;
    on_waitlist: boolean;
  };
};

export type DeleteRsvpMutationVariables = Exact<{
  id: Scalars['Int'];
}>;

export type DeleteRsvpMutation = {
  __typename?: 'Mutation';
  deleteRsvp: boolean;
};

export type SendEventInviteMutationVariables = Exact<{
  id: Scalars['Int'];
  emailGroups?: Maybe<Array<Scalars['String']> | Scalars['String']>;
}>;

export type SendEventInviteMutation = {
  __typename?: 'Mutation';
  sendEventInvite: boolean;
};

export type VenuesQueryVariables = Exact<{ [key: string]: never }>;

export type VenuesQuery = {
  __typename?: 'Query';
  venues: Array<{
    __typename?: 'Venue';
    id: number;
    name: string;
    street_address?: string | null | undefined;
    city: string;
    postal_code: string;
    region: string;
    country: string;
    latitude?: number | null | undefined;
    longitude?: number | null | undefined;
  }>;
};

export type VenueQueryVariables = Exact<{
  id: Scalars['Int'];
}>;

export type VenueQuery = {
  __typename?: 'Query';
  venue?:
    | {
        __typename?: 'Venue';
        id: number;
        name: string;
        street_address?: string | null | undefined;
        city: string;
        postal_code: string;
        region: string;
        country: string;
        latitude?: number | null | undefined;
        longitude?: number | null | undefined;
      }
    | null
    | undefined;
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
    street_address?: string | null | undefined;
    city: string;
    postal_code: string;
    region: string;
    country: string;
    latitude?: number | null | undefined;
    longitude?: number | null | undefined;
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
    street_address?: string | null | undefined;
    city: string;
    postal_code: string;
    region: string;
    country: string;
    latitude?: number | null | undefined;
    longitude?: number | null | undefined;
  };
};

export type RsvpToEventMutationVariables = Exact<{
  eventId: Scalars['Int'];
}>;

export type RsvpToEventMutation = {
  __typename?: 'Mutation';
  rsvpEvent?: { __typename?: 'Rsvp'; id: number } | null | undefined;
};

export type HomeQueryVariables = Exact<{
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
}>;

export type HomeQuery = {
  __typename?: 'Query';
  paginatedEvents: Array<{
    __typename?: 'Event';
    id: number;
    name: string;
    description: string;
    invite_only: boolean;
    canceled: boolean;
    start_at: any;
    tags?:
      | Array<{ __typename?: 'Tag'; id: number; name: string }>
      | null
      | undefined;
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
    details: string;
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
export const ChapterDocument = gql`
  query chapter($id: Int!) {
    chapter(id: $id) {
      id
      name
      description
      details
      category
      city
      region
      country
      events {
        id
        name
        description
        start_at
        tags {
          id
          name
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
      users {
        user {
          name
          email
        }
        interested
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
export const ChaptersDocument = gql`
  query chapters {
    chapters {
      id
      name
      description
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
export const EventsDocument = gql`
  query events {
    events(showAll: true) {
      id
      name
      canceled
      description
      url
      invite_only
      video_url
      start_at
      capacity
      venue {
        id
        name
      }
      tags {
        id
        name
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
      video_url
      canceled
      capacity
      start_at
      ends_at
      chapter {
        id
        name
      }
      tags {
        id
        name
      }
      venue {
        id
        name
        street_address
        city
        postal_code
        region
        country
      }
      rsvps {
        id
        on_waitlist
        user {
          id
          name
        }
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
      video_url
      capacity
      start_at
      ends_at
      tags {
        id
        name
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
export const CreateEventDocument = gql`
  mutation createEvent($data: CreateEventInputs!) {
    createEvent(data: $data) {
      id
      name
      canceled
      description
      url
      video_url
      capacity
      tags {
        id
        name
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
      video_url
      capacity
      tags {
        id
        name
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
    deleteEvent(id: $id)
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
  mutation confirmRsvp($id: Int!) {
    confirmRsvp(id: $id) {
      id
      confirmed_at
      on_waitlist
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
 *      id: // value for 'id'
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
  mutation deleteRsvp($id: Int!) {
    deleteRsvp(id: $id)
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
 *      id: // value for 'id'
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
export const RsvpToEventDocument = gql`
  mutation rsvpToEvent($eventId: Int!) {
    rsvpEvent(id: $eventId) {
      id
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
export const HomeDocument = gql`
  query home($limit: Int, $offset: Int) {
    paginatedEvents(limit: $limit, offset: $offset) {
      id
      name
      description
      invite_only
      canceled
      start_at
      tags {
        id
        name
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
      details
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
