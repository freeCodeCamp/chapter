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
      logo_url
      banner_url
      chat_url
      has_calendar
      events {
        id
        name
        description
        start_at
        invite_only
        canceled
        image_url
      }
      chapter_tags {
        tag {
          id
          name
        }
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

export const DASHBOARD_CHAPTER_USERS = gql`
  query dashboardChapterUsers($chapterId: Int!) {
    dashboardChapter(id: $chapterId) {
      name
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
        user_id
      }
    }
  }
`;

export const testChapterCalendarAccess = gql`
  query testChapterCalendarAccess($chapterId: Int!) {
    testChapterCalendarAccess(id: $chapterId)
  }
`;
