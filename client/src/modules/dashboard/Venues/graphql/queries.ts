import { gql } from '@apollo/client';

export const DASHBOARD_VENUES = gql`
  query dashboardVenues {
    dashboardVenues {
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

export const VENUE = gql`
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
