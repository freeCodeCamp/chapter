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
      auto_subscribe
      image_url
      user_chapters {
        chapter_id
        chapter_role {
          chapter_role_permissions {
            chapter_permission {
              name
            }
          }
        }
      }
      user_bans {
        chapter_id
      }
    }
  }
`;
