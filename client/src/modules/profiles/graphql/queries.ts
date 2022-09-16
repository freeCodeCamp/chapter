import { gql } from '@apollo/client';

export const CURRENT_USER_PROFILE = gql`
  query CurrentUserProfile {
    events {
      id
      name
      chapter {
        id
        name
      }
    }
  }
`;
