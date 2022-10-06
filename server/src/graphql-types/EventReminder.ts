import { Field, Int, ObjectType } from 'type-graphql';
import { EventWithRelations, User } from '.';

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

  @Field(() => EventWithRelations)
  event: Omit<EventWithRelations, 'sponsors' | 'event_users'>;

  @Field(() => Boolean)
  notifying: boolean;
}
