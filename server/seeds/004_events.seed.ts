import { Factory, Seeder } from 'typeorm-seeding';

import { Venue } from '../models/Venue';
import { Event } from '../models/Event';
import { Chapter } from '../models/Chapter';

export default class CreateEvents implements Seeder {
  public async run(factory: Factory): Promise<any> {
    const venue = await Venue.findOne();
    const chapter = await Chapter.findOne();

    await factory(Event)({ chapter, venue }).seedMany(2);
  }
}
