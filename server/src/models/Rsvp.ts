import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseModel } from './BaseModel';
import { Event } from './Event';
import { User } from './User';
import { ObjectType, Field } from 'type-graphql';

@ObjectType()
@Entity({ name: 'rsvps' })
export class Rsvp extends BaseModel {
  @Field(() => Date)
  @Column({ type: 'timestamp', nullable: false })
  date!: Date;

  @Field(() => Boolean)
  @Column({ nullable: false })
  on_waitlist!: boolean;

  @Field(() => Date)
  @Column({ type: 'timestamp', nullable: true })
  confirmed_at: Date | null;

  @Field(() => Event)
  @ManyToOne((_type) => Event, (event) => event.rsvps)
  @JoinColumn({ name: 'event_id' })
  event!: Event;

  @Field(() => User)
  @ManyToOne((_type) => User, (user) => user.rsvps)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  /*
  This indicates whether he user decided to cancel their RSVP.
  Defaults to False when the RSVP is created
 */
  @Field(() => Boolean)
  @Column({ nullable: false })
  canceled: boolean;

  /*
    This indicates whether he use wants to receive notifications about the event they RSVP'd to.
    Defaults to True when the RSVP is created
   */
  @Field(() => Boolean)
  @Column({ nullable: false })
  interested: boolean;

  constructor(params: {
    date: Date;
    on_waitlist: boolean;
    event: Event;
    user: User;
    interested?: boolean;
    confirmed_at: Date | null;
  }) {
    super();
    if (params) {
      const {
        date,
        on_waitlist,
        event,
        user,
        interested = true,
        confirmed_at,
      } = params;
      this.date = date;
      this.on_waitlist = on_waitlist;
      this.event = event;
      this.user = user;
      this.canceled = false;
      this.interested = interested;
      this.confirmed_at = confirmed_at;
    }
  }
}
