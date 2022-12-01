import { gql } from '@apollo/client';

export const userProfileQuery = gql`
  query userProfile {
    userInformation {
      id
      name
      email
      auto_subscribe
      image_url
      instance_role {
        name
      }
      user_chapters {
        chapter {
          id
          name
        }
      }
    }
  }
`;

export const userDownloadQuery = gql`
  query userDownload {
    userData {
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
        id
        name
        instance_role_permissions {
          instance_permission {
            name
          }
        }
      }
      user_bans {
        chapter_id
        user {
          id
          name
          auto_subscribe
        }
        user_id
        chapter {
          id
          name
          description
          category
          city
          region
          country
          creator_id
        }
      }
      user_chapters {
        subscribed
        chapter_role {
          id
          name
          chapter_role_permissions {
            chapter_permission {
              id
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
          creator_id
        }
        chapter_id
        joined_date
        user {
          id
          name
          auto_subscribe
        }
        user_id
      }
      user_events {
        subscribed
        event_id
        updated_at
        rsvp {
          id
          updated_at
          name
        }
        user {
          id
          name
          auto_subscribe
        }
        user_id
        rsvp {
          name
        }
        event_role {
          id
          name
          event_role_permissions {
            event_permission {
              id
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
