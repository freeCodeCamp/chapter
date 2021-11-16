import { Field, Int, ObjectType } from 'type-graphql';
import { Event } from './Event';
import { User } from './User';

// TODO: Make this enum, similarly to UserChapterRole

type EventRoles = 'organizer' | 'attendee';

@ObjectType()
export class UserEventRole {
  @Field(() => Int)
  user_id: number;

  @Field(() => Int)
  event_id: number;

  @Field(() => User)
  user: User;

  @Field(() => Event)
  event: Event;

  @Field(() => String)
  role_name: EventRoles;

  @Field(() => Boolean)
  subscribed: boolean;
}
