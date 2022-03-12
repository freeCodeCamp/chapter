import { Field, ObjectType } from 'type-graphql';
import { BaseObject } from './BaseObject';
import { ChapterRolePermission } from './ChapterRolePermission';

@ObjectType()
export class ChapterRole extends BaseObject {
  @Field(() => String)
  name: string;

  @Field(() => [ChapterRolePermission])
  chapter_role_permissions: ChapterRolePermission[];
}
