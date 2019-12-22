import Faker from 'faker';
import { define } from 'typeorm-seeding';

import { UserChapter } from '../models/UserChapter';
import { Chapter } from '../models/Chapter';
import { User } from '../models/User';

define(UserChapter, (
  _faker: typeof Faker,
  params: { user: User; chapter: Chapter },
) => {
  const { user, chapter } = params;

  const user_chapter = new UserChapter({
    user,
    chapter,
  });

  return user_chapter;
});
