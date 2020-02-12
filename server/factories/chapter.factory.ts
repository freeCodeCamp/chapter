import Faker from 'faker';
import { define } from 'typeorm-seeding';

import { Chapter } from 'server/models/Chapter';
import { User } from 'server/models/User';
import { Location } from 'server/models/Location';

define(Chapter, (
  faker: typeof Faker,
  params: { creator: User; location: Location },
) => {
  const { creator, location } = params;

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
    creator,
    location,
  });

  return chapter;
});
