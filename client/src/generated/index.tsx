import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
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

export type Query = {
  __typename?: 'Query';
  chapters: Array<Chapter>;
  chapter?: Maybe<Chapter>;
  venues: Array<Venue>;
  venue?: Maybe<Venue>;
  events: Array<Event>;
  event?: Maybe<Event>;
};

export type QueryChapterArgs = {
  id: Scalars['Int'];
};

export type QueryVenueArgs = {
  id: Scalars['Int'];
};

export type QueryEventArgs = {
  id: Scalars['Int'];
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

export type Event = {
  __typename?: 'Event';
  id: Scalars['Int'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  name: Scalars['String'];
  description: Scalars['String'];
  url?: Maybe<Scalars['String']>;
  video_url?: Maybe<Scalars['String']>;
  start_at: Scalars['DateTime'];
  ends_at: Scalars['DateTime'];
  canceled: Scalars['Boolean'];
  capacity: Scalars['Int'];
  sponsors: Array<EventSponsor>;
  venue: Venue;
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

export type User = {
  __typename?: 'User';
  id: Scalars['Int'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  first_name: Scalars['String'];
  last_name: Scalars['String'];
  email: Scalars['String'];
  created_chapters: Array<Chapter>;
  rsvps: Array<Rsvp>;
  chapters: Array<UserChapterRole>;
  banned_chapters: Array<UserBan>;
  chapter_roles: Array<UserChapterRole>;
  instance_roles: Array<UserInstanceRole>;
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

export type UserBan = {
  __typename?: 'UserBan';
  id: Scalars['Int'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  user: User;
  chapter: Chapter;
};

export type UserInstanceRole = {
  __typename?: 'UserInstanceRole';
  user_id: Scalars['Int'];
  role_name: Scalars['String'];
  user: User;
};

export type Tag = {
  __typename?: 'Tag';
  id: Scalars['Int'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  name: Scalars['String'];
  event: Event;
};

export type Mutation = {
  __typename?: 'Mutation';
  createChapter: Chapter;
  updateChapter: Chapter;
  deleteChapter: Scalars['Boolean'];
  createVenue: Venue;
  updateVenue: Venue;
  deleteVenue: Scalars['Boolean'];
  createEvent: Event;
  updateEvent: Event;
  cancelEvent: Event;
  deleteEvent: Scalars['Boolean'];
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

export type CreateChapterInputs = {
  name: Scalars['String'];
  description: Scalars['String'];
  category: Scalars['String'];
  details?: Maybe<Scalars['String']>;
  city: Scalars['String'];
  region: Scalars['String'];
  country: Scalars['String'];
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

export type CreateEventInputs = {
  name: Scalars['String'];
  description: Scalars['String'];
  url?: Maybe<Scalars['String']>;
  video_url?: Maybe<Scalars['String']>;
  start_at: Scalars['DateTime'];
  ends_at: Scalars['DateTime'];
  capacity: Scalars['Float'];
  venueId: Scalars['Int'];
  chapterId: Scalars['Int'];
};

export type UpdateEventInputs = {
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  video_url?: Maybe<Scalars['String']>;
  start_at?: Maybe<Scalars['DateTime']>;
  ends_at?: Maybe<Scalars['DateTime']>;
  capacity?: Maybe<Scalars['Float']>;
  venueId?: Maybe<Scalars['Int']>;
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
      | 'capacity'
    > & {
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
        tags?: Maybe<Array<{ __typename?: 'Tag' } & Pick<Tag, 'id' | 'name'>>>;
        venue: { __typename?: 'Venue' } & Pick<
          Venue,
          | 'id'
          | 'name'
          | 'street_address'
          | 'city'
          | 'postal_code'
          | 'region'
          | 'country'
        >;
        rsvps: Array<
          { __typename?: 'Rsvp' } & Pick<Rsvp, 'id' | 'on_waitlist'> & {
              user: { __typename?: 'User' } & Pick<
                User,
                'id' | 'first_name' | 'last_name'
              >;
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
        venue: { __typename?: 'Venue' } & Pick<Venue, 'id'>;
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

export type ChaptersQueryVariables = Exact<{ [key: string]: never }>;

export type ChaptersQuery = { __typename?: 'Query' } & {
  chapters: Array<
    { __typename?: 'Chapter' } & Pick<Chapter, 'id' | 'name' | 'description'>
  >;
};

export const EventsDocument = gql`
  query events {
    events {
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
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    EventsQuery,
    EventsQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<EventsQuery, EventsQueryVariables>(
    EventsDocument,
    baseOptions,
  );
}
export function useEventsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    EventsQuery,
    EventsQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<EventsQuery, EventsQueryVariables>(
    EventsDocument,
    baseOptions,
  );
}
export type EventsQueryHookResult = ReturnType<typeof useEventsQuery>;
export type EventsLazyQueryHookResult = ReturnType<typeof useEventsLazyQuery>;
export type EventsQueryResult = ApolloReactCommon.QueryResult<
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
          first_name
          last_name
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
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    EventQuery,
    EventQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<EventQuery, EventQueryVariables>(
    EventDocument,
    baseOptions,
  );
}
export function useEventLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    EventQuery,
    EventQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<EventQuery, EventQueryVariables>(
    EventDocument,
    baseOptions,
  );
}
export type EventQueryHookResult = ReturnType<typeof useEventQuery>;
export type EventLazyQueryHookResult = ReturnType<typeof useEventLazyQuery>;
export type EventQueryResult = ApolloReactCommon.QueryResult<
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
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    EventVenuesQuery,
    EventVenuesQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<EventVenuesQuery, EventVenuesQueryVariables>(
    EventVenuesDocument,
    baseOptions,
  );
}
export function useEventVenuesLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    EventVenuesQuery,
    EventVenuesQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    EventVenuesQuery,
    EventVenuesQueryVariables
  >(EventVenuesDocument, baseOptions);
}
export type EventVenuesQueryHookResult = ReturnType<typeof useEventVenuesQuery>;
export type EventVenuesLazyQueryHookResult = ReturnType<
  typeof useEventVenuesLazyQuery
>;
export type EventVenuesQueryResult = ApolloReactCommon.QueryResult<
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
export type CreateEventMutationFn = ApolloReactCommon.MutationFunction<
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
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateEventMutation,
    CreateEventMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    CreateEventMutation,
    CreateEventMutationVariables
  >(CreateEventDocument, baseOptions);
}
export type CreateEventMutationHookResult = ReturnType<
  typeof useCreateEventMutation
>;
export type CreateEventMutationResult = ApolloReactCommon.MutationResult<
  CreateEventMutation
>;
export type CreateEventMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreateEventMutation,
  CreateEventMutationVariables
>;
export const CancelEventDocument = gql`
  mutation cancelEvent($id: Int!) {
    cancelEvent(id: $id) {
      id
      canceled
    }
  }
`;
export type CancelEventMutationFn = ApolloReactCommon.MutationFunction<
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
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CancelEventMutation,
    CancelEventMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    CancelEventMutation,
    CancelEventMutationVariables
  >(CancelEventDocument, baseOptions);
}
export type CancelEventMutationHookResult = ReturnType<
  typeof useCancelEventMutation
>;
export type CancelEventMutationResult = ApolloReactCommon.MutationResult<
  CancelEventMutation
>;
export type CancelEventMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CancelEventMutation,
  CancelEventMutationVariables
>;
export const DeleteEventDocument = gql`
  mutation deleteEvent($id: Int!) {
    deleteEvent(id: $id)
  }
`;
export type DeleteEventMutationFn = ApolloReactCommon.MutationFunction<
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
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    DeleteEventMutation,
    DeleteEventMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    DeleteEventMutation,
    DeleteEventMutationVariables
  >(DeleteEventDocument, baseOptions);
}
export type DeleteEventMutationHookResult = ReturnType<
  typeof useDeleteEventMutation
>;
export type DeleteEventMutationResult = ApolloReactCommon.MutationResult<
  DeleteEventMutation
>;
export type DeleteEventMutationOptions = ApolloReactCommon.BaseMutationOptions<
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
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    VenuesQuery,
    VenuesQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<VenuesQuery, VenuesQueryVariables>(
    VenuesDocument,
    baseOptions,
  );
}
export function useVenuesLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    VenuesQuery,
    VenuesQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<VenuesQuery, VenuesQueryVariables>(
    VenuesDocument,
    baseOptions,
  );
}
export type VenuesQueryHookResult = ReturnType<typeof useVenuesQuery>;
export type VenuesLazyQueryHookResult = ReturnType<typeof useVenuesLazyQuery>;
export type VenuesQueryResult = ApolloReactCommon.QueryResult<
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
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    VenueQuery,
    VenueQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<VenueQuery, VenueQueryVariables>(
    VenueDocument,
    baseOptions,
  );
}
export function useVenueLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    VenueQuery,
    VenueQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<VenueQuery, VenueQueryVariables>(
    VenueDocument,
    baseOptions,
  );
}
export type VenueQueryHookResult = ReturnType<typeof useVenueQuery>;
export type VenueLazyQueryHookResult = ReturnType<typeof useVenueLazyQuery>;
export type VenueQueryResult = ApolloReactCommon.QueryResult<
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
export type CreateVenueMutationFn = ApolloReactCommon.MutationFunction<
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
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateVenueMutation,
    CreateVenueMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    CreateVenueMutation,
    CreateVenueMutationVariables
  >(CreateVenueDocument, baseOptions);
}
export type CreateVenueMutationHookResult = ReturnType<
  typeof useCreateVenueMutation
>;
export type CreateVenueMutationResult = ApolloReactCommon.MutationResult<
  CreateVenueMutation
>;
export type CreateVenueMutationOptions = ApolloReactCommon.BaseMutationOptions<
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
export type UpdateVenueMutationFn = ApolloReactCommon.MutationFunction<
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
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UpdateVenueMutation,
    UpdateVenueMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    UpdateVenueMutation,
    UpdateVenueMutationVariables
  >(UpdateVenueDocument, baseOptions);
}
export type UpdateVenueMutationHookResult = ReturnType<
  typeof useUpdateVenueMutation
>;
export type UpdateVenueMutationResult = ApolloReactCommon.MutationResult<
  UpdateVenueMutation
>;
export type UpdateVenueMutationOptions = ApolloReactCommon.BaseMutationOptions<
  UpdateVenueMutation,
  UpdateVenueMutationVariables
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
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    ChaptersQuery,
    ChaptersQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<ChaptersQuery, ChaptersQueryVariables>(
    ChaptersDocument,
    baseOptions,
  );
}
export function useChaptersLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ChaptersQuery,
    ChaptersQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<ChaptersQuery, ChaptersQueryVariables>(
    ChaptersDocument,
    baseOptions,
  );
}
export type ChaptersQueryHookResult = ReturnType<typeof useChaptersQuery>;
export type ChaptersLazyQueryHookResult = ReturnType<
  typeof useChaptersLazyQuery
>;
export type ChaptersQueryResult = ApolloReactCommon.QueryResult<
  ChaptersQuery,
  ChaptersQueryVariables
>;
