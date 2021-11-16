import { ObjectType, Field, Int } from 'type-graphql';
import { BaseJunctionModel } from './BaseJunctionModel';

@ObjectType()
export class Rsvp extends BaseJunctionModel {
  @Field(() => Int)
  user_id: number;

  @Field(() => Int)
  event_id: number;

  @Field(() => Date)
  date: Date;

  @Field(() => Boolean)
  on_waitlist: boolean;

  @Field(() => Date)
  confirmed_at: Date | null;

  @Field(() => Boolean)
  canceled: boolean;
}
