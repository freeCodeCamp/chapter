import Faker from 'faker';
import { define } from 'typeorm-seeding';

import { EventSponsor } from '../models/EventSponsor';
import { Event } from '../models/Event';
import { Sponsor } from '../models/Sponsor';

define(EventSponsor, (
  _faker: typeof Faker,
  params: { event: Event; sponsor: Sponsor },
) => {
  const { event, sponsor } = params;

  const rsvp = new EventSponsor({
    sponsor,
    event,
  });

  return rsvp;
});
