import { Resolver, Query, Arg, Int, Mutation } from 'type-graphql';
import { Chapter, User } from '../../models';
import { CreateChapterInputs, UpdateChapterInputs } from './inputs';

@Resolver()
export class ChapterResolver {
  @Query(() => [Chapter])
  chapters() {
    return Chapter.find();
  }

  @Query(() => Chapter, { nullable: true })
  chapter(@Arg('id', () => Int) id: number) {
    return Chapter.findOne(id, { relations: ['events'] });
  }

  @Mutation(() => Chapter)
  async createChapter(@Arg('data') data: CreateChapterInputs) {
    // TODO: Use logged in user
    const user = await User.findOne();

    const chapter = new Chapter({ ...data, creator: user });

    return chapter.save();
  }

  @Mutation(() => Chapter)
  async updateChapter(
    @Arg('id', () => Int) id: number,
    @Arg('data') data: UpdateChapterInputs,
  ) {
    const chapter = await Chapter.findOne(id);

    if (!chapter) throw new Error('Cant find chapter');

    chapter.name = data.name ?? chapter.name;
    chapter.description = data.description ?? chapter.description;
    chapter.category = data.category ?? chapter.category;
    chapter.details = data.details ?? chapter.details;
    chapter.city = data.city ?? chapter.city;
    chapter.region = data.region ?? chapter.region;
    chapter.country = data.country ?? chapter.country;

    return chapter.save();
  }

  @Mutation(() => Boolean)
  async deleteChapter(@Arg('id', () => Int) id: number) {
    const chapter = await Chapter.findOne(id);

    if (!chapter) throw new Error('Cant find chapter');

    await chapter.remove();

    return true;
  }
}
