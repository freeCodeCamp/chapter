import { Factory, Seeder } from 'typeorm-seeding';

import { Chapter } from '../models/Chapter';
import { User } from '../models/User';
import { UserChapterRole } from '../models/UserChapterRole';

export default class CreateUserChapterRole implements Seeder {
  public async run(factory: Factory): Promise<any> {
    const user = await User.findOne();
    const chapter = await Chapter.findOne();

    await factory(UserChapterRole)({
      user,
      chapter,
      roleName: Math.random() > 0.5 ? 'organizer' : 'member',
    }).seedMany(5);
  }
}
