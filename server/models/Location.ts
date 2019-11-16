import {
  Column,
  CreatedAt,
  Model,
  Table,
  UpdatedAt,
  PrimaryKey,
} from 'sequelize-typescript';
import { ILocation } from 'types/models';

@Table
export class Location extends Model<ILocation> {
  @PrimaryKey
  @Column
  id!: number;

  @Column
  country_code!: string;

  @Column
  city!: string;

  @Column
  region!: string;

  @Column
  postal_code!: string;

  @CreatedAt
  @Column
  created_at: Date;

  @UpdatedAt
  @Column
  updated_at: Date;
}
