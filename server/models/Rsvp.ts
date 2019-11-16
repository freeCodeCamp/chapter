import {
  Column,
  CreatedAt,
  Model,
  Table,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { IRsvp, IUser } from 'types/models';
import { Event } from './Event';
import { User } from './User';

@Table
export class Rsvp extends Model<IRsvp> {
  @ForeignKey(() => User)
  @Column
  user_id!: number;

  @BelongsTo(() => User)
  user: IUser;

  @ForeignKey(() => Event)
  @Column
  event_id: number;

  @BelongsTo(() => Event)
  event: Event;

  @Column
  date: Date;

  @Column
  on_waitlist: boolean;

  @CreatedAt
  @Column
  created_at: Date;

  @UpdatedAt
  @Column
  updated_at: Date;
}
