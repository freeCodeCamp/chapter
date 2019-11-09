import {
  Column,
  CreatedAt,
  Model,
  Table,
  UpdatedAt,
  PrimaryKey,
} from 'sequelize-typescript';
import { ISponsor } from 'types/models';

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
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;
}
