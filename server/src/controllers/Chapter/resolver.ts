import { Prisma } from '@prisma/client';
import { Resolver, Query, Arg, Int, Mutation, Ctx } from 'type-graphql';

import { GQLCtx } from '../../common-types/gql';
import { Chapter, ChapterWithRelations } from '../../graphql-types';
import { prisma } from '../../prisma';
import { CreateChapterInputs, UpdateChapterInputs } from './inputs';

@Resolver()
export class ChapterResolver {
  @Query(() => [Chapter])
  async chapters(): Promise<Chapter[]> {
    return await prisma.chapters.findMany();
  }

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

  @Mutation(() => Chapter)
  async createChapter(
    @Arg('data') data: CreateChapterInputs,
    @Ctx() ctx: GQLCtx,
  ): Promise<Chapter> {
    if (!ctx.user) {
      throw Error('User must be logged in to create chapters');
    }
    const chapterData: Prisma.chaptersCreateInput = {
      ...data,
      creator_id: ctx.user.id,
    };

    return prisma.chapters.create({ data: chapterData });
  }

  @Mutation(() => Chapter)
  async updateChapter(
    @Arg('id', () => Int) id: number,
    @Arg('data') data: UpdateChapterInputs,
  ): Promise<Chapter> {
    const chapterData: Prisma.chaptersUpdateInput = data;
    return prisma.chapters.update({ where: { id }, data: chapterData });
  }

  @Mutation(() => Chapter)
  async deleteChapter(@Arg('id', () => Int) id: number): Promise<Chapter> {
    return await prisma.chapters.delete({ where: { id } });
  }
}
