import { Field, ObjectType } from 'type-graphql';
import { BaseObject } from './BaseObject';

@ObjectType()
export class ChapterPermission extends BaseObject {
  @Field(() => String)
  name: string;
}
