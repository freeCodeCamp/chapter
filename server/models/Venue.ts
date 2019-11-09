import {
  Column,
  CreatedAt,
  Model,
  Table,
  UpdatedAt,
  PrimaryKey,
} from 'sequelize-typescript';

@Table
export class Venue extends Model<Venue> {
  @PrimaryKey
  @Column
  id!: number;

  @Column
  name!: string;

  @Column
  locationId!: number;

  @CreatedAt
  @Column
  createdAt: Date;

  @UpdatedAt
  @Column
  updatedAt: Date;
}
