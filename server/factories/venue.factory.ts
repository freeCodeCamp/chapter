import Faker from 'faker';
import { define } from 'typeorm-seeding';

import { Location } from 'server/models/Location';
import { Venue } from 'server/models/Venue';

define(Venue, (faker: typeof Faker, params: { location: Location }) => {
  const name = faker.company.companyName();
  const { location } = params;

  const venue = new Venue({
    name,
    location,
  });

  return venue;
});
