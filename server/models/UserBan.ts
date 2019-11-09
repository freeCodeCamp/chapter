import {
  Column,
  CreatedAt,
  Model,
  Table,
  UpdatedAt,
  PrimaryKey,
} from 'sequelize-typescript';
import { IUserBan } from 'types/models';

@Table
export class UserBan extends Model<IUserBan> {
  @PrimaryKey
  @Column
  userId!: number;

  @Column
  chapterId!: number;

  @CreatedAt
  @Column
  createdAt: Date;

  @UpdatedAt
  @Column
  updatedAt: Date;
}
