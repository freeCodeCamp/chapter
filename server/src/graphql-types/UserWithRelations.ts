import { Field, ObjectType } from 'type-graphql';

import { UserInstanceRole } from './UserInstanceRole';
import { Chapter, EventUser, Rsvp, User, UserBan, UserChapterRole } from '.';

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

  @Field(() => [EventUser])
  user_events: EventUser[];
}
