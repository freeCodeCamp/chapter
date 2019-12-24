import { Factory, Seeder } from 'typeorm-seeding';

import { Event } from '../models/Event';
import { User } from '../models/User';
import { Rsvp } from '../models/Rsvp';

export default class CreateRsvp implements Seeder {
  public async run(factory: Factory): Promise<any> {
    const user = await User.findOne();
    const event = await Event.findOne();

    await factory(Rsvp)({ user, event }).seedMany(5);
  }
}
