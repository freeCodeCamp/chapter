import { ObjectType, Field } from 'type-graphql';
import { BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@ObjectType()
export class BaseJunctionModel extends BaseEntity {
  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;
}
