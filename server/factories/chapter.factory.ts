import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Chapter } from '../models/Chapter';

define(Chapter, (faker: typeof Faker) => {
  const name = faker.company.companyName();
  const description = faker.lorem.words();
  const category = faker.lorem.word();
  const details = {
    email: faker.internet.email(),
  };

  const chapter = new Chapter({
    name,
    description,
    category,
    details,
  });
  return chapter;
});
