import Faker from 'faker';
import { define } from 'typeorm-seeding';

import { UserBan } from '../models/UserBan';
import { Chapter } from '../models/Chapter';
import { User } from '../models/User';

define(UserBan, (
  _faker: typeof Faker,
  params: { user: User; chapter: Chapter },
) => {
  const { user, chapter } = params;

  const user_ban = new UserBan({
    user,
    chapter,
  });

  return user_ban;
});
