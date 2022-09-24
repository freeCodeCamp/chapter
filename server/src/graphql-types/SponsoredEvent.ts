import { ObjectType, Field } from 'type-graphql';
import { BaseObject } from './BaseObject';
import { Event } from './Event';

@ObjectType()
export class SponsoredEvent extends BaseObject {
  @Field(() => [Event])
  events: Event;
}
