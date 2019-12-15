import { Factory, Seeder } from 'typeorm-seeding';
import { Location } from '../models/Location';

export default class CreateLocations implements Seeder {
  public async run(factory: Factory): Promise<any> {
    await factory(Location)().seedMany(3);
  }
}
