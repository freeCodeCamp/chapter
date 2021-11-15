import { ObjectType, Field } from 'type-graphql';
import { BaseModel } from './BaseModel';
import { Event } from './Event';

@ObjectType()
export class Tag extends BaseModel {
  @Field(() => String)
  name!: string;

  @Field(() => Event)
  event!: Event;
}
