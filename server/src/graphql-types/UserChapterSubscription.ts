import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class UserChapterSubscription {
  @Field(() => Number)
  id: number;

  @Field(() => String)
  name: string;
}
