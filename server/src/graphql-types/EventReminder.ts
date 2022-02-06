import { Field, Int, ObjectType } from 'type-graphql';
import { Event, User } from '.';

@ObjectType()
export class EventReminder {
  @Field(() => Int)
  user_id: number;

  @Field(() => Int)
  event_id: number;

  @Field(() => User)
  user: User;

  @Field(() => Event)
  event: Event;

  @Field(() => Boolean)
  notified: boolean;
}
