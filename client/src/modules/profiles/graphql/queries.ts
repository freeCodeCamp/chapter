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
