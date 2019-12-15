import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Chapter } from '../models/Chapter';
import { Location } from '../models/Location';
import { User } from '../models/User';

define(Chapter, (faker: typeof Faker) => {
  const name = faker.company.companyName();
  const description = faker.lorem.words();
  const category = faker.lorem.word();
  const details = {
    email: faker.internet.email(),
  };
  const location = new Location({
    country_code: faker.address.countryCode(),
    city: faker.address.city(),
    region: faker.address.state(),
    postal_code: faker.address.zipCode(),
  });
  const creator = new User({
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    email: faker.internet.email(),
    password_digest: faker.internet.password(),
  });

  const chapter = new Chapter({
    name,
    description,
    category,
    details,
    location,
    creator,
  });
  return chapter;
});
