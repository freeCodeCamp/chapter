import {
  Column,
  CreatedAt,
  Model,
  Table,
  UpdatedAt,
  PrimaryKey,
  BelongsToMany,
} from 'sequelize-typescript';
import { ISocialProvider } from 'types/models';
import { User } from './User';
import { SocialProviderUser } from './SocialProviderUser';

@Table
export class SocialProvider extends Model<ISocialProvider> {
  @PrimaryKey
  @Column
  id!: number;

  @Column
  name!: string;

  @BelongsToMany(() => User, () => SocialProviderUser)
  users: User[];

  @CreatedAt
  @Column
  created_at!: Date;

  @UpdatedAt
  @Column
  updated_at!: Date;
}
