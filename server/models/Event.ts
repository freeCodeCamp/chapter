import {
  Column,
  CreatedAt,
  Model,
  Table,
  UpdatedAt,
  PrimaryKey,
  HasMany,
  HasOne,
  BelongsToMany,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { IEvent, ITag, IVenue, IRsvp, IChapter, ISponsor } from 'types/models';
import { EventSponsor } from './EventSponsor';
import { Tag } from './Tag';
import { Venue } from './Venue';
import { Rsvp } from './Rsvp';
import { Sponsor } from './Sponsor';
import { Chapter } from './Chapter';

@Table
export class Event extends Model<IEvent> {
  @PrimaryKey
  @Column
  id!: number;

  @Column
  name!: string;

  @Column
  description!: string;

  @Column
  start_at!: Date;

  @Column
  ends_at!: Date;

  @ForeignKey(() => Chapter)
  @Column
  chapter_id!: number;

  @BelongsTo(() => Chapter)
  chapter: IChapter;

  @Column
  venue_id!: number;

  @BelongsToMany(() => Sponsor, () => EventSponsor)
  sponsors: ISponsor[];

  @HasMany(() => Tag)
  tags: ITag[];

  @HasOne(() => Venue)
  venue: IVenue;

  @HasMany(() => Rsvp)
  rsvps: IRsvp[];

  @Column
  tag_id!: number;

  @Column
  canceled!: boolean;

  @Column
  capacity!: number;

  @CreatedAt
  @Column
  created_at: Date;

  @UpdatedAt
  @Column
  updated_at: Date;
}
