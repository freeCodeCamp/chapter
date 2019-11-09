import {
  Column,
  CreatedAt,
  Model,
  Table,
  UpdatedAt,
  PrimaryKey,
} from 'sequelize-typescript';
import { IUserChapter } from 'types/models';

@Table
export class UserChapter extends Model<IUserChapter> {
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
