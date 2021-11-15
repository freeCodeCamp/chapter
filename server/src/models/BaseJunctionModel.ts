import { ObjectType, Field } from 'type-graphql';

// TODO: do the ObjectTypes that extend this need these fields? Can we just get
// rid of this?  Also, if we keep it, it should probably not be called a model.
@ObjectType()
export class BaseJunctionModel {
  @Field(() => Date)
  created_at!: Date;

  @Field(() => Date)
  updated_at!: Date;
}
