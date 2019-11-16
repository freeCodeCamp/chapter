import {
  Column,
  CreatedAt,
  Model,
  Table,
  UpdatedAt,
  DataType,
  PrimaryKey,
  HasOne,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { IChapter, ILocation, IUser, IUserBan, IEvent } from 'types/models';
import { Location } from './Location';
import { User } from './User';
import { UserBan } from './UserBan';
import { Event } from './Event';
import { UserChapter } from './UserChapter';

@Table
export class Chapter extends Model<IChapter> {
  @PrimaryKey
  @Column
  id!: number;

  @Column
  name!: string;

  @Column
  description!: string;

  @Column
  category!: string;

  @Column(DataType.JSON)
  details!: any;

  @Column
  creator_id!: number;

  @HasMany(() => Event)
  events!: IEvent[];

  @HasOne(() => Location)
  location!: ILocation;

  @BelongsToMany(() => User, () => UserChapter)
  users!: IUser[];

  @HasMany(() => UserBan)
  user_bans!: IUserBan[];

  @CreatedAt
  @Column
  created_at!: Date;

  @UpdatedAt
  @Column
  updated_at!: Date;
}
