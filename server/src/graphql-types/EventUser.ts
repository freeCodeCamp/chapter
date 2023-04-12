import { Field, Int, ObjectType } from 'type-graphql';
import { BaseObject } from './BaseObject';
import { Attendance, User, Event } from '.';

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
}

@ObjectType()
export class EventRoleWithPermissions extends EventRole {
  @Field(() => [EventRolePermission])
  event_role_permissions: EventRolePermission[];
}

@ObjectType()
export class EventUser {
  @Field(() => Date)
  updated_at: Date;

  @Field(() => Date)
  joined_date: Date;

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
export class EventUserWithRolePermissions extends EventUser {
  @Field(() => EventRoleWithPermissions)
  event_role: EventRoleWithPermissions;
}

@ObjectType()
export class EventUserWithRelations extends EventUserWithRole {
  @Field(() => Attendance)
  attendance: Attendance;

  @Field(() => User)
  user: User;
}

@ObjectType()
export class EventUserWithAttendanceAndUser extends EventUser {
  @Field(() => Attendance)
  attendance: Attendance;

  @Field(() => User)
  user: User;
}

@ObjectType()
export class UserEvent extends EventUserWithRolePermissions {
  @Field(() => Attendance)
  attendance: Attendance;

  @Field(() => Event)
  event: Event;
}
