import { gql } from '@apollo/client';

export const DashboardEvents = gql`
  query events {
    events {
      id
      name
    }
  }
`;
