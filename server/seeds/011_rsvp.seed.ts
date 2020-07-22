import { Factory, Seeder } from 'typeorm-seeding';

import { Event } from '../models/Event';
import { User } from '../models/User';
import { Rsvp } from '../models/Rsvp';

export default class CreateRsvp implements Seeder {
  public async run(factory: Factory): Promise<any> {
    const user = await User.find();
    const event = await Event.findOne();

    await Promise.all(user.map(user => factory(Rsvp)({ user, event }).seed()));
  }
}
