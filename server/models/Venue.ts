import {
  Column,
  CreatedAt,
  Model,
  Table,
  UpdatedAt,
  PrimaryKey,
  HasOne,
} from 'sequelize-typescript';
import { Location } from './Location';
import { ILocation } from 'types/models';

@Table
export class Venue extends Model<Venue> {
  @PrimaryKey
  @Column
  id!: number;

  @Column
  name!: string;

  @Column
  location_id!: number;

  @HasOne(() => Location)
  location: ILocation;

  @CreatedAt
  @Column
  created_at: Date;

  @UpdatedAt
  @Column
  updated_at: Date;
}
