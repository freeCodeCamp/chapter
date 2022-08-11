import { ObjectType, Field } from 'type-graphql';
import { Tag } from './Tag';

@ObjectType()
export class ChapterTag {
  @Field(() => Tag)
  tag: Tag;
}
