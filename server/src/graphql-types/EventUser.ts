import { Field, ObjectType } from 'type-graphql';
import { BaseObject } from './BaseObject';
import { Rsvp, User } from '.';

@ObjectType()
export class EventPermission extends BaseObject {
  @Field(() => String)
  name: string;
}

@ObjectType()
export class EventRolePermission {
  @Field(() => EventPermission)
  event_permission: EventPermission;
}

@ObjectType()
export class EventRole extends BaseObject {
  @Field(() => String)
  name: string;

  @Field(() => [EventRolePermission])
  event_role_permissions: EventRolePermission[];
}

@ObjectType()
export class EventUser {
  @Field(() => Date)
  updated_at: Date;

  @Field(() => Boolean)
  subscribed: boolean;

  @Field(() => Rsvp)
  rsvp: Rsvp;

  @Field(() => EventRole)
  event_role: EventRole;

  @Field(() => User)
  user: User;
}

@ObjectType()
export class UserEvents {
  @Field(() => Boolean)
  subscribed: boolean;

  @Field(() => Rsvp)
  rsvp: Rsvp;

  @Field(() => EventRole)
  event_role: EventRole;

  @Field(() => Event)
  event: Event;
}
