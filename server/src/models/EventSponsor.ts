import { ObjectType, Field, Int } from 'type-graphql';
import { Entity, ManyToOne, JoinColumn, PrimaryColumn, Unique } from 'typeorm';
import { BaseModel } from './BaseModel';
import { Event } from './Event';
import { Sponsor } from './Sponsor';

@ObjectType()
@Entity({ name: 'event_sponsors' })
@Unique(['sponsor_id', 'event_id'])
export class EventSponsor extends BaseModel {
  @Field(() => Int)
  @PrimaryColumn()
  sponsor_id!: number;

  @Field(() => Int)
  @PrimaryColumn()
  event_id!: number;

  @Field(() => Sponsor)
  @ManyToOne((_type) => Sponsor, (sponsor) => sponsor.events)
  @JoinColumn({ name: 'sponsor_id' })
  sponsor!: Sponsor;

  @Field(() => Event)
  @ManyToOne((_type) => Event, (event) => event.sponsors)
  @JoinColumn({ name: 'event_id' })
  event!: Event;

  constructor(params: { sponsorId: number; eventId: number }) {
    super();
    if (params) {
      this.sponsor_id = params.sponsorId;
      this.event_id = params.eventId;
    }
  }
}
