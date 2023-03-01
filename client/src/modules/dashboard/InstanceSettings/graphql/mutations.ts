import { gql } from '@apollo/client';

export const updateInstanceSettings = gql`
  mutation updateInstanceSettings($data: InstanceSettingsInputs!) {
    updateInstanceSettings(data: $data) {
      privacy_link
      terms_of_services_link
      code_of_conduct_link
    }
  }
`;
