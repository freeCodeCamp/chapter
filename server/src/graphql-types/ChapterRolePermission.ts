import { Field, ObjectType } from 'type-graphql';
import { ChapterPermission } from './ChapterPermission';

@ObjectType()
export class ChapterRolePermission {
  @Field(() => ChapterPermission)
  chapter_permission: ChapterPermission;
}
