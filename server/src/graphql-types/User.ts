import { ObjectType, Field } from 'type-graphql';
import { BaseObject } from './BaseObject';
import { Chapter, ChapterUser, EventUser, InstanceRole, UserBan } from '.';

@ObjectType()
export class User extends BaseObject {
  @Field(() => String)
  name: string;

  @Field(() => String)
  image_url: string;
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
