import { ObjectType, Field, Int } from 'type-graphql';
import { BaseJunctionModel } from './BaseJunctionModel';
import { User } from './User';

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

  @Field(() => User)
  user: User;

  @Field(() => Boolean)
  canceled: boolean;
}
