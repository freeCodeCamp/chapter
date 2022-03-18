import { ObjectType, Field } from 'type-graphql';
import { Tag } from './Tag';

@ObjectType()
export class EventTag {
  @Field(() => Tag)
  tag: Tag;
}
