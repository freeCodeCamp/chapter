import { ObjectType, Field } from 'type-graphql';
import { BaseObject } from './BaseObject';
import {
  ChapterUserWithRole,
  UserBan,
  EventUserWithRolePermissions,
  InstanceRole,
  UserChapter,
  UserEvent,
  UserBanChapters,
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
export class UserWithInstanceRole extends User {
  @Field(() => InstanceRole)
  instance_role: InstanceRole;
}

@ObjectType()
export class UserWithPermissions extends UserWithInstanceRole {
  @Field(() => [UserBan])
  user_bans: UserBan[];

  @Field(() => [ChapterUserWithRole])
  user_chapters: ChapterUserWithRole[];

  @Field(() => [EventUserWithRolePermissions])
  user_events: EventUserWithRolePermissions[];
}

@ObjectType()
export class UserProfile extends UserWithInstanceRole {
  @Field(() => String)
  email: string;
}

@ObjectType()
export class UserForDownload extends UserProfile {
  @Field(() => [UserBanChapters])
  user_bans: UserBanChapters[];

  @Field(() => [UserChapter])
  user_chapters: UserChapter[];

  @Field(() => [UserEvent])
  user_events: UserEvent[];
}
