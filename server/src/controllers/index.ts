import { UserResolver } from '../graphql-types';
import { AuthResolver } from './Auth/resolver';
import { ChapterResolver } from './Chapter/resolver';
import { EventResolver } from './Events/resolver';
import { EventUserResolver } from './EventUser/resolver';
import { EmailResolver } from './Messages/resolver';
import { SponsorResolver } from './Sponsors/resolver';
import { ChapterUserResolver } from './ChapterUser/resolver';
import { ChapterRoleResolver } from './ChapterRole/resolver';
import { VenueResolver } from './Venue/resolver';

const resolvers = [
  ChapterResolver,
  VenueResolver,
  EventResolver,
  EventUserResolver,
  EmailResolver,
  AuthResolver,
  SponsorResolver,
  ChapterUserResolver,
  ChapterRoleResolver,
  UserResolver, // Somehow extract this somewhere else
] as const;

export { resolvers };
