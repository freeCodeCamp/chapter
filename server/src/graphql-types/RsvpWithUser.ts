import { Field, ObjectType } from 'type-graphql';
import { User, Rsvp } from '.';

@ObjectType()
export class RsvpWithUser extends Rsvp {
  @Field(() => User)
  user: User;
}
