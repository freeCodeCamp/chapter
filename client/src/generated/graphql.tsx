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
  sendEmail: Email;
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

export type MutationSendEmailArgs = {
  data: SendEmailInputs;
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

export type HomePageQueryVariables = Exact<{ [key: string]: never }>;

export type HomePageQuery = { __typename?: 'Query' } & {
  events: Array<
    { __typename?: 'Event' } & Pick<Event, 'id' | 'name'> & {
        chapter: { __typename?: 'Chapter' } & Pick<Chapter, 'id' | 'name'>;
      }
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
export type CreateEventMutationResult = Apollo.MutationResult<CreateEventMutation>;
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
export type UpdateEventMutationResult = Apollo.MutationResult<UpdateEventMutation>;
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
export type CancelEventMutationResult = Apollo.MutationResult<CancelEventMutation>;
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
export type DeleteEventMutationResult = Apollo.MutationResult<DeleteEventMutation>;
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
export type CreateVenueMutationResult = Apollo.MutationResult<CreateVenueMutation>;
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
export type UpdateVenueMutationResult = Apollo.MutationResult<UpdateVenueMutation>;
export type UpdateVenueMutationOptions = Apollo.BaseMutationOptions<
  UpdateVenueMutation,
  UpdateVenueMutationVariables
>;
export const HomePageDocument = gql`
  query homePage {
    events {
      id
      name
      chapter {
        id
        name
      }
    }
  }
`;

/**
 * __useHomePageQuery__
 *
 * To run a query within a React component, call `useHomePageQuery` and pass it any options that fit your needs.
 * When your component renders, `useHomePageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHomePageQuery({
 *   variables: {
 *   },
 * });
 */
export function useHomePageQuery(
  baseOptions?: Apollo.QueryHookOptions<HomePageQuery, HomePageQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<HomePageQuery, HomePageQueryVariables>(
    HomePageDocument,
    options,
  );
}
export function useHomePageLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    HomePageQuery,
    HomePageQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<HomePageQuery, HomePageQueryVariables>(
    HomePageDocument,
    options,
  );
}
export type HomePageQueryHookResult = ReturnType<typeof useHomePageQuery>;
export type HomePageLazyQueryHookResult = ReturnType<
  typeof useHomePageLazyQuery
>;
export type HomePageQueryResult = Apollo.QueryResult<
  HomePageQuery,
  HomePageQueryVariables
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
