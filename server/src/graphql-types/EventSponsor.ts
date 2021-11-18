import { ObjectType, Field } from 'type-graphql';
import { Sponsor } from './Sponsor';

@ObjectType()
export class EventSponsor {
  @Field(() => Sponsor)
  sponsor: Sponsor;
}
