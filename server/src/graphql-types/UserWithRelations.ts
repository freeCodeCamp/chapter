import { Field, ObjectType } from 'type-graphql';

import {
  Chapter,
  InstanceRole,
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

  @Field(() => InstanceRole)
  instance_role: InstanceRole;

  @Field(() => [UserEventRole])
  event_roles: UserEventRole[];
}
