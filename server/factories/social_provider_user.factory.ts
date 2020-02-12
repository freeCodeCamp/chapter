import Faker from 'faker';
import { define } from 'typeorm-seeding';

import { SocialProviderUser } from 'server/models/SocialProviderUser';
import { SocialProvider } from 'server/models/SocialProvider';
import { User } from 'server/models/User';

define(SocialProviderUser, (
  _faker: typeof Faker,
  params: { user: User; socialProvider: SocialProvider },
) => {
  const { user, socialProvider } = params;

  const socialProviderUser = new SocialProviderUser({
    user,
    socialProvider,
  });

  return socialProviderUser;
});
