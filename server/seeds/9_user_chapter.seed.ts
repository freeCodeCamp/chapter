import { Factory, Seeder } from 'typeorm-seeding';

import { Chapter } from '../models/Chapter';
import { User } from '../models/User';
import { UserChapter } from '../models/UserChapter';

export default class CreateUserChapter implements Seeder {
  public async run(factory: Factory): Promise<any> {
    const user = await User.findOne();
    const chapter = await Chapter.findOne();

    await factory(UserChapter)({ user, chapter }).seedMany(5);
  }
}
