import { gql } from '@apollo/client';

export const VENUES = gql`
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
