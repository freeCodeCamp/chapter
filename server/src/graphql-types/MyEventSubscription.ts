import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class MyEventSubscription {
  @Field(() => Number)
  id: number;

  @Field(() => String)
  name: string;
}
