import { ChapterResolver } from './Chapter/resolver';
import { EventResolver } from './Events/resolver';
import { EmailResolver } from './Messages/resolver';
import { VenueResolver } from './Venue/resolver';
import { AuthResolver } from 'src/controllers/Auth/resolver';
import { UserResolver } from 'src/models';
import { UserChapterRoleResolver } from './UserChapterRole/resolver';
const resolvers = [
  ChapterResolver,
  VenueResolver,
  EventResolver,
  EmailResolver,
  AuthResolver,
  UserChapterRoleResolver,
  UserResolver, // Somehow extract this somewhere else
] as const;

export { resolvers };
