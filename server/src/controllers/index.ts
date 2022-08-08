import { AuthResolver } from './Auth/resolver';
import { ChapterResolver } from './Chapter/resolver';
import { EventResolver } from './Events/resolver';
import { EventRoleResolver } from './EventRole/resolver';
import { EventUserResolver } from './EventUser/resolver';
import { EmailResolver } from './Messages/resolver';
import { InstanceRoleResolver } from './InstanceRole/resolver';
import { SponsorResolver } from './Sponsors/resolver';
import { UnsubscribeResolver } from './Unsubscribe/resolver';
import { ChapterUserResolver } from './ChapterUser/resolver';
import { ChapterRoleResolver } from './ChapterRole/resolver';
import { VenueResolver } from './Venue/resolver';
import { UsersResolver } from './Users/resolver';

const resolvers = [
  ChapterResolver,
  VenueResolver,
  EventResolver,
  EventRoleResolver,
  EventUserResolver,
  EmailResolver,
  InstanceRoleResolver,
  AuthResolver,
  SponsorResolver,
  UnsubscribeResolver,
  ChapterUserResolver,
  ChapterRoleResolver,
  UsersResolver,
] as const;

export { resolvers };
