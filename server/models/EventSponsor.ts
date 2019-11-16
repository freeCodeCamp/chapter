import {
  Column,
  CreatedAt,
  Model,
  Table,
  UpdatedAt,
  ForeignKey,
} from 'sequelize-typescript';
import { IEventSponsor } from 'types/models';
import { Sponsor } from './Sponsor';
import { Event } from './Event';

@Table
export class EventSponsor extends Model<IEventSponsor> {
  @ForeignKey(() => Event)
  @Column
  event_id!: number;

  @ForeignKey(() => Sponsor)
  @Column
  sponsor_id!: number;

  @CreatedAt
  @Column
  created_at!: Date;

  @UpdatedAt
  @Column
  updated_at!: Date;
}
