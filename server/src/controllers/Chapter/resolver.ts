import { Prisma } from '@prisma/client';
import { Resolver, Query, Arg, Int, Mutation } from 'type-graphql';
import { CreateChapterInputs, UpdateChapterInputs } from './inputs';
import { Chapter, ChapterWithRelations } from 'src/models';
import { prisma } from 'src/prisma';

@Resolver()
export class ChapterResolver {
  @Query(() => [Chapter])
  // TODO: add TypeGraphQL return type
  async chapters(): Promise<Chapter[]> {
    return await prisma.chapters.findMany();
  }

  // TODO: add TypeGraphQL return type
  @Query(() => ChapterWithRelations, { nullable: true })
  async chapter(
    @Arg('id', () => Int) id: number,
  ): Promise<ChapterWithRelations | null> {
    return await prisma.chapters.findUnique({
      where: { id },
      include: {
        events: { include: { tags: true } },
        users: { include: { user: true } },
      },
    });
  }

  // TODO: add TypeGraphQL return type
  @Mutation(() => Chapter)
  async createChapter(@Arg('data') data: CreateChapterInputs) {
    // TODO: Use logged in user
    const user = await prisma.users.findFirst();
    // TODO: fix the TypeGraphQL type, CreateChapterInputs (it should include
    // details or the db should not require it)
    // TODO: creator_id should not be optional and we shouldn't need Unchecked
    // here
    const chapterData: Prisma.chaptersUncheckedCreateInput = {
      ...data,
      details: data.details ?? '',
      creator_id: user?.id,
    };

    return prisma.chapters.create({ data: chapterData });
  }

  // TODO: add TypeGraphQL return type
  @Mutation(() => Chapter)
  async updateChapter(
    @Arg('id', () => Int) id: number,
    @Arg('data') data: UpdateChapterInputs,
  ) {
    const chapterData: Prisma.chaptersUpdateInput = data;
    return prisma.chapters.update({ where: { id }, data: chapterData });
  }

  // TODO: add TypeGraphQL return type
  @Mutation(() => Boolean)
  async deleteChapter(@Arg('id', () => Int) id: number) {
    await prisma.chapters.delete({ where: { id } });
    return true;
  }
}
