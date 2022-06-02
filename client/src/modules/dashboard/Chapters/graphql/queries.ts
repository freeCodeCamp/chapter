import { gql } from '@apollo/client';

export const ChapterRoles = gql`
  query chapterRoles {
    chapterRoles {
      id
      name
    }
  }
`;
