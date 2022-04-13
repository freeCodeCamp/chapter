import { UserResolver } from '../graphql-types';
import { AuthResolver } from './Auth/resolver';
import { ChapterResolver } from './Chapter/resolver';
import { EventResolver } from './Events/resolver';
import { EmailResolver } from './Messages/resolver';
import { SponsorResolver } from './Sponsors/resolver';
import { UnsubscribeResolver } from './Unsubscribe/resolver';
import { UserChapterRoleResolver } from './UserChapterRole/resolver';
import { VenueResolver } from './Venue/resolver';

const resolvers = [
  ChapterResolver,
  VenueResolver,
  EventResolver,
  EmailResolver,
  AuthResolver,
  SponsorResolver,
  UnsubscribeResolver,
  UserChapterRoleResolver,
  UserResolver, // Somehow extract this somewhere else
] as const;

export { resolvers };
