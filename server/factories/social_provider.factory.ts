import Faker from 'faker';
import { define } from 'typeorm-seeding';

import { SocialProvider } from '../models/SocialProvider';

define(SocialProvider, (_faker: typeof Faker) => {
  const user_ban = new SocialProvider({
    name: 'gauth',
  });

  return user_ban;
});
