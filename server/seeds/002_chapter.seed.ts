import { Factory, Seeder } from 'typeorm-seeding';

import { Chapter } from '../models/Chapter';
import { User } from '../models/User';
import { Location } from '../models/Location';

export default class CreateChapters implements Seeder {
  public async run(factory: Factory): Promise<any> {
    const creator = await User.findOne();
    const location = await Location.findOne();

    await factory(Chapter)({ creator, location }).seedMany(2);
  }
}
