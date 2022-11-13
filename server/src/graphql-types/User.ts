import { ObjectType, Field } from 'type-graphql';
import { BaseObject } from './BaseObject';
import { Chapter, ChapterUser, EventUser, InstanceRole, UserBan } from '.';

@ObjectType()
export class User extends BaseObject {
  @Field(() => String)
  name: string;

  @Field(() => Boolean)
  auto_subscribe: boolean;

  @Field(() => String, { nullable: true })
  image_url?: string | null;

  @Field(() => String, { nullable: true })
  email?: string | null;
}

@ObjectType()
export class UserWithInstanceRole extends User {
  @Field(() => InstanceRole)
  instance_role: InstanceRole;
}

@ObjectType()
export class UserWithRelations extends User {
  @Field(() => [Chapter])
  created_chapters: Chapter[];

  @Field(() => [UserBan])
  banned_chapters: UserBan[];

  @Field(() => [ChapterUser])
  chapter_users: ChapterUser[];

  @Field(() => [InstanceRole])
  instance_role: InstanceRole[];

  @Field(() => [EventUser])
  event_users: EventUser[];
}

@ObjectType()
export class UserInformation extends User {
  @Field(() => String)
  email: string;

  @Field(() => [UserBan])
  user_bans: UserBan[];

  @Field(() => [ChapterUser])
  user_chapters: ChapterUser[];

  @Field(() => InstanceRole)
  instance_role: InstanceRole;

  @Field(() => [EventUser])
  user_events: EventUser[];
}
