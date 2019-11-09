import {
  Column,
  CreatedAt,
  Model,
  Table,
  UpdatedAt,
  PrimaryKey,
} from 'sequelize-typescript';
import { IEvent } from 'types/models';

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
  startAt!: Date;

  @Column
  endsAt!: Date;

  @Column
  chapterId!: number;

  @Column
  venueId!: number;

  @Column
  tagId!: number;

  @Column
  canceled!: boolean;

  @Column
  capacity!: number;

  @CreatedAt
  @Column
  createdAt: Date;

  @UpdatedAt
  @Column
  updatedAt: Date;
}
