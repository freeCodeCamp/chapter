import { ObjectType, Field, Int } from 'type-graphql';
import { User } from '.';

@ObjectType()
export class Rsvp {
  @Field(() => Int)
  user_id: number;

  @Field(() => Int)
  event_id: number;

  @Field(() => Date)
  date: Date;

  @Field(() => Boolean)
  on_waitlist: boolean;

  @Field(() => Date, { nullable: true })
  confirmed_at: Date | null;

  @Field(() => Boolean)
  canceled: boolean;
}

@ObjectType()
export class RsvpWithUser extends Rsvp {
  @Field(() => User)
  user: User;
}
