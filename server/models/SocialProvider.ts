import {
  Column,
  CreatedAt,
  Model,
  Table,
  UpdatedAt,
  PrimaryKey,
} from 'sequelize-typescript';
import { ISocialProvider } from 'types/models';

@Table
export class SocialProvider extends Model<ISocialProvider> {
  @PrimaryKey
  @Column
  id!: number;

  @Column
  name!: string;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;
}
