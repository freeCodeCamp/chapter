import { Field, Int, ObjectType } from 'type-graphql';
import { EventWithChapterAndVenue, User } from '.';

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

  @Field(() => EventWithChapterAndVenue)
  event: EventWithChapterAndVenue;

  @Field(() => Boolean)
  notifying: boolean;
}
