import { ObjectType, Field, Int } from 'type-graphql';
import { BaseJunctionModel } from './BaseJunctionModel';

// TODO: rename this? BaseObjectType?
@ObjectType()
export class BaseModel extends BaseJunctionModel {
  // TODO: Should this be a GraphQLID? It's a number in the db.
  @Field(() => Int)
  id: number;
}
