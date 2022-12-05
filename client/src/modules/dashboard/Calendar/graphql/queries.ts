import { gql } from '@apollo/client';

export const CALENDAR_INTEGRATION = gql`
  query calendarIntegrationStatus {
    calendarIntegrationStatus
  }
`;

export const TOKEN_STATUSES = gql`
  query tokenStatuses {
    tokenStatuses {
      email
      is_valid
    }
  }
`;
