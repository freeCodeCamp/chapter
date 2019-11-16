import {
  Column,
  CreatedAt,
  Model,
  Table,
  UpdatedAt,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { IUserBan, IChapter } from 'types/models';
import { Chapter } from './Chapter';

@Table
export class UserBan extends Model<IUserBan> {
  @PrimaryKey
  @Column
  user_id!: number;

  @ForeignKey(() => Chapter)
  @Column
  chapter_id!: number;

  @BelongsTo(() => Chapter)
  chapter: IChapter;

  @CreatedAt
  @Column
  created_at: Date;

  @UpdatedAt
  @Column
  updated_at: Date;
}
