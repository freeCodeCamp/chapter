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
  FieldResolver,
  Root,
} from 'type-graphql';
import { Permission } from '../../../../common/permissions';
import { ChapterRoles } from '../../../../common/roles';

import { ResolverCtx } from '../../common-types/gql';
import {
  Chapter,
  ChapterWithRelations,
  ChapterCardRelations,
  ChapterWithEvents,
} from '../../graphql-types';
import { prisma } from '../../prisma';
import { createCalendar, testCalendarAccess } from '../../services/Google';
import {
  isAdminFromInstanceRole,
  isChapterAdminWhere,
} from '../../util/adminedChapters';
import { isBannable } from '../../util/chapterBans';
import { redactSecrets } from '../../util/redact-secrets';
import { integrationStatus } from '../../util/calendar';
import { createTagsData } from '../../util/tags';
import { ChapterInputs } from './inputs';

@Resolver(() => Chapter)
export class ChapterResolver {
  @FieldResolver(() => Boolean)
  has_calendar(@Root() chapter: Chapter) {
    return typeof chapter.calendar_id === 'string';
  }

  @Query(() => [ChapterCardRelations])
  async chapters(): Promise<ChapterCardRelations[]> {
    return await prisma.chapters.findMany({
      include: {
        chapter_tags: { include: { tag: true } },
        events: {
          where: {
            AND: [{ canceled: false }, { ends_at: { gt: new Date() } }],
          },
          take: 3,
          orderBy: [{ start_at: 'desc' }, { name: 'asc' }],
        },
        _count: { select: { chapter_users: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  @Query(() => ChapterWithEvents)
  async chapter(@Arg('id', () => Int) id: number): Promise<ChapterWithEvents> {
    return await prisma.chapters.findUniqueOrThrow({
      where: { id },
      include: {
        chapter_tags: { include: { tag: true } },
        events: { include: { event_tags: { include: { tag: true } } } },
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
        chapter_tags: { include: { tag: true } },
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

  @Authorized(Permission.ChaptersView)
  @Query(() => [ChapterWithEvents])
  async dashboardChapters(
    @Ctx() ctx: Required<ResolverCtx>,
  ): Promise<ChapterWithEvents[]> {
    return await prisma.chapters.findMany({
      ...(!isAdminFromInstanceRole(ctx.user) && {
        where: isChapterAdminWhere(ctx.user.id),
      }),
      include: {
        chapter_tags: { include: { tag: true } },
        events: { include: { event_tags: { include: { tag: true } } } },
      },
      orderBy: { name: 'asc' },
    });
  }

  @Authorized(Permission.ChapterCreate)
  @Mutation(() => Chapter)
  async createChapter(
    @Arg('data') data: ChapterInputs,
    @Ctx() ctx: Required<ResolverCtx>,
  ): Promise<Chapter> {
    let calendarData;
    const calendarStatus = await integrationStatus();
    if (calendarStatus) {
      try {
        calendarData = await createCalendar({
          summary: data.name,
          description: `Events for ${data.name}`,
        });
      } catch (e) {
        console.log('Unable to create calendar');
        console.error(inspect(redactSecrets(e), { depth: null }));
      }
    }
    const chapterData: Prisma.chaptersCreateInput = {
      name: data.name,
      description: data.description,
      category: data.category,
      city: data.city,
      region: data.region,
      country: data.country,
      logo_url: data.logo_url ?? null,
      chat_url: data.chat_url ?? null,
      banner_url: data.banner_url ?? null,
      chapter_tags: createTagsData(data.chapter_tags),
      creator_id: ctx.user.id,
      calendar_id: calendarData?.id,
    };

    return await prisma.chapters.create({ data: chapterData });
  }

  @Authorized(Permission.ChapterCreate)
  @Mutation(() => Chapter)
  async createChapterCalendar(
    @Arg('id', () => Int) id: number,
  ): Promise<Chapter> {
    const chapter = await prisma.chapters.findUniqueOrThrow({ where: { id } });
    if (chapter.calendar_id) return chapter;

    const calendarStatus = await integrationStatus();
    if (!calendarStatus) return chapter;

    try {
      const calendarData = await createCalendar({
        summary: chapter.name,
        description: `Events for ${chapter.name}`,
      });
      return await prisma.chapters.update({
        where: { id },
        data: { calendar_id: calendarData.id },
      });
    } catch (e) {
      console.log('Unable to create calendar');
      console.error(inspect(redactSecrets(e), { depth: null }));
      return chapter;
    }
  }

  @Authorized(Permission.ChapterCreate)
  @Query(() => Boolean, { nullable: true })
  async testChapterCalendarAccess(
    @Arg('id', () => Int) id: number,
  ): Promise<boolean | null> {
    const chapter = await prisma.chapters.findUniqueOrThrow({ where: { id } });
    if (!chapter.calendar_id) return null;
    try {
      return await testCalendarAccess({
        calendarId: chapter.calendar_id,
      });
    } catch (err) {
      return null;
    }
  }

  @Authorized(Permission.ChapterCreate)
  @Mutation(() => Chapter)
  async unlinkChapterCalendar(
    @Arg('id', () => Int) id: number,
  ): Promise<Chapter> {
    await prisma.events.updateMany({
      data: { calendar_event_id: null },
      where: { chapter_id: id },
    });

    return await prisma.chapters.update({
      data: { calendar_id: null },
      where: { id },
    });
  }

  @Authorized(Permission.ChapterEdit)
  @Mutation(() => Chapter)
  async updateChapter(
    @Arg('id', () => Int) id: number,
    @Arg('data') data: ChapterInputs,
  ): Promise<Chapter> {
    const chapter = await prisma.chapters.findUniqueOrThrow({ where: { id } });

    await prisma.$transaction([
      prisma.chapters.update({
        where: { id },
        data: { chapter_tags: { deleteMany: {} } },
      }),
      prisma.chapters.update({
        where: { id },
        data: { chapter_tags: createTagsData(data.chapter_tags) },
      }),
    ]);
    const chapterData: Prisma.chaptersUpdateInput = {
      name: data.name ?? chapter.name,
      description: data.description ?? chapter.description,
      chat_url: data.chat_url,
      category: data.category ?? chapter.category,
      city: data.city ?? chapter.city,
      country: data.country ?? chapter.country,
      region: data.region ?? chapter.region,
      banner_url: data.banner_url,
      logo_url: data.logo_url,
    };
    return prisma.chapters.update({ where: { id }, data: chapterData });
  }

  @Authorized(Permission.ChapterDelete)
  @Mutation(() => Chapter)
  async deleteChapter(@Arg('id', () => Int) id: number): Promise<Chapter> {
    return await prisma.chapters.delete({ where: { id } });
  }
}
