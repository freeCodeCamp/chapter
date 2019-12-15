import { Factory, Seeder } from 'typeorm-seeding';
import { Chapter } from '../models/Chapter';

export default class CreateChapters implements Seeder {
  public async run(factory: Factory): Promise<any> {
    await factory(Chapter)().seedMany(10);
  }
}
