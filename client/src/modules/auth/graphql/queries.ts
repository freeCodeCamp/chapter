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
        has_calendar
      }
      auto_subscribe
      image_url
      user_bans {
        chapter_id
      }
      user_chapters {
        chapter_id
        chapter_role {
          chapter_role_permissions {
            chapter_permission {
              name
            }
          }
          name
        }
        subscribed
      }
      user_events {
        event_id
        event_role {
          event_role_permissions {
            event_permission {
              name
            }
          }
        }
        subscribed
      }
    }
  }
`;
