import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Location } from 'server/models/Location';

define(Location, (faker: typeof Faker) => {
  const location = new Location({
    country_code: faker.address.countryCode(),
    city: faker.address.city(),
    region: faker.address.state(),
    postal_code: faker.address.zipCode(),
    address: Math.random() > 0.5 ? faker.address.streetAddress() : undefined,
  });

  return location;
});
