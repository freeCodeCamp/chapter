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
      banner_url
      chat_url
      events {
        id
        name
        description
        start_at
        invite_only
        canceled
        image_url
      }
    }
  }
`;

export const DASHBOARD_CHAPTERS = gql`
  query dashboardChapters {
    dashboardChapters {
      id
      name
      description
      banner_url
      city
      events {
        id
        name
        capacity
        venue {
          id
          name
          region
          street_address
        }
      }
    }
  }
`;
