import { ObjectType, Field } from 'type-graphql';
import { BaseObject } from './BaseObject';
import {
  ChapterUserWithRole,
  EventUserWithRole,
  InstanceRole,
  UserBan,
  UserChapter,
  UserEvent,
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
export class UserForDownload extends User {
  @Field(() => String)
  email: string;

  @Field(() => InstanceRole)
  instance_role: InstanceRole;

  @Field(() => [UserChapter])
  user_chapters: UserChapter[];
}

@ObjectType()
export class UserWithPermissions extends User {
  @Field(() => InstanceRole)
  instance_role: InstanceRole;

  @Field(() => [UserBan])
  user_bans: UserBan[];

  @Field(() => [ChapterUserWithRole])
  user_chapters: ChapterUserWithRole[];

  @Field(() => [EventUserWithRole])
  user_events: EventUserWithRole[];
}

@ObjectType()
export class UserProfile extends UserWithPermissions {
  @Field(() => String)
  email: string;

  @Field(() => [UserBanWithRelations])
  user_bans: UserBanWithRelations[];

  @Field(() => [UserChapter])
  user_chapters: UserChapter[];

  @Field(() => [UserEvent])
  user_events: UserEvent[];
}
