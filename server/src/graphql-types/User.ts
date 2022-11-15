import { ObjectType, Field } from 'type-graphql';
import { BaseObject } from './BaseObject';
import {
  ChapterUserWithRelations,
  ChapterUserWithRole,
  EventUser,
  InstanceRole,
  UserBan,
  UserBanWithRelations,
} from '.';

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
export class UserWithPermissions extends User {
  @Field(() => InstanceRole)
  instance_role: InstanceRole;

  @Field(() => [ChapterUserWithRole])
  user_chapters: ChapterUserWithRole[];

  @Field(() => [UserBan])
  user_bans: UserBan[];
}

@ObjectType()
export class UserInformation extends User {
  @Field(() => String)
  email: string;

  @Field(() => [UserBanWithRelations])
  user_bans: UserBanWithRelations[];

  @Field(() => [ChapterUserWithRelations])
  user_chapters: ChapterUserWithRelations[];

  @Field(() => InstanceRole)
  instance_role: InstanceRole;

  @Field(() => [EventUser])
  user_events: EventUser[];
}
