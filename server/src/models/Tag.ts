import { ObjectType, Field } from 'type-graphql';
import { BaseModel } from './BaseModel';

@ObjectType()
export class Tag extends BaseModel {
  @Field(() => String)
  name: string;
}
