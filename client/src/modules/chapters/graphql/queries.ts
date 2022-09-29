import { gql } from '@apollo/client';

export const CHAPTER = gql`
  query chapter($chapterId: Int!) {
    chapter(id: $chapterId) {
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

        invite_only
        canceled
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
          email
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

export const CHAPTER_USER = gql`
  query chapterUser($chapterId: Int!) {
    chapterUser(chapterId: $chapterId) {
      user {
        name
      }
      chapter_role {
        name
      }
      subscribed
    }
  }
`;

export const CHAPTERS = gql`
  query chapters {
    chapters {
      id
      name
      description
      category
      image_url
      events {
        id
        name
        start_at
      }
    }
  }
`;
