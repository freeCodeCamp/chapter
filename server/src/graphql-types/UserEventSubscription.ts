import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class UserEventSubscription {
  @Field(() => Number)
  id: number;

  @Field(() => String)
  name: string;
}
