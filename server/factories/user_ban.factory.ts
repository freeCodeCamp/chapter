import Faker from 'faker';
import { define } from 'typeorm-seeding';

import { UserBan } from 'server/models/UserBan';
import { Chapter } from 'server/models/Chapter';
import { User } from 'server/models/User';

define(UserBan, (
  _faker: typeof Faker,
  params: { user: User; chapter: Chapter },
) => {
  const { user, chapter } = params;

  const userBan = new UserBan({
    user,
    chapter,
  });

  return userBan;
});
