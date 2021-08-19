import { ObjectType, Field, Int } from 'type-graphql';
import {
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
export class BaseModel extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;
}
