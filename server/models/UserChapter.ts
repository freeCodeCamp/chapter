import {
  Column,
  CreatedAt,
  Model,
  Table,
  UpdatedAt,
  ForeignKey,
} from 'sequelize-typescript';
import { IUserChapter } from 'types/models';
import { User } from './User';
import { Chapter } from './Chapter';

@Table
export class UserChapter extends Model<IUserChapter> {
  @ForeignKey(() => User)
  @Column
  user_id!: number;

  @ForeignKey(() => Chapter)
  @Column
  chapter_id!: number;

  @CreatedAt
  @Column
  created_at: Date;

  @UpdatedAt
  @Column
  updated_at: Date;
}
