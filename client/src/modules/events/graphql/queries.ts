import { gql } from '@apollo/client';
export const DATA_PAGINATED_EVENTS_TOTAL_QUERY = gql`
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
        chapter {
          id
          name
          category
        }
      }
    }
  }
`;

export const EVENT = gql`
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
          image_url
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
