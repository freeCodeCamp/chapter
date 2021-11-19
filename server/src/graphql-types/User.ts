import { ObjectType, Field, Resolver, Root, FieldResolver } from 'type-graphql';
import { BaseObject } from './BaseObject';
import { Chapter, ChapterUser, EventUser, InstanceRole, UserBan } from '.';
import { EventUserOnlyRoles } from './EventUser';

@ObjectType()
export class User extends BaseObject {
  @Field(() => String)
  first_name: string;

  @Field(() => String)
  last_name: string;

  @Field(() => String)
  email: string;
}

@Resolver(() => User)
export class UserResolver {
  @FieldResolver(() => String)
  name(@Root() user: User) {
    return `${user.first_name} ${user.last_name}`;
  }
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
export class UserWithRoles extends User {
  @Field(() => [ChapterUser])
  user_chapters: ChapterUser[];

  @Field(() => InstanceRole)
  instance_role: InstanceRole;

  @Field(() => [EventUserOnlyRoles])
  user_events: EventUserOnlyRoles[];
}
