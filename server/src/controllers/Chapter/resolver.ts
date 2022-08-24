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
import {
  Chapter,
  ChapterWithRelations,
  ChapterWithEvents,
} from '../../graphql-types';
import { prisma } from '../../prisma';
import { createCalendar } from '../../services/Google';
import { CreateChapterInputs, UpdateChapterInputs } from './inputs';

@Resolver()
export class ChapterResolver {
  @Query(() => [ChapterWithEvents])
  async chapters(): Promise<ChapterWithEvents[]> {
    return await prisma.chapters.findMany({
      include: {
        events: { include: { tags: { include: { tag: true } } } },
      },
    });
  }

  @Query(() => ChapterWithRelations, { nullable: true })
  async chapter(
    @Arg('id', () => Int) id: number,
  ): Promise<ChapterWithRelations | null> {
    return await prisma.chapters.findUnique({
      where: { id },
      include: {
        events: { include: { tags: { include: { tag: true } } } },
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
          orderBy: { user: { name: 'asc' } },
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
    // TODO: handle errors from the calendar integration
    let calendarData;
    try {
      calendarData = await createCalendar(ctx.user.id, {
        summary: data.name,
        description: `Events for ${data.name}`,
      });
    } catch {
      // TODO: log more details without leaking tokens and user info.
      console.log('Unable to create calendar');
    }
    const chapterData: Prisma.chaptersCreateInput = {
      ...data,
      creator_id: ctx.user.id,
      calendar_id: calendarData?.id,
    };

    return prisma.chapters.create({ data: chapterData });
  }

  @Authorized(Permission.ChapterEdit)
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
