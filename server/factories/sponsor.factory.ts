import Faker from 'faker';
import { define } from 'typeorm-seeding';

import { Sponsor } from '../models/Sponsor';
import { SponsorTypes } from '../../types/SponsorTypes';
import { randomEnum } from '../util/Utilities';

define(Sponsor, (faker: typeof Faker) => {
  const name = faker.company.companyName();
  const website = faker.internet.url();
  const logoPath = faker.system.commonFileName('png');
  const type = String(randomEnum(SponsorTypes));

  const sponsor = new Sponsor({
    name,
    website,
    logoPath,
    type,
  });

  return sponsor;
});
