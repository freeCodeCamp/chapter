import Faker from 'faker';
import { define } from 'typeorm-seeding';

import { EventSponsor } from 'server/models/EventSponsor';
import { Event } from 'server/models/Event';
import { Sponsor } from 'server/models/Sponsor';

define(EventSponsor, (
  _faker: typeof Faker,
  params: { event: Event; sponsor: Sponsor },
) => {
  const { event, sponsor } = params;

  const eventSponsor = new EventSponsor({
    sponsor,
    event,
  });

  return eventSponsor;
});
