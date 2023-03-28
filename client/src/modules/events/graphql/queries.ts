import { gql } from '@apollo/client';
export const DATA_PAGINATED_EVENTS_TOTAL_QUERY = gql`
  query PaginatedEventsWithTotal(
    $limit: Int
    $offset: Int
    $showOnlyUpcoming: Boolean
  ) {
    paginatedEventsWithTotal(
      limit: $limit
      offset: $offset
      showOnlyUpcoming: $showOnlyUpcoming
    ) {
      total
      events {
        id
        name
        description
        start_at
        ends_at
        invite_only
        canceled
        image_url
        chapter {
          id
          name
          category
        }
        event_tags {
          tag {
            id
            name
          }
        }
      }
    }
  }
`;

export const EVENT = gql`
  query event($eventId: Int!) {
    event(id: $eventId) {
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
        attendance {
          name
        }
        user {
          id
          name
          image_url
        }
      }
      event_tags {
        tag {
          id
          name
        }
      }
    }
  }
`;
