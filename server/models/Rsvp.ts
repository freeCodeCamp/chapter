import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseModel } from './BaseModel';
import { Event } from './Event';
import { User } from './User';

@Entity({ name: 'rsvps' })
export class Rsvp extends BaseModel {
  @Column({ type: 'timestamp', nullable: false })
  date!: Date;

  @Column({ nullable: false })
  on_waitlist!: boolean;

  @ManyToOne(
    _type => Event,
    event => event.rsvps,
  )
  @JoinColumn({ name: 'event_id' })
  event!: Event;

  @ManyToOne(
    _type => User,
    user => user.rsvps,
  )
  @JoinColumn({ name: 'user_id' })
  user!: User;

  constructor(params: {
    date: Date;
    on_waitlist: boolean;
    event: Event;
    user: User;
  }) {
    super();
    if (params) {
      const { date, on_waitlist, event, user } = params;
      this.date = date;
      this.on_waitlist = on_waitlist;
      this.event = event;
      this.user = user;
    }
  }
}
