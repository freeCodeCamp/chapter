import Faker from 'faker';
import { define } from 'typeorm-seeding';

import { Tag } from 'server/models/Tag';
import { Event } from 'server/models/Event';

define(Tag, (faker: typeof Faker, params: { event: Event }) => {
  const { event } = params;

  const name = faker.company.companyName();

  const tag = new Tag({
    name,
    event,
  });

  return tag;
});
