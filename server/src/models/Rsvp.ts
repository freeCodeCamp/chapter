import { ObjectType, Field } from 'type-graphql';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseJunctionModel } from './BaseJunctionModel';
import { Event } from './Event';
import { User } from './User';

@ObjectType()
@Entity({ name: 'rsvps' })
export class Rsvp extends BaseJunctionModel {
  @Field(() => Date)
  @Column({ type: 'timestamp' })
  date!: Date;

  @Field(() => Boolean)
  @Column()
  on_waitlist!: boolean;

  @Field(() => Date)
  @Column({ type: 'timestamp', nullable: true })
  confirmed_at: Date | null;

  @Field(() => Event)
  @ManyToOne((_type) => Event, (event) => event.rsvps, { primary: true })
  @JoinColumn({ name: 'event_id' })
  event!: Event;

  @Field(() => User)
  @ManyToOne((_type) => User, (user) => user.rsvps, { primary: true })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  /*
  This indicates whether he user decided to cancel their RSVP.
  Defaults to False when the RSVP is created
 */
  @Field(() => Boolean)
  @Column()
  canceled: boolean;

  constructor(params: {
    date: Date;
    on_waitlist: boolean;
    event: Event;
    user: User;
    canceled?: boolean;
    confirmed_at: Date | null;
  }) {
    super();
    if (params) {
      const {
        date,
        on_waitlist,
        event,
        user,
        confirmed_at,
        canceled = false,
      } = params;
      this.date = date;
      this.on_waitlist = on_waitlist;
      this.event = event;
      this.user = user;
      this.canceled = canceled;
      this.confirmed_at = confirmed_at;
    }
  }
}
