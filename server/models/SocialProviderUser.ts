import {
  Column,
  CreatedAt,
  Model,
  Table,
  UpdatedAt,
  PrimaryKey,
} from 'sequelize-typescript';
import { ISocialProviderUser } from 'types/models';

@Table
export class SocialProviderUser extends Model<ISocialProviderUser> {
  @PrimaryKey
  @Column
  id!: number;

  @Column
  providerId!: number;

  @Column
  providerUserId!: string;

  @Column
  userId!: number;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;
}
