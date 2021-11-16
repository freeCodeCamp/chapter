import { Field, ObjectType } from 'type-graphql';
import { Chapter, Event } from '.';

@ObjectType()
export class EventWithChapter extends Event {
  @Field(() => Chapter)
  chapter: Chapter;
}
