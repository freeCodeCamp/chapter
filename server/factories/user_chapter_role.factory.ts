import Faker from 'faker';
import { define } from 'typeorm-seeding';

import { Chapter } from 'server/models/Chapter';
import { User } from 'server/models/User';
import { UserChapterRole, ChapterRoles } from 'server/models/UserChapterRole';

define(UserChapterRole, (
  _faker: typeof Faker,
  params: { user: User; chapter: Chapter; roleName: ChapterRoles },
) => {
  const { user, chapter, roleName } = params;

  const userChapter = new UserChapterRole({
    userId: user.id,
    chapterId: chapter.id,
    roleName,
  });

  return userChapter;
});
