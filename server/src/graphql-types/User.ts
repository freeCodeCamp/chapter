import { ObjectType, Field, Resolver, Root, FieldResolver } from 'type-graphql';
import { BaseObject } from './BaseObject';
import {
  Chapter,
  ChapterUser,
  InstanceRole,
  Rsvp,
  UserBan,
  EventRole,
} from '.';

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

  @Field(() => [Rsvp])
  rsvps: Rsvp[];

  @Field(() => [UserBan])
  banned_chapters: UserBan[];

  @Field(() => [ChapterUser])
  chapter_users: ChapterUser[];

  @Field(() => [InstanceRole])
  instance_role: InstanceRole[];

  @Field(() => [EventRole])
  event_roles: EventRole[];
}
