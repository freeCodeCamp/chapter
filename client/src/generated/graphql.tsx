import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
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
  id: Scalars['Int'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  name: Scalars['String'];
  description: Scalars['String'];
  category: Scalars['String'];
  details: Scalars['String'];
  city: Scalars['String'];
  region: Scalars['String'];
  country: Scalars['String'];
  events: Array<Event>;
  creator: User;
  users: Array<UserChapterRole>;
  banned_users: Array<UserBan>;
};

export type CreateChapterInputs = {
  name: Scalars['String'];
  description: Scalars['String'];
  category: Scalars['String'];
  details?: Maybe<Scalars['String']>;
  city: Scalars['String'];
  region: Scalars['String'];
  country: Scalars['String'];
};

export type CreateEventInputs = {
  name: Scalars['String'];
  description: Scalars['String'];
  url?: Maybe<Scalars['String']>;
  video_url?: Maybe<Scalars['String']>;
  venue_type?: Maybe<VenueType>;
  start_at: Scalars['DateTime'];
  ends_at: Scalars['DateTime'];
  capacity: Scalars['Float'];
  venueId?: Maybe<Scalars['Int']>;
  chapterId: Scalars['Int'];
};

export type CreateVenueInputs = {
  name: Scalars['String'];
  street_address?: Maybe<Scalars['String']>;
  city: Scalars['String'];
  postal_code: Scalars['String'];
  region: Scalars['String'];
  country: Scalars['String'];
  latitude?: Maybe<Scalars['Float']>;
  longitude?: Maybe<Scalars['Float']>;
};

export type Email = {
  __typename?: 'Email';
  ourEmail: Scalars['String'];
  emailList: Array<Scalars['String']>;
  subject: Scalars['String'];
  htmlEmail: Scalars['String'];
  backupText: Scalars['String'];
};

export type Event = {
  __typename?: 'Event';
  id: Scalars['Int'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  name: Scalars['String'];
  description: Scalars['String'];
  url?: Maybe<Scalars['String']>;
  video_url?: Maybe<Scalars['String']>;
  venue_type: VenueType;
  start_at: Scalars['DateTime'];
  ends_at: Scalars['DateTime'];
  canceled: Scalars['Boolean'];
  capacity: Scalars['Int'];
  sponsors: Array<EventSponsor>;
  venue?: Maybe<Venue>;
  chapter: Chapter;
  rsvps: Array<Rsvp>;
  tags?: Maybe<Array<Tag>>;
};

export type EventSponsor = {
  __typename?: 'EventSponsor';
  id: Scalars['Int'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  sponsor: Sponsor;
  event: Event;
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
  createChapter: Chapter;
  updateChapter: Chapter;
  deleteChapter: Scalars['Boolean'];
  createVenue: Venue;
  updateVenue: Venue;
  deleteVenue: Scalars['Boolean'];
  rsvpEvent?: Maybe<Rsvp>;
  createEvent: Event;
  updateEvent: Event;
  cancelEvent: Event;
  deleteEvent: Scalars['Boolean'];
  sendEmail: Email;
  register: User;
  login: LoginType;
  authenticate: AuthenticateType;
};

export type MutationCreateChapterArgs = {
  data: CreateChapterInputs;
};

export type MutationUpdateChapterArgs = {
  data: UpdateChapterInputs;
  id: Scalars['Int'];
};

export type MutationDeleteChapterArgs = {
  id: Scalars['Int'];
};

export type MutationCreateVenueArgs = {
  data: CreateVenueInputs;
};

export type MutationUpdateVenueArgs = {
  data: UpdateVenueInputs;
  id: Scalars['Int'];
};

export type MutationDeleteVenueArgs = {
  id: Scalars['Int'];
};

export type MutationRsvpEventArgs = {
  id: Scalars['Int'];
};

export type MutationCreateEventArgs = {
  data: CreateEventInputs;
};

export type MutationUpdateEventArgs = {
  data: UpdateEventInputs;
  id: Scalars['Int'];
};

export type MutationCancelEventArgs = {
  id: Scalars['Int'];
};

export type MutationDeleteEventArgs = {
  id: Scalars['Int'];
};

export type MutationSendEmailArgs = {
  data: SendEmailInputs;
};

export type MutationRegisterArgs = {
  data: RegisterInput;
};

export type MutationLoginArgs = {
  data: LoginInput;
};

export type MutationAuthenticateArgs = {
  token: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  chapters: Array<Chapter>;
  chapter?: Maybe<Chapter>;
  venues: Array<Venue>;
  venue?: Maybe<Venue>;
  events: Array<Event>;
  paginatedEvents: Array<Event>;
  event?: Maybe<Event>;
  me?: Maybe<User>;
};

export type QueryChapterArgs = {
  id: Scalars['Int'];
};

export type QueryVenueArgs = {
  id: Scalars['Int'];
};

export type QueryEventsArgs = {
  showAll?: Maybe<Scalars['Boolean']>;
  limit?: Maybe<Scalars['Int']>;
};

export type QueryPaginatedEventsArgs = {
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
};

export type QueryEventArgs = {
  id: Scalars['Int'];
};

export type RegisterInput = {
  first_name: Scalars['String'];
  last_name: Scalars['String'];
  email: Scalars['String'];
};

export type Rsvp = {
  __typename?: 'Rsvp';
  id: Scalars['Int'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  date: Scalars['DateTime'];
  on_waitlist: Scalars['Boolean'];
  event: Event;
  user: User;
  canceled: Scalars['Boolean'];
  interested: Scalars['Boolean'];
};

export type SendEmailInputs = {
  to: Array<Scalars['String']>;
  subject: Scalars['String'];
  html: Scalars['String'];
};

export type Sponsor = {
  __typename?: 'Sponsor';
  id: Scalars['Int'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  name: Scalars['String'];
  website: Scalars['String'];
  logo_path: Scalars['String'];
  type: Scalars['String'];
  events: Array<EventSponsor>;
};

export type Tag = {
  __typename?: 'Tag';
  id: Scalars['Int'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  name: Scalars['String'];
  event: Event;
};

export type UpdateChapterInputs = {
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  category?: Maybe<Scalars['String']>;
  details?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  region?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
};

export type UpdateEventInputs = {
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  video_url?: Maybe<Scalars['String']>;
  venue_type?: Maybe<VenueType>;
  start_at?: Maybe<Scalars['DateTime']>;
  ends_at?: Maybe<Scalars['DateTime']>;
  capacity?: Maybe<Scalars['Float']>;
  venueId?: Maybe<Scalars['Int']>;
};

export type UpdateVenueInputs = {
  name?: Maybe<Scalars['String']>;
  street_address?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  postal_code?: Maybe<Scalars['String']>;
  region?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  latitude?: Maybe<Scalars['Float']>;
  longitude?: Maybe<Scalars['Float']>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['Int'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  first_name: Scalars['String'];
  last_name: Scalars['String'];
  name: Scalars['String'];
  email: Scalars['String'];
  created_chapters: Array<Chapter>;
  rsvps: Array<Rsvp>;
  chapters: Array<UserChapterRole>;
  banned_chapters: Array<UserBan>;
  chapter_roles: Array<UserChapterRole>;
  instance_roles: Array<UserInstanceRole>;
};

export type UserBan = {
  __typename?: 'UserBan';
  id: Scalars['Int'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  user: User;
  chapter: Chapter;
};

export type UserChapterRole = {
  __typename?: 'UserChapterRole';
  id: Scalars['Int'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  user_id: Scalars['Int'];
  chapter_id: Scalars['Int'];
  role_name: Scalars['String'];
  user: User;
  chapter: Chapter;
  interested: Scalars['Boolean'];
};

export type UserInstanceRole = {
  __typename?: 'UserInstanceRole';
  user_id: Scalars['Int'];
  role_name: Scalars['String'];
  user: User;
};

export type Venue = {
  __typename?: 'Venue';
  id: Scalars['Int'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  name: Scalars['String'];
  events: Array<Event>;
  street_address?: Maybe<Scalars['String']>;
  city: Scalars['String'];
  postal_code: Scalars['String'];
  region: Scalars['String'];
  country: Scalars['String'];
  latitude?: Maybe<Scalars['Float']>;
  longitude?: Maybe<Scalars['Float']>;
};

/** All possible venue types for an event */
export enum VenueType {
  Physical = 'Physical',
  Online = 'Online',
  PhysicalAndOnline = 'PhysicalAndOnline',
}

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
}>;

export type LoginMutation = { __typename?: 'Mutation' } & {
  login: { __typename?: 'LoginType' } & Pick<LoginType, 'code'>;
};

export type RegisterMutationVariables = Exact<{
  email: Scalars['String'];
  first_name: Scalars['String'];
  last_name: Scalars['String'];
}>;

export type RegisterMutation = { __typename?: 'Mutation' } & {
  register: { __typename?: 'User' } & Pick<User, 'id'>;
};

export type AuthenticateMutationVariables = Exact<{
  token: Scalars['String'];
}>;

export type AuthenticateMutation = { __typename?: 'Mutation' } & {
  authenticate: { __typename?: 'AuthenticateType' } & Pick<
    AuthenticateType,
    'token'
  > & {
      user: { __typename?: 'User' } & Pick<
        User,
        'id' | 'first_name' | 'last_name'
      >;
    };
};

export type MeQueryVariables = Exact<{ [key: string]: never }>;

export type MeQuery = { __typename?: 'Query' } & {
  me?: Maybe<
    { __typename?: 'User' } & Pick<User, 'id' | 'first_name' | 'last_name'>
  >;
};

export type ChapterQueryVariables = Exact<{
  id: Scalars['Int'];
}>;

export type ChapterQuery = { __typename?: 'Query' } & {
  chapter?: Maybe<
    { __typename?: 'Chapter' } & Pick<
      Chapter,
      'id' | 'name' | 'description'
    > & {
        events: Array<
          { __typename?: 'Event' } & Pick<
            Event,
            'id' | 'name' | 'description' | 'start_at'
          > & {
              tags?: Maybe<
                Array<{ __typename?: 'Tag' } & Pick<Tag, 'id' | 'name'>>
              >;
            }
        >;
      }
  >;
};

export type ChaptersQueryVariables = Exact<{ [key: string]: never }>;

export type ChaptersQuery = { __typename?: 'Query' } & {
  chapters: Array<
    { __typename?: 'Chapter' } & Pick<Chapter, 'id' | 'name' | 'description'>
  >;
};

export type EventsQueryVariables = Exact<{ [key: string]: never }>;

export type EventsQuery = { __typename?: 'Query' } & {
  events: Array<
    { __typename?: 'Event' } & Pick<
      Event,
      | 'id'
      | 'name'
      | 'canceled'
      | 'description'
      | 'url'
      | 'video_url'
      | 'start_at'
      | 'capacity'
    > & {
        venue?: Maybe<{ __typename?: 'Venue' } & Pick<Venue, 'id' | 'name'>>;
        tags?: Maybe<Array<{ __typename?: 'Tag' } & Pick<Tag, 'id' | 'name'>>>;
      }
  >;
};

export type EventQueryVariables = Exact<{
  id: Scalars['Int'];
}>;

export type EventQuery = { __typename?: 'Query' } & {
  event?: Maybe<
    { __typename?: 'Event' } & Pick<
      Event,
      | 'id'
      | 'name'
      | 'description'
      | 'url'
      | 'video_url'
      | 'canceled'
      | 'capacity'
      | 'start_at'
      | 'ends_at'
    > & {
        chapter: { __typename?: 'Chapter' } & Pick<Chapter, 'id' | 'name'>;
        tags?: Maybe<Array<{ __typename?: 'Tag' } & Pick<Tag, 'id' | 'name'>>>;
        venue?: Maybe<
          { __typename?: 'Venue' } & Pick<
            Venue,
            | 'id'
            | 'name'
            | 'street_address'
            | 'city'
            | 'postal_code'
            | 'region'
            | 'country'
          >
        >;
        rsvps: Array<
          { __typename?: 'Rsvp' } & Pick<Rsvp, 'id' | 'on_waitlist'> & {
              user: { __typename?: 'User' } & Pick<User, 'id' | 'name'>;
            }
        >;
      }
  >;
};

export type EventVenuesQueryVariables = Exact<{
  id: Scalars['Int'];
}>;

export type EventVenuesQuery = { __typename?: 'Query' } & {
  event?: Maybe<
    { __typename?: 'Event' } & Pick<
      Event,
      | 'id'
      | 'name'
      | 'description'
      | 'url'
      | 'video_url'
      | 'capacity'
      | 'start_at'
      | 'ends_at'
    > & {
        tags?: Maybe<Array<{ __typename?: 'Tag' } & Pick<Tag, 'id' | 'name'>>>;
        venue?: Maybe<{ __typename?: 'Venue' } & Pick<Venue, 'id'>>;
      }
  >;
  venues: Array<{ __typename?: 'Venue' } & Pick<Venue, 'id' | 'name'>>;
};

export type CreateEventMutationVariables = Exact<{
  data: CreateEventInputs;
}>;

export type CreateEventMutation = { __typename?: 'Mutation' } & {
  createEvent: { __typename?: 'Event' } & Pick<
    Event,
    | 'id'
    | 'name'
    | 'canceled'
    | 'description'
    | 'url'
    | 'video_url'
    | 'capacity'
  > & {
      tags?: Maybe<Array<{ __typename?: 'Tag' } & Pick<Tag, 'id' | 'name'>>>;
    };
};

export type UpdateEventMutationVariables = Exact<{
  id: Scalars['Int'];
  data: UpdateEventInputs;
}>;

export type UpdateEventMutation = { __typename?: 'Mutation' } & {
  updateEvent: { __typename?: 'Event' } & Pick<
    Event,
    | 'id'
    | 'name'
    | 'canceled'
    | 'description'
    | 'url'
    | 'video_url'
    | 'capacity'
  > & {
      tags?: Maybe<Array<{ __typename?: 'Tag' } & Pick<Tag, 'id' | 'name'>>>;
    };
};

export type CancelEventMutationVariables = Exact<{
  id: Scalars['Int'];
}>;

export type CancelEventMutation = { __typename?: 'Mutation' } & {
  cancelEvent: { __typename?: 'Event' } & Pick<Event, 'id' | 'canceled'>;
};

export type DeleteEventMutationVariables = Exact<{
  id: Scalars['Int'];
}>;

export type DeleteEventMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'deleteEvent'
>;

export type VenuesQueryVariables = Exact<{ [key: string]: never }>;

export type VenuesQuery = { __typename?: 'Query' } & {
  venues: Array<
    { __typename?: 'Venue' } & Pick<
      Venue,
      | 'id'
      | 'name'
      | 'street_address'
      | 'city'
      | 'postal_code'
      | 'region'
      | 'country'
      | 'latitude'
      | 'longitude'
    >
  >;
};

export type VenueQueryVariables = Exact<{
  id: Scalars['Int'];
}>;

export type VenueQuery = { __typename?: 'Query' } & {
  venue?: Maybe<
    { __typename?: 'Venue' } & Pick<
      Venue,
      | 'id'
      | 'name'
      | 'street_address'
      | 'city'
      | 'postal_code'
      | 'region'
      | 'country'
      | 'latitude'
      | 'longitude'
    >
  >;
};

export type CreateVenueMutationVariables = Exact<{
  data: CreateVenueInputs;
}>;

export type CreateVenueMutation = { __typename?: 'Mutation' } & {
  createVenue: { __typename?: 'Venue' } & Pick<
    Venue,
    | 'id'
    | 'name'
    | 'street_address'
    | 'city'
    | 'postal_code'
    | 'region'
    | 'country'
    | 'latitude'
    | 'longitude'
  >;
};

export type UpdateVenueMutationVariables = Exact<{
  id: Scalars['Int'];
  data: UpdateVenueInputs;
}>;

export type UpdateVenueMutation = { __typename?: 'Mutation' } & {
  updateVenue: { __typename?: 'Venue' } & Pick<
    Venue,
    | 'id'
    | 'name'
    | 'street_address'
    | 'city'
    | 'postal_code'
    | 'region'
    | 'country'
    | 'latitude'
    | 'longitude'
  >;
};

export type RsvpToEventMutationVariables = Exact<{
  eventId: Scalars['Int'];
}>;

export type RsvpToEventMutation = { __typename?: 'Mutation' } & {
  rsvpEvent?: Maybe<{ __typename?: 'Rsvp' } & Pick<Rsvp, 'id'>>;
};

export type HomeQueryVariables = Exact<{
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
}>;

export type HomeQuery = { __typename?: 'Query' } & {
  paginatedEvents: Array<
    { __typename?: 'Event' } & Pick<
      Event,
      'id' | 'name' | 'description' | 'start_at'
    > & {
        tags?: Maybe<Array<{ __typename?: 'Tag' } & Pick<Tag, 'id' | 'name'>>>;
        chapter: { __typename?: 'Chapter' } & Pick<
          Chapter,
          'id' | 'name' | 'category'
        >;
      }
  >;
  chapters: Array<
    { __typename?: 'Chapter' } & Pick<
      Chapter,
      'id' | 'name' | 'description' | 'category' | 'details'
    >
  >;
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
      events {
        id
        name
        description
        start_at
        tags {
          id
          name
        }
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
export const EventsDocument = gql`
  query events {
    events(showAll: true) {
      id
      name
      canceled
      description
      url
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
