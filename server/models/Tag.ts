import { Column, Model, Table, PrimaryKey } from 'sequelize-typescript';
import { ITag } from 'types/models';

@Table
export class Tag extends Model<ITag> {
  @PrimaryKey
  @Column
  id!: number;

  @Column
  name!: string;
}
