import { ObjectType, Field, Resolver, Root, FieldResolver } from 'type-graphql';
import { BaseObject } from './BaseObject';
import {
  Chapter,
  InstanceRole,
  Rsvp,
  UserBan,
  UserChapterRole,
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

  @Field(() => [UserChapterRole])
  chapters: UserChapterRole[];

  @Field(() => [UserBan])
  banned_chapters: UserBan[];

  @Field(() => [UserChapterRole])
  chapter_roles: UserChapterRole[];

  @Field(() => [InstanceRole])
  instance_role: InstanceRole[];

  @Field(() => [EventRole])
  event_roles: EventRole[];
}
