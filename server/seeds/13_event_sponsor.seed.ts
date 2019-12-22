import { Factory, Seeder } from 'typeorm-seeding';

import { EventSponsor } from '../models/EventSponsor';
import { Event } from '../models/Event';
import { Sponsor } from '../models/Sponsor';

export default class CreateEventSponsor implements Seeder {
  public async run(factory: Factory): Promise<any> {
    const event = await Event.findOne();
    const sponsor = await Sponsor.findOne();

    await factory(EventSponsor)({ event, sponsor }).seedMany(5);
  }
}
