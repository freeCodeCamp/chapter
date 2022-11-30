import { ObjectType, Field } from 'type-graphql';
import { BaseObject } from './BaseObject';
import {
  ChapterUserWithRelations,
  ChapterUserWithRole,
  EventUserWithRole,
  EventUserWithRelations,
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
export class UserInformation extends User {
  @Field(() => String)
  email: string;
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
export class UserDownload extends UserWithPermissions {
  @Field(() => String)
  email: string;

  @Field(() => [UserBanWithRelations])
  user_bans: UserBanWithRelations[];

  @Field(() => [ChapterUserWithRelations])
  user_chapters: ChapterUserWithRelations[];

  @Field(() => [EventUserWithRelations])
  user_events: EventUserWithRelations[];
}
