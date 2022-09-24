import { gql } from '@apollo/client';

export const SPONSOR = gql`
  query sponsor($sponsorId: Int!) {
    sponsor(id: $sponsorId) {
      id
      name
      website
      logo_path
      type
    }
  }
`;

export const SPONSOR_EVENTS = gql`
query sponsorEvents($sponsorId: Int!) {
  sponsor(id: $sponsorId) {
    id
    name
    website
    logo_path
    type
    event_sponsors {
      event {
        id
        name
        invite_only
        canceled
      }
    }
}
`;
