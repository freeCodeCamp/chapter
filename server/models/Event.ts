import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { ObjectType, Field, Int, registerEnumType } from 'type-graphql';
import { BaseModel } from './BaseModel';
import { Venue } from './Venue';
import { Chapter } from './Chapter';
import { Tag } from './Tag';
import { EventSponsor } from './EventSponsor';
import { Rsvp } from './Rsvp';
import { User } from './User';

export enum VenueType {
  Physical = 'Physical',
  Online = 'Online',
  PhysicalAndOnline = 'PhysicalAndOnline',
}

registerEnumType(VenueType, {
  name: 'VenueType',
  description: 'All possible venue types for an event',
});

@ObjectType()
@Entity({ name: 'events' })
export class Event extends BaseModel {
  @Field(() => String)
  @Column({ nullable: false })
  name!: string;

  @Field(() => String)
  @Column({ nullable: false })
  description!: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  url?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  video_url?: string;

  @Field(() => VenueType)
  @Column({ type: 'enum', enum: VenueType, default: VenueType.Physical })
  venue_type!: VenueType;

  @Field(() => Date)
  @Column({ type: 'timestamp' })
  start_at!: Date;

  @Field(() => Date)
  @Column({ type: 'timestamp' })
  ends_at!: Date;

  @Field(() => Boolean)
  @Column({ default: false })
  canceled!: boolean;

  @Field(() => Int)
  @Column({ nullable: false })
  capacity!: number;

  @Field(() => [EventSponsor])
  @OneToMany((_type) => EventSponsor, (eventSponsor) => eventSponsor.sponsor, {
    onDelete: 'CASCADE',
  })
  sponsors!: EventSponsor[];

  @Field(() => Venue, { nullable: true })
  @ManyToOne((_type) => Venue, (venue) => venue.events, { nullable: true })
  @JoinColumn({ name: 'venue_id' })
  venue?: Venue;

  @Field(() => Chapter)
  @ManyToOne((_type) => Chapter, (chapter) => chapter.events)
  @JoinColumn({ name: 'chapter_id' })
  chapter!: Chapter;

  @Field(() => [Rsvp])
  @OneToMany((_type) => Rsvp, (rsvp) => rsvp.event, { onDelete: 'CASCADE' })
  rsvps!: Rsvp[];

  @Field(() => [Tag], { nullable: true })
  @OneToMany((_type) => Tag, (tag) => tag.event, { onDelete: 'CASCADE' })
  tags!: Tag[];

  @Field(() => [User])
  @ManyToMany((_type) => User, (user) => user.events_organized)
  @JoinTable({
    name: 'events_users',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'event_id' },
  })
  organizers!: User[];

  @Field(() => String)
  @Column({ nullable: false })
  image!: string;

  constructor(params: {
    name: string;
    description: string;
    url?: string;
    video_url?: string;
    venue_type: VenueType;
    start_at: Date;
    ends_at: Date;
    canceled?: boolean;
    capacity: number;
    venue?: Venue;
    chapter: Chapter;
    organizers: User[];
    image: string;
  }) {
    super();
    if (params) {
      const {
        name,
        description,
        url,
        video_url,
        venue_type,
        start_at,
        ends_at,
        canceled,
        capacity,
        venue,
        chapter,
        organizers,
        image,
      } = params;

      this.name = name;
      this.description = description;
      this.url = url;
      this.video_url = video_url;
      this.venue_type = venue_type;
      this.start_at = start_at;
      this.ends_at = ends_at;
      this.canceled = canceled || false;
      this.capacity = capacity;
      this.venue = venue;
      this.chapter = chapter;
      this.organizers = organizers;
      this.image = image;
    }
  }
}
