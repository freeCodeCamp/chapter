import { ChapterResolver } from './Chapter/resolver';
import { VenueResolver } from './Venue/resolver';
import { EventResolver } from './Events/resolver';
import { EmailResolver } from './Messages/resolver';
import { AuthResolver } from 'server/controllers/Auth/resolver';
import { UserResolver } from 'server/models';
import { TagResolver } from './Tags/resolver';

const resolvers = [
  ChapterResolver,
  VenueResolver,
  EventResolver,
  EmailResolver,
  AuthResolver,
  TagResolver,

  UserResolver, // Somehow extract this somewhere else
] as const;

export { resolvers };
