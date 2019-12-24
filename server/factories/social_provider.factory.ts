import Faker from 'faker';
import { define } from 'typeorm-seeding';

import { SocialProvider } from '../models/SocialProvider';

define(SocialProvider, (_faker: typeof Faker) => {
  const socialProvider = new SocialProvider({
    name: 'gauth',
  });

  return socialProvider;
});
