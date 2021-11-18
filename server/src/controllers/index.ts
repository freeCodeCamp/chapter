import { ChapterResolver } from './Chapter/resolver';
import { EventResolver } from './Events/resolver';
import { EmailResolver } from './Messages/resolver';
import { SponsorResolver } from './Sponsors/resolver';
import { UserChapterRoleResolver } from './UserChapterRole/resolver';
import { VenueResolver } from './Venue/resolver';
import { AuthResolver } from 'src/controllers/Auth/resolver';
import { UserResolver } from 'src/graphql-types';
const resolvers = [
  ChapterResolver,
  VenueResolver,
  EventResolver,
  EmailResolver,
  AuthResolver,
  SponsorResolver,
  UserChapterRoleResolver,
  UserResolver, // Somehow extract this somewhere else
] as const;

export { resolvers };
