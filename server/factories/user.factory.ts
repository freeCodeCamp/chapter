import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { User } from '../models/User';

define(User, (faker: typeof Faker) => {
  const user = new User({
    email: faker.internet.email(),
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
  });

  return user;
});
