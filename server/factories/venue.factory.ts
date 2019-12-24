import Faker from 'faker';
import { define } from 'typeorm-seeding';

import { Location } from '../models/Location';
import { Venue } from '../models/Venue';

define(Venue, (faker: typeof Faker, params: { location: Location }) => {
  const name = faker.company.companyName();
  const { location } = params;

  const venue = new Venue({
    name,
    location,
  });

  return venue;
});
