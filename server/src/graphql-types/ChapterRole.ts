import { Field, ObjectType } from 'type-graphql';
import { BaseObject } from './BaseObject';

@ObjectType()
export class ChapterPermission extends BaseObject {
  @Field(() => String)
  name: string;
}

@ObjectType()
export class ChapterRolePermission {
  @Field(() => ChapterPermission)
  chapter_permission: ChapterPermission;
}

@ObjectType()
export class ChapterRole extends BaseObject {
  @Field(() => String)
  name: string;

  @Field(() => [ChapterRolePermission])
  chapter_role_permissions: ChapterRolePermission[];
}
