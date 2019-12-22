import Faker from 'faker';
import { define } from 'typeorm-seeding';

import { SocialProviderUser } from '../models/SocialProviderUser';
import { SocialProvider } from '../models/SocialProvider';
import { User } from '../models/User';

define(SocialProviderUser, (
  _faker: typeof Faker,
  params: { user: User; socialProvider: SocialProvider },
) => {
  const { user, socialProvider } = params;

  const user_ban = new SocialProviderUser({
    user,
    socialProvider,
  });

  return user_ban;
});
