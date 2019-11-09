import {
  Column,
  CreatedAt,
  Model,
  Table,
  UpdatedAt,
  DataType,
} from 'sequelize-typescript';

@Table({ tableName: 'chapters' })
export class Chapter extends Model<Chapter> {
  @Column
  name!: string;

  @Column
  description!: string;

  @Column
  category!: string;

  @Column(DataType.JSON)
  details: any;

  @CreatedAt
  @Column
  created_at!: Date;

  @UpdatedAt
  @Column
  updated_at!: Date;
}
