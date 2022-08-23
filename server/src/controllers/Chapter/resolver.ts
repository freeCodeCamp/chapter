import { Prisma } from '@prisma/client';
import {
  Resolver,
  Query,
  Arg,
  Int,
  Mutation,
  Ctx,
  Authorized,
} from 'type-graphql';
import { Permission } from '../../../../common/permissions';

import { ResolverCtx } from '../../common-types/gql';
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
        events: { include: { tags: { include: { tag: true } } } },
        chapters: { include: { tags: { include: { tag: true } } } },
        chapter_users: {
          include: {
            chapter_role: {
              include: {
                chapter_role_permissions: {
                  include: { chapter_permission: true },
                },
              },
            },
            user: true,
          },
          orderBy: { user: { first_name: 'asc' } },
        },
        user_bans: { include: { user: true, chapter: true } },
      },
    });
  }

  @Authorized(Permission.ChapterCreate)
  @Mutation(() => Chapter)
  async createChapter(
    @Arg('data') data: CreateChapterInputs,
    @Ctx() ctx: Required<ResolverCtx>,
  ): Promise<Chapter> {
    // An instance owner may not want or need to join a chapter they've created
    // so they are not made a member by default.
    const chapterData: Prisma.chaptersCreateInput = {
      ...data,
      creator_id: ctx.user.id,
    };

    return prisma.chapters.create({ data: chapterData });
  }

  @Authorized(Permission.ChapterEdit)
  @Mutation(() => Chapter)
  async updateChapter(
    @Arg('id', () => Int) id: number,
    @Arg('data') data: UpdateChapterInputs,
  ): Promise<Chapter> {
    // const chapterData: Prisma.chaptersUpdateInput = data;
    // return prisma.chapters.update({ where: { id }, data: chapterData });
    const getUniqueTags = (tags: string[]) => [
      ...new Set(tags.map((tagName) => tagName.trim()).filter(Boolean)),
    ];

    const chapterData: Prisma.chaptersCreateInput = {
      name: data.name,
      creator_id: id,
      description: data.description,
      category: data.category,
      imageUrl: data.imageUrl,
      city: data.city,
      region: data.region,
      country: data.country,
      tags: {
        create: getUniqueTags(data.tags).map((tagName) => ({
          tag: {
            connectOrCreate: {
              create: { name: tagName },
              where: { name: tagName },
            },
          },
        })),
      },
    };

    return await prisma.chapters.create({
      data: chapterData,
      include: { tags: { include: { tag: true } } },
    });
  }

  @Mutation(() => Chapter)
  async deleteChapter(@Arg('id', () => Int) id: number): Promise<Chapter> {
    return await prisma.chapters.delete({
      where: { id },
      include: { tags: { include: { tag: true } } },
    });
  }
}
