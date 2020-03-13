import Faker from 'faker';
import { define } from 'typeorm-seeding';

import { UserChapter } from 'server/models/UserChapter';
import { Chapter } from 'server/models/Chapter';
import { User } from 'server/models/User';

define(UserChapter, (
  _faker: typeof Faker,
  params: { user: User; chapter: Chapter },
) => {
  const { user, chapter } = params;

  const userChapter = new UserChapter({
    user,
    chapter,
  });

  return userChapter;
});
