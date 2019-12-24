import { Factory, Seeder } from 'typeorm-seeding';

import { Location } from '../models/Location';
import { Venue } from '../models/Venue';

export default class CreateVenues implements Seeder {
  public async run(factory: Factory): Promise<any> {
    const location = await Location.findOne();

    await factory(Venue)({ location }).seedMany(2);
  }
}
