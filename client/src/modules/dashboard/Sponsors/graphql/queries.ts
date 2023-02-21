import { gql } from '@apollo/client';

export const DASHBOARD_SPONSOR = gql`
  query dashboardSponsor($sponsorId: Int!) {
    dashboardSponsor(id: $sponsorId) {
      id
      name
      website
      logo_path
      type
    }
  }
`;

export const SPONSOR_EVENTS = gql`
  query sponsorWithEvents($sponsorId: Int!) {
    sponsorWithEvents(sponsorId: $sponsorId) {
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
  }
`;
