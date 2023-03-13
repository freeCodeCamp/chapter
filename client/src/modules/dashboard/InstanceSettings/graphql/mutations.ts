import { gql } from '@apollo/client';

export const updateInstanceSettings = gql`
  mutation updateInstanceSettings($data: InstanceSettingsInputs!) {
    updateInstanceSettings(data: $data) {
      description
      policy_url
      terms_of_services_url
      code_of_conduct_url
      font_style
    }
  }
`;
