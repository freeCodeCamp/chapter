import { inspect } from 'util';

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
  ChapterCard,
  ChapterWithEvents,
} from '../../graphql-types';
import { prisma } from '../../prisma';
import { createCalendar } from '../../services/Google';
import { ChapterRoles } from '../../../prisma/init/factories/chapterRoles.factory';
import {
  isAdminFromInstanceRole,
  isChapterAdminWhere,
} from '../../util/adminedChapters';
import { isBannable } from '../../util/chapterBans';
import { redactSecrets } from '../../util/redact-secrets';
import { CreateChapterInputs, UpdateChapterInputs } from './inputs';

@Resolver()
export class ChapterResolver {
  @Query(() => [ChapterCard])
  async chapters(): Promise<ChapterCard[]> {
    return await prisma.chapters.findMany({
      include: {
        events: true,
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
        },
      },
    });
  }

  @Authorized(Permission.ChapterEdit)
  @Query(() => ChapterWithRelations)
  async dashboardChapter(
    @Arg('id', () => Int) id: number,
    @Ctx() ctx: Required<ResolverCtx>,
  ): Promise<ChapterWithRelations> {
    const chapter = await prisma.chapters.findUniqueOrThrow({
      where: { id },
      include: {
        events: true,
        chapter_users: {
          include: {
            chapter_role: {
              include: {
                chapter_role_permissions: {
                  include: { chapter_permission: true },
                },
              },
            },
            user: { include: { instance_role: true } },
          },
          orderBy: { user: { name: 'asc' } },
        },
        user_bans: { include: { user: true, chapter: true } },
      },
    });

    const userInstanceRole = ctx.user.instance_role.name;
    const userChapterRole =
      ctx.user.user_chapters.find(({ chapter_id }) => chapter_id === id)
        ?.chapter_role.name ?? ChapterRoles.member;

    const usersWithIsBannable = chapter.chapter_users.map((chapterUser) => ({
      ...chapterUser,
      is_bannable: isBannable({
        userId: ctx.user.id,
        userChapterRole,
        userInstanceRole,
        otherUserId: chapterUser.user_id,
        otherChapterRole: chapterUser.chapter_role.name,
        otherInstanceRole: chapterUser.user.instance_role.name,
      }),
    }));

    return { ...chapter, chapter_users: usersWithIsBannable };
  }

  @Query(() => [ChapterWithEvents])
  async dashboardChapters(
    @Ctx() ctx: Required<ResolverCtx>,
  ): Promise<ChapterWithEvents[]> {
    return await prisma.chapters.findMany({
      ...(!isAdminFromInstanceRole(ctx.user) && {
        where: isChapterAdminWhere(ctx.user.id),
      }),
      include: { events: true },
    });
  }

  @Query(() => ChapterWithRelations)
  async chapter(
    @Arg('id', () => Int) id: number,
  ): Promise<ChapterWithRelations> {
    return await prisma.chapters.findUniqueOrThrow({
      where: { id },
      include: {
        events: true,
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
    let calendarData;
    try {
      calendarData = await createCalendar({
        summary: data.name,
        description: `Events for ${data.name}`,
      });
    } catch (e) {
      console.log('Unable to create calendar');
      console.error(inspect(redactSecrets(e), { depth: null }));
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

  @Authorized(Permission.ChapterDelete)
  @Mutation(() => Chapter)
  async deleteChapter(@Arg('id', () => Int) id: number): Promise<Chapter> {
    return await prisma.chapters.delete({ where: { id } });
  }
}
