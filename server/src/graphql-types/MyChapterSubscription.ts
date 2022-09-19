import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class MyChapterSubscription {
  @Field(() => Number)
  id: number;

  @Field(() => String)
  name: string;
}
