import { Field, Int, ObjectType } from 'type-graphql';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { BaseModel } from './BaseModel';
import { Event } from './Event';
import { User } from './User';

// TODO: Make this enum, similarly to UserChapterRole

type EventRoles = 'organizer';

@ObjectType()
@Entity({ name: 'user_event_roles' })
export class UserEventRole extends BaseModel {
  @Field(() => Int)
  @PrimaryColumn()
  user_id!: number;

  @Field(() => Int)
  @PrimaryColumn()
  event_id!: number;

  @Field(() => User)
  @ManyToOne(() => User, { primary: true })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Field(() => Event)
  @ManyToOne(() => Event, { primary: true })
  @JoinColumn({ name: 'event_id' })
  event!: Event;

  @Field(() => String)
  @PrimaryColumn({ type: 'text' })
  role_name!: EventRoles;

  constructor(params: {
    userId: number;
    eventId: number;
    roleName: EventRoles;
  }) {
    super();
    if (params) {
      this.user_id = params.userId;
      this.event_id = params.eventId;
      this.role_name = params.roleName;
    }
  }
}
