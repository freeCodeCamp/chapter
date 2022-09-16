import { gql } from '@apollo/client';

export const UsersProfile = gql`
  query users_profile {
    users {
      id
      name
      email
      instance_role {
        id
        name
      }
      admined_chapters {
        id
        name
      }
    }
  }
`;
