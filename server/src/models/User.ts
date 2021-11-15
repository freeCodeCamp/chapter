import {
  ObjectType,
  Field,
  Resolver,
  Root,
  FieldResolver,
  Int,
} from 'type-graphql';
import { BaseModel } from './BaseModel';
import { Chapter } from './Chapter';
import { Rsvp } from './Rsvp';
import { UserBan } from './UserBan';
import { UserChapterRole } from './UserChapterRole';
import { UserEventRole } from './UserEventRole';
import { UserInstanceRole } from './UserInstanceRole';

@ObjectType()
export class User extends BaseModel {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  first_name!: string;

  @Field(() => String)
  last_name!: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  email!: string;

  @Field(() => [Chapter])
  created_chapters!: Chapter[];

  @Field(() => [Rsvp])
  rsvps!: Rsvp[];

  @Field(() => [UserChapterRole])
  chapters!: UserChapterRole[];

  @Field(() => [UserBan])
  banned_chapters!: UserBan[];

  @Field(() => [UserChapterRole])
  chapter_roles!: UserChapterRole[];

  @Field(() => [UserInstanceRole])
  instance_roles!: UserInstanceRole[];

  @Field(() => [UserEventRole])
  event_roles!: UserEventRole[];
}

@Resolver(() => User)
export class UserResolver {
  @FieldResolver()
  name(@Root() user: User) {
    return `${user.first_name} ${user.last_name}`;
  }
}
