import { gql } from '@apollo/client';

export const CALENDAR_INTEGRATION = gql`
  query calendarIntegrationStatus {
    calendarIntegrationStatus
  }
`;
