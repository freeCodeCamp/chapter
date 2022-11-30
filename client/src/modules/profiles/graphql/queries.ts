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
        chapter_role {
          name
        }
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
    userDownload {
      id
      name
      email
      auto_subscribe
      image_url
      instance_role {
        name
      }
      user_bans {
        chapter {
          name
        }
      }
      user_chapters {
        subscribed
        chapter_role {
          name
        }
        chapter {
          id
          name
        }
      }
      user_events {
        subscribed
        rsvp {
          name
        }
        event_role {
          name
        }
        event {
          id
          name
        }
      }
    }
  }
`;
