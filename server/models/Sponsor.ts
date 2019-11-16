import {
  Column,
  CreatedAt,
  Model,
  Table,
  UpdatedAt,
  PrimaryKey,
  BelongsToMany,
} from 'sequelize-typescript';
import { ISponsor } from 'types/models';
import { EventSponsor } from './EventSponsor';
import { Event } from './Event';

@Table
export class Sponsor extends Model<ISponsor> {
  @PrimaryKey
  @Column
  id!: number;

  @Column
  name!: string;

  @Column
  website!: string;

  @Column
  logoPath!: string;

  @Column
  type!: string;

  @CreatedAt
  @Column
  created_at!: Date;

  @UpdatedAt
  @Column
  updated_at!: Date;

  @BelongsToMany(() => Event, () => EventSponsor)
  events: Event[];
}
