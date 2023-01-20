import { AuthResolver } from './Auth/resolver';
import { CalendarResolver } from './Calendar/resolver';
import { ChapterResolver } from './Chapter/resolver';
import { ChapterRoleResolver } from './ChapterRole/resolver';
import { ChapterUserResolver } from './ChapterUser/resolver';
import { EventResolver } from './Events/resolver';
import { EventRoleResolver } from './EventRole/resolver';
import { EventUserResolver } from './EventUser/resolver';
import { InstanceRoleResolver } from './InstanceRole/resolver';
import { SponsorResolver } from './Sponsors/resolver';
import { VenueResolver } from './Venue/resolver';
import { UnsubscribeResolver } from './Unsubscribe/resolver';
import { UsersResolver } from './Users/resolver';
import { UserWithPermissionsResolver } from './User/resolver';

const resolvers = [
  AuthResolver,
  CalendarResolver,
  ChapterResolver,
  ChapterRoleResolver,
  ChapterUserResolver,
  EventResolver,
  EventRoleResolver,
  EventUserResolver,
  InstanceRoleResolver,
  SponsorResolver,
  VenueResolver,
  UnsubscribeResolver,
  UsersResolver,
  UserWithPermissionsResolver,
] as const;

export { resolvers };
