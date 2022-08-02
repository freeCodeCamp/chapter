import { events_venue_type_enum } from '@prisma/client';

export const mockEvent = {
  created_at: new Date('2022-06-01T15:19:24.874Z'),
  updated_at: new Date('2022-06-01T15:19:24.875Z'),
  id: 1,
  name: 'Marvin - Wisozk',
  description: 'eum incidunt nesciunt',
  url: 'https://common-jogging.info',
  streaming_url: null,
  venue_type: 'Physical' as events_venue_type_enum,
  start_at: new Date('2022-06-03T18:00:00.000Z'),
  ends_at: new Date('2022-06-03T18:00:00.000Z'),
  canceled: true,
  capacity: 193,
  invite_only: false,
  image_url: 'http://loremflickr.com/640/480/nature?15145',
  venue_id: 1,
  chapter_id: 1,
};

// All the authChecker needs to know is which chapter a given event belongs to:
export const events = [
  {
    id: 1,
    chapter_id: 1,
  },
  {
    id: 2,
    chapter_id: 1,
  },
  {
    id: 3,
    chapter_id: 2,
  },
  {
    id: 4,
    chapter_id: 3,
  },
];
