import { Field, Int, ObjectType } from 'type-graphql';
import { BaseObject } from './BaseObject';
import { Rsvp, User, Event } from '.';

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

  @Field(() => Int)
  user_id: number;

  @Field(() => Int)
  event_id: number;

  @Field(() => Boolean)
  subscribed: boolean;
}

@ObjectType()
export class EventUserWithRole extends EventUser {
  @Field(() => EventRole)
  event_role: EventRole;
}

@ObjectType()
export class EventUserWithRelations extends EventUserWithRole {
  @Field(() => Rsvp)
  rsvp: Rsvp;

  @Field(() => User)
  user: User;
}

@ObjectType()
export class UserEvent extends EventUserWithRole {
  @Field(() => Rsvp)
  rsvp: Rsvp;

  @Field(() => Event)
  event: Event;
}
