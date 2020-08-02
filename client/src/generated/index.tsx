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
  locations: Array<Location>;
  location?: Maybe<Location>;
  venues: Array<Venue>;
  venue?: Maybe<Venue>;
};

export type QueryChapterArgs = {
  id: Scalars['Int'];
};

export type QueryLocationArgs = {
  id: Scalars['Int'];
};

export type QueryVenueArgs = {
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
  events: Array<Event>;
  location: Location;
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
  start_at: Scalars['DateTime'];
  ends_at: Scalars['DateTime'];
  canceled: Scalars['Boolean'];
  capacity: Scalars['Int'];
  sponsors: Array<EventSponsor>;
  venue: Venue;
  chapter: Chapter;
  rsvps: Array<Rsvp>;
  tags: Array<Tag>;
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
  location: Location;
};

export type Location = {
  __typename?: 'Location';
  id: Scalars['Int'];
  created_at: Scalars['DateTime'];
  updated_at: Scalars['DateTime'];
  country_code: Scalars['String'];
  city: Scalars['String'];
  region: Scalars['String'];
  postal_code: Scalars['String'];
  address?: Maybe<Scalars['String']>;
  venues: Array<Venue>;
  chapters: Array<Chapter>;
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
  createLocation: Location;
  updateLocation: Location;
  deleteLocation: Scalars['Boolean'];
  createVenue: Venue;
  updateVenue: Venue;
  deleteVenue: Scalars['Boolean'];
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

export type MutationCreateLocationArgs = {
  data: CreateLocationInputs;
};

export type MutationUpdateLocationArgs = {
  data: UpdateLocationInputs;
  id: Scalars['Int'];
};

export type MutationDeleteLocationArgs = {
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

export type CreateChapterInputs = {
  name: Scalars['String'];
  description: Scalars['String'];
  category: Scalars['String'];
  locationId: Scalars['Int'];
};

export type UpdateChapterInputs = {
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  category?: Maybe<Scalars['String']>;
  locationId?: Maybe<Scalars['Int']>;
};

export type CreateLocationInputs = {
  country_code: Scalars['String'];
  city: Scalars['String'];
  region: Scalars['String'];
  postal_code: Scalars['String'];
  address?: Maybe<Scalars['String']>;
};

export type UpdateLocationInputs = {
  country_code?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  region?: Maybe<Scalars['String']>;
  postal_code?: Maybe<Scalars['String']>;
  address?: Maybe<Scalars['String']>;
};

export type CreateVenueInputs = {
  name: Scalars['String'];
  locationId: Scalars['Int'];
};

export type UpdateVenueInputs = {
  name?: Maybe<Scalars['String']>;
  locationId?: Maybe<Scalars['Int']>;
};

export type ChaptersQueryVariables = Exact<{ [key: string]: never }>;

export type ChaptersQuery = { __typename?: 'Query' } & {
  chapters: Array<{ __typename?: 'Chapter' } & Pick<Chapter, 'id' | 'name'>>;
};

export const ChaptersDocument = gql`
  query chapters {
    chapters {
      id
      name
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
