import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BaseModel } from './BaseModel';
import { EventSponsor } from './EventSponsor';
import { Venue } from './Venue';
import { Chapter } from './Chapter';
import { Rsvp } from './Rsvp';
import { Tag } from './Tag';

@Entity({ name: 'events' })
export class Event extends BaseModel {
  @Column({ nullable: false })
  name!: string;

  @Column({ nullable: false })
  description!: string;

  @Column({ type: 'timestamp' })
  start_at!: Date;

  @Column({ type: 'timestamp' })
  ends_at!: Date;

  @Column({ default: false })
  canceled!: boolean;

  @Column({ nullable: false })
  capacity!: number;

  @OneToMany(
    _type => EventSponsor,
    eventSponsor => eventSponsor.sponsor,
  )
  sponsors!: EventSponsor[];

  @ManyToOne(
    _type => Venue,
    venue => venue.events,
  )
  @JoinColumn({ name: 'venue_id' })
  venue!: Venue;

  @ManyToOne(
    _type => Chapter,
    chapter => chapter.events,
  )
  @JoinColumn({ name: 'chapter_id' })
  chapter!: Chapter;

  @OneToMany(
    _type => Rsvp,
    rsvp => rsvp.event,
  )
  rsvps!: Rsvp[];

  @OneToMany(
    _type => Tag,
    tag => tag.event,
  )
  tags!: Tag[];

  constructor(params: {
    name: string;
    description: string;
    start_at: Date;
    ends_at: Date;
    canceled: boolean;
    capacity: number;
    venue: Venue;
    chapter: Chapter;
  }) {
    super();
    if (params) {
      const {
        name,
        description,
        start_at,
        ends_at,
        canceled,
        capacity,
        venue,
        chapter,
      } = params;

      this.name = name;
      this.description = description;
      this.start_at = start_at;
      this.ends_at = ends_at;
      this.canceled = canceled;
      this.capacity = capacity;
      this.venue = venue;
      this.chapter = chapter;
    }
  }
}
