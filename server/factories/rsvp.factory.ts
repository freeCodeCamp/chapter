import Faker from 'faker';
import { define } from 'typeorm-seeding';

import { Rsvp } from 'server/models/Rsvp';
import { Event } from 'server/models/Event';
import { User } from 'server/models/User';

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
