import { ObjectType, Field } from 'type-graphql';
import { BaseObject } from './BaseObject';

@ObjectType()
export class Tag extends BaseObject {
  @Field(() => String)
  name: string;
}
