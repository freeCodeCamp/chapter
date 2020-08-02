import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseModel } from './BaseModel';
import { Sponsor } from './Sponsor';
import { Event } from './Event';
import { ObjectType, Field } from 'type-graphql';

@ObjectType()
@Entity({ name: 'event_sponsors' })
export class EventSponsor extends BaseModel {
  @Field(() => Sponsor)
  @ManyToOne(
    _type => Sponsor,
    sponsor => sponsor.events,
  )
  @JoinColumn({ name: 'sponsor_id' })
  sponsor!: Sponsor;

  @Field(() => Event)
  @ManyToOne(
    _type => Event,
    event => event.sponsors,
  )
  @JoinColumn({ name: 'event_id' })
  event!: Event;

  constructor(params: { sponsor: Sponsor; event: Event }) {
    super();
    if (params) {
      const { sponsor, event } = params;
      this.sponsor = sponsor;
      this.event = event;
    }
  }
}
