import { Field, Int, ObjectType } from 'type-graphql';
import { EventWithEverything, User } from '.';

@ObjectType()
export class EventReminder {
  @Field(() => Int)
  user_id: number;

  @Field(() => Int)
  event_id: number;

  @Field(() => Date)
  remind_at: Date;

  @Field(() => User)
  user: User;

  @Field(() => EventWithEverything)
  event: Omit<EventWithEverything, 'sponsors' | 'rsvps' | 'tags'>;

  @Field(() => Boolean)
  notifying: boolean;
}
