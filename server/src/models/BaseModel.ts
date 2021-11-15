import { ObjectType, Field, Int } from 'type-graphql';
import { BaseJunctionModel } from './BaseJunctionModel';

// TODO: rename this? BaseObjectType?
@ObjectType()
export class BaseModel extends BaseJunctionModel {
  @Field(() => Int)
  id: number;
}
