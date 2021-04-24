import { ChapterResolver } from './Chapter/resolver';
import { VenueResolver } from './Venue/resolver';
import { EventResolver } from './Events/resolver';
import { EmailResolver } from './Messages/resolver';
import { AuthResolver } from 'server/controllers/Auth/resolver';

const resolvers = [
  ChapterResolver,
  VenueResolver,
  EventResolver,
  EmailResolver,
  AuthResolver,
] as const;

export { resolvers };
