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
    }
  }
`;

export const MyEventSubscription = gql`
  query myEventSubscription {
    myEventSubscription {
      id
      name
    }
  }
`;

export const MyChapterSubscription = gql`
  query myChapterSubscription {
    myChapterSubscription {
      id
      name
    }
  }
`;
