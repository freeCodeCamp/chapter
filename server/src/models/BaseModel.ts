import { ObjectType, Field, Int } from 'type-graphql';
import { PrimaryGeneratedColumn } from 'typeorm';
import { BaseJunctionModel } from './BaseJunctionModel';

@ObjectType()
export class BaseModel extends BaseJunctionModel {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;
}
