import { ObjectType, Field } from 'type-graphql';
import { BaseJunctionModel } from './BaseJunctionModel';
import { Sponsor } from './Sponsor';

@ObjectType()
export class EventSponsor extends BaseJunctionModel {
  @Field(() => Sponsor)
  sponsor: Sponsor;
}
