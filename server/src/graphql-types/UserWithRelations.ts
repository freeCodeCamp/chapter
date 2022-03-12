import { Field, ObjectType } from 'type-graphql';

import { UserInstanceRole } from './UserInstanceRole';
import { Chapter, ChapterUser, Rsvp, User, UserBan, UserEventRole } from '.';

@ObjectType()
export class UserWithRelations extends User {
  @Field(() => [Chapter])
  created_chapters: Chapter[];

  @Field(() => [Rsvp])
  rsvps: Rsvp[];

  @Field(() => [UserBan])
  banned_chapters: UserBan[];

  @Field(() => [UserInstanceRole])
  instance_roles: UserInstanceRole[];

  @Field(() => [UserEventRole])
  event_roles: UserEventRole[];

  @Field(() => [ChapterUser])
  user_chapters: ChapterUser[];
}
