import { gql } from '@apollo/client';

export const DASHBOARD_EVENTS = gql`
  query dashboardEvents {
    dashboardEvents {
      id
      name
      canceled
      description
      url
      invite_only
      streaming_url
      start_at
      ends_at
      capacity
      venue_type
      venue {
        id
        name
      }
    }
  }
`;

export const DASHBOARD_EVENT = gql`
  query dashboardEvent($eventId: Int!) {
    dashboardEvent(id: $eventId) {
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
      calendar_event_id
      chapter {
        id
        name
        has_calendar
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
        }
        subscribed
      }
    }
  }
`;

export const Sponsors = gql`
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

export const ChapterVenues = gql`
  query chapterVenues($chapterId: Int!) {
    chapterVenues(chapterId: $chapterId) {
      id
      name
    }
  }
`;
