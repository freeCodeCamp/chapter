import { Factory, Seeder } from 'typeorm-seeding';

import { Tag } from '../models/Tag';
import { Event } from '../models/Event';

export default class CreateTags implements Seeder {
  public async run(factory: Factory): Promise<any> {
    const event = await Event.findOne();

    await factory(Tag)({ event }).seedMany(5);
  }
}
