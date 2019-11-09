import {
  Column,
  CreatedAt,
  Model,
  Table,
  UpdatedAt,
  PrimaryKey,
} from 'sequelize-typescript';
import { IRsvp } from 'types/models';

@Table
export class Rsvp extends Model<IRsvp> {
  @PrimaryKey
  @Column
  userId!: number;

  @Column
  eventId!: number;

  @Column
  date: Date;

  @Column
  onWaitList: boolean;

  @CreatedAt
  @Column
  createdAt: Date;

  @UpdatedAt
  @Column
  updatedAt: Date;
}
