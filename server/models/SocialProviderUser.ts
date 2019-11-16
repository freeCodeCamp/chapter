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
  provider_id!: number;

  @Column
  provider_user_id!: string;

  @Column
  user_id!: number;

  @CreatedAt
  @Column
  created_at!: Date;

  @UpdatedAt
  @Column
  updated_at!: Date;
}
