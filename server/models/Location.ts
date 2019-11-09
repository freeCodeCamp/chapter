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
  countryCode!: string;

  @Column
  city!: string;

  @Column
  region!: string;

  @Column
  postalCode!: string;

  @CreatedAt
  @Column
  createdAt: Date;

  @UpdatedAt
  @Column
  updatedAt: Date;
}
