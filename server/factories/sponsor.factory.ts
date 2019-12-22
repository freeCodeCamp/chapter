import Faker from 'faker';
import { define } from 'typeorm-seeding';

import { Sponsor } from '../models/Sponsor';

function randomEnum<T>(anEnum: T): T[keyof T] {
  const enumValues = (Object.keys(anEnum)
    .map(n => Number.parseInt(n))
    .filter(n => !Number.isNaN(n)) as unknown) as T[keyof T][];
  const randomIndex = Math.floor(Math.random() * enumValues.length);
  const randomEnumValue = anEnum[randomIndex];
  return randomEnumValue;
}

define(Sponsor, (faker: typeof Faker) => {
  const name = faker.company.companyName();
  const website = faker.internet.url();
  const logoPath = faker.system.commonFileName('png');
  enum SponsorType {
    'FOOD',
    'VENUE',
    'OTHER',
  }
  const type = String(randomEnum(SponsorType));

  const sponsor = new Sponsor({
    name,
    website,
    logoPath,
    type,
  });

  return sponsor;
});
