import { gql } from '@apollo/client';

export const INSTANCE_SETTINGS = gql`
  query instanceSettings {
    instanceSettings {
      id
      policy_url
      terms_of_services_url
      code_of_conduct_url
    }
  }
`;
