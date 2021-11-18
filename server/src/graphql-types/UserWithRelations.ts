import { Field, ObjectType } from 'type-graphql';

import { UserInstanceRole } from './UserInstanceRole';
import {
  Chapter,
  Rsvp,
  User,
  UserBan,
  UserChapterRole,
  UserEventRole,
} from '.';

@ObjectType()
export class UserWithRelations extends User {
  @Field(() => [Chapter])
  created_chapters: Chapter[];

  @Field(() => [Rsvp])
  rsvps: Rsvp[];

  @Field(() => [UserChapterRole])
  chapters: UserChapterRole[];

  @Field(() => [UserBan])
  banned_chapters: UserBan[];

  @Field(() => [UserChapterRole])
  chapter_roles: UserChapterRole[];

  @Field(() => [UserInstanceRole])
  instance_roles: UserInstanceRole[];

  @Field(() => [UserEventRole])
  event_roles: UserEventRole[];
}
