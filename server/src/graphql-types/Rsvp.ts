import { Field, ObjectType } from 'type-graphql';
import { BaseObject } from './BaseObject';

@ObjectType()
export class Attendance extends BaseObject {
  @Field(() => Date)
  updated_at: Date;

  @Field(() => String)
  name: string;
}
