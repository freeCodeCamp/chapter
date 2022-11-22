import { ObjectType, Field } from 'type-graphql';
import { BaseObject } from './BaseObject';
import { ChapterUser, EventUser, InstanceRole, UserBan } from '.';

@ObjectType()
export class User extends BaseObject {
  @Field(() => String)
  name: string;

  @Field(() => Boolean)
  auto_subscribe: boolean;

  @Field(() => String, { nullable: true })
  image_url?: string | null;
}

@ObjectType()
export class UserWithInstanceRole extends User {
  @Field(() => InstanceRole)
  instance_role: InstanceRole;
}

@ObjectType()
export class UserInformation extends UserWithInstanceRole {
  @Field(() => String)
  email: string;

  @Field(() => [UserBan])
  user_bans: UserBan[];

  @Field(() => [ChapterUser])
  user_chapters: ChapterUser[];

  @Field(() => [EventUser])
  user_events: EventUser[];
}
