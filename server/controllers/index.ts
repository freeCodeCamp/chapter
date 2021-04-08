import { ChapterResolver } from './Chapter/resolver';
import { VenueResolver } from './Venue/resolver';
import { EventResolver } from './Events/resolver';
import { EmailResolver } from './Messages/resolver';

const resolvers = [
  ChapterResolver,
  VenueResolver,
  EventResolver,
  EmailResolver,
] as const;

export { resolvers };
