import { Resolver, Query } from 'type-graphql';
import { Chapter } from '../../models';

@Resolver()
export class ChapterResolver {
  @Query(() => String)
  hello() {
    return 'Hello world';
  }

  @Query(() => [Chapter])
  chapters() {
    return Chapter.find();
  }
}
