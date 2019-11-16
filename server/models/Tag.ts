import {
  Column,
  Model,
  Table,
  PrimaryKey,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { ITag } from 'types/models';
import { Event } from './Event';

@Table
export class Tag extends Model<ITag> {
  @PrimaryKey
  @Column
  id!: number;

  @Column
  name!: string;

  // Below is not included in schema.png, but necessary for
  // one to many relationship with event
  @ForeignKey(() => Event)
  @Column
  event_id: number;

  @BelongsTo(() => Event)
  event: Event;
}
