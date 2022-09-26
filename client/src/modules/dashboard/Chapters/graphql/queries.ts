import { gql } from '@apollo/client';

export const ChapterRoles = gql`
  query chapterRoles {
    chapterRoles {
      id
      name
    }
  }
`;

export const DASHBOARD_CHAPTER = gql`
  query dashboardChapter($chapterId: Int!) {
    dashboardChapter(id: $chapterId) {
      id
      name
      description
      category
      city
      region
      country
      image_url
      chat_url
      events {
        id
        name
        description
        start_at
        invite_only
        canceled
        image_url
        tags {
          tag {
            id
            name
          }
        }
      }
    }
  }
`;
