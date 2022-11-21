import { merge } from 'lodash/fp';

import { chapter_roles, chapter_users } from '@prisma/client';

import { ChapterRoles } from '../../../common/roles';

type UserChapter = chapter_users & {
  chapter_role: chapter_roles;
};

const baseChapterUser: UserChapter = {
  chapter_id: 1,
  chapter_role_id: 1,
  created_at: new Date(),
  joined_date: new Date(),
  subscribed: false,
  updated_at: new Date(),
  user_id: 1,
  chapter_role: {
    name: 'some-role',
    created_at: new Date(),
    updated_at: new Date(),
    id: 1,
  },
};

const administratorOfChapter1 = merge(baseChapterUser, {
  chapter_role: { name: ChapterRoles.administrator },
});

const administratorOfChapter2 = merge(baseChapterUser, {
  chapter_role: { name: ChapterRoles.administrator },
  chapter_id: 2,
});

const memberOfChapter1 = merge(baseChapterUser, {
  chapter_role: { name: ChapterRoles.member },
});
const memberOfChapter2 = merge(baseChapterUser, {
  chapter_role: { name: ChapterRoles.member },
  chapter_id: 2,
});

export const userChaptersWithChapter1Admin = [
  administratorOfChapter1,
  memberOfChapter2,
];
export const userChaptersWithChapter2Admin = [
  memberOfChapter1,
  administratorOfChapter2,
];
export const userChaptersWithTwoAdmins = [
  administratorOfChapter1,
  administratorOfChapter2,
];
export const userChaptersWithTwoMembers = [memberOfChapter1, memberOfChapter2];
