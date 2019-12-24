import { Factory, Seeder } from 'typeorm-seeding';
import { Sponsor } from '../models/Sponsor';

export default class CreateSponsors implements Seeder {
  public async run(factory: Factory): Promise<any> {
    await factory(Sponsor)().seedMany(5);
  }
}
