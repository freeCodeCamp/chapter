import { Factory, Seeder } from 'typeorm-seeding';

import { Chapter } from '../models/Chapter';
import { User } from '../models/User';
import { UserBan } from '../models/UserBan';

export default class CreateUserBans implements Seeder {
  public async run(factory: Factory): Promise<any> {
    const user = await User.findOne();
    const chapter = await Chapter.findOne();

    await factory(UserBan)({ user, chapter }).seedMany(5);
  }
}
