import { gql } from '@apollo/client';

export const updateChapterSettings = gql`
  mutation updateChapterSettings($data: ChapterSettingsInputs!) {
    updateChapterSettings(data: $data) {
      privacy_link
      terms_of_services_link
      code_of_conduct_link
    }
`;
