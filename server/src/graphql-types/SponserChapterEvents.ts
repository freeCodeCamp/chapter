import { ObjectType, Field } from 'type-graphql';
import { Event } from './Event';
import { BaseObject } from './BaseObject';

@ObjectType()
export class SponserChapterEvents extends BaseObject {
  @Field(() => Event)
  Event: Event;
}
