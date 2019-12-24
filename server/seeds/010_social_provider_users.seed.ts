import { Factory, Seeder } from 'typeorm-seeding';

import { SocialProvider } from '../models/SocialProvider';
import { User } from '../models/User';
import { SocialProviderUser } from '../models/SocialProviderUser';

export default class CreateSocialProviderUser implements Seeder {
  public async run(factory: Factory): Promise<any> {
    const user = await User.findOne();
    const socialProvider = await SocialProvider.findOne();

    await factory(SocialProviderUser)({
      user,
      socialProvider,
    }).seedMany(5);
  }
}
