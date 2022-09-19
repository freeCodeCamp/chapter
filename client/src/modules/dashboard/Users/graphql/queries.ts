import { gql } from '@apollo/client';

export const InstanceRoles = gql`
  query instanceRoles {
    instanceRoles {
      id
      name
    }
  }
`;

export const UserEventSubscription = gql`
  query userEventSubscription {
    userEventSubscription {
      id
      name
    }
  }
`;

export const UserChapterSubscription = gql`
  query userChapterSubscription {
    userChapterSubscription {
      id
      name
    }
  }
`;

export const Users = gql`
  query users {
    users {
      id
      name
      instance_role {
        id
        name
      }
    }
  }
`;
