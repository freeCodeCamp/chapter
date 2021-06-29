import { Resolver, Query, Arg, Int, Mutation } from 'type-graphql';
import { Tag, Event } from '../../models';
import { CreateTagInputs } from './inputs';

@Resolver()
export class TagResolver {
  @Query(() => [Tag])
  tags() {
    return Tag.find();
  }

  @Query(() => Tag, { nullable: true })
  tag(@Arg('id', () => Int) id: number) {
    return Tag.findOne(id);
  }

  @Mutation(() => Tag)
  async createTag(@Arg('data') data: CreateTagInputs) {
    const events = await Event.findByIds(data.eventIds);
    const tag = new Tag({ ...data, events });
    return tag.save();
  }
}
