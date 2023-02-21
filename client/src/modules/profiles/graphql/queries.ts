import { gql } from '@apollo/client';

export const userProfileQuery = gql`
  query userProfile {
    userProfile {
      id
      name
      email
      auto_subscribe
      image_url
      instance_role {
        name
      }
      admined_chapters {
        id
        name
      }
    }
  }
`;

export const userDownloadQuery = gql`
  query userDownload {
    userDownload {
      id
      name
      email
      auto_subscribe
      image_url
      admined_chapters {
        id
        name
        category
        city
        country
        creator_id
        description
        region
      }
      instance_role {
        name
        instance_role_permissions {
          instance_permission {
            name
          }
        }
      }
      user_bans {
        chapter_id
        chapter {
          id
          name
          description
          category
          city
          region
          country
        }
      }
      user_chapters {
        subscribed
        chapter_role {
          name
          chapter_role_permissions {
            chapter_permission {
              name
            }
          }
        }
        chapter {
          id
          name
          description
          category
          city
          region
          country
        }
        joined_date
      }
      user_events {
        subscribed
        updated_at
        attendance {
          updated_at
          name
        }
        event_role {
          name
          event_role_permissions {
            event_permission {
              name
            }
          }
        }
        event {
          id
          name
          canceled
          capacity
          description
          start_at
          ends_at
          image_url
          invite_only
          venue_type
        }
      }
    }
  }
`;
