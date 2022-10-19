import { gql } from '@apollo/client';

export const meQuery = gql`
  query me {
    me {
      id
      name
      instance_role {
        instance_role_permissions {
          instance_permission {
            name
          }
        }
      }
      admined_chapters {
        id
        name
      }
      image_url
    }
  }
`;
