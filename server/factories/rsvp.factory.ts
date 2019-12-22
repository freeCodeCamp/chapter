import Faker from 'faker';
import { define } from 'typeorm-seeding';

import { Rsvp } from '../models/Rsvp';
import { Event } from '../models/Event';
import { User } from '../models/User';

define(Rsvp, (faker: typeof Faker, params: { user: User; event: Event }) => {
  const { user, event } = params;

  const date = faker.date.future();
  const on_waitlist = faker.random.boolean();

  const rsvp = new Rsvp({
    date,
    on_waitlist,
    user,
    event,
  });

  return rsvp;
});
