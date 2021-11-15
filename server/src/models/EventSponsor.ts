import { ObjectType, Field, Int } from 'type-graphql';
import { BaseJunctionModel } from './BaseJunctionModel';
import { Event } from './Event';
import { Sponsor } from './Sponsor';

@ObjectType()
export class EventSponsor extends BaseJunctionModel {
  @Field(() => Int)
  sponsor_id!: number;

  @Field(() => Int)
  event_id!: number;

  @Field(() => Sponsor)
  sponsor!: Sponsor;

  @Field(() => Event)
  event!: Event;
}
