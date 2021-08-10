import { ChapterResolver } from './Chapter/resolver';
import { VenueResolver } from './Venue/resolver';
import { EventResolver } from './Events/resolver';
import { EmailResolver } from './Messages/resolver';
import { AuthResolver } from 'src/controllers/Auth/resolver';
import { UserResolver } from 'models';

const resolvers = [
  ChapterResolver,
  VenueResolver,
  EventResolver,
  EmailResolver,
  AuthResolver,

  UserResolver, // Somehow extract this somewhere else
] as const;

export { resolvers };
