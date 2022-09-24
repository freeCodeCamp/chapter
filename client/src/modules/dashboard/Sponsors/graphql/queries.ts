import { gql } from '@apollo/client';

export const SPONSOR = gql`
  query sponsor($sponsorId: Int!) {
    sponsor(id: $sponsorId) {
      id
      name
      website
      logo_path
      type
      event_sponsors {
        id
        name
        invite_only
        canceled
      }
    }
  }
`;
