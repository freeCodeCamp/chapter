import { Resolver, Query } from 'type-graphql';

@Resolver()
export class ChapterResolver {
  @Query(() => String)
  hello() {
    return 'Hello world';
  }
}
