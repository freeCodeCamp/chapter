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

export const DASHBOARD_CHAPTER_USERS = gql`
  query dashboardChapterUsers($chapterId: Int!) {
    dashboardChapter(id: $chapterId) {
      chapter_users {
        user {
          id
          name
        }
        chapter_role {
          id
          name
        }
        subscribed
        is_bannable
      }
      user_bans {
        user {
          id
        }
      }
    }
  }
`;
