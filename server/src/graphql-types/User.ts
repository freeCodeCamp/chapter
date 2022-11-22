import { ObjectType, Field } from 'type-graphql';
import { BaseObject } from './BaseObject';
import { UserChapters, UserEvents, InstanceRole, UserBan } from '.';

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
export class UserInformation extends User {
  @Field(() => String)
  email: string;

  @Field(() => InstanceRole)
  instance_role: InstanceRole;

  @Field(() => [UserBan])
  user_bans: UserBan[];

  @Field(() => [UserChapters])
  user_chapters: UserChapters[];

  @Field(() => [UserEvents])
  user_events: UserEvents[];
}
