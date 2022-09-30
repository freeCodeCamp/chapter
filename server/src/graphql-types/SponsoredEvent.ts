import { ObjectType, Field } from 'type-graphql';
import { Event } from './Event';

@ObjectType()
export class SponsoredEvent {
  @Field(() => Event)
  event: Event;
}
