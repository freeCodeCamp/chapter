import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
export class BaseObject {
  // TODO: Should this be a GraphQLID? It's a number in the db.
  @Field(() => Int)
  id: number;
}
