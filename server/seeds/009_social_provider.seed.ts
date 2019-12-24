import { Factory, Seeder } from 'typeorm-seeding';

import { SocialProvider } from '../models/SocialProvider';

export default class CreateSocialProvider implements Seeder {
  public async run(factory: Factory): Promise<any> {
    await factory(SocialProvider)().seedMany(5);
  }
}
