import { Prisma } from '@prisma/client';
import { Arg, Ctx, Int, Mutation, Resolver, Query } from 'type-graphql';

import { GQLCtx } from '../../common-types/gql';
import { ChapterUser } from '../../graphql-types';
import { prisma } from '../../prisma';

const UNIQUE_CONSTRAINT_FAILED_CODE = 'P2002';

@Resolver()
export class ChapterUserResolver {
  @Query(() => ChapterUser)
  async chapterUser(
    @Arg('chapterId', () => Int) chapterId: number,
    @Ctx() ctx: GQLCtx,
  ): Promise<ChapterUser | null> {
    if (!ctx.user) {
      return null;
    }

    const chapterUser = await prisma.chapter_users.findUnique({
      include: {
        chapter_role: {
          include: {
            chapter_role_permissions: { include: { chapter_permission: true } },
          },
        },
        user: true,
      },
      where: {
        user_id_chapter_id: { user_id: ctx.user.id, chapter_id: chapterId },
      },
      rejectOnNotFound: false,
    });

    if (!chapterUser) {
      return null;
    }

    return chapterUser;
  }

  @Mutation(() => ChapterUser)
  async joinChapter(
    @Arg('chapterId', () => Int) chapterId: number,
    @Ctx() ctx: GQLCtx,
  ): Promise<ChapterUser> {
    if (!ctx.user) {
      throw Error('User must be logged in to join chapter');
    }

    const chapterUser = await prisma.chapter_users.create({
      data: {
        user: { connect: { id: ctx.user.id } },
        chapter: { connect: { id: chapterId } },
        chapter_role: { connect: { name: 'member' } },
        subscribed: true, // TODO add user setting option override
        joined_date: new Date(),
      },
      include: {
        user: true,
        chapter_role: {
          include: {
            chapter_role_permissions: { include: { chapter_permission: true } },
          },
        },
      },
    });

    return chapterUser;
  }

  @Mutation(() => ChapterUser)
  async chapterSubscribe(
    @Arg('chapterId', () => Int) chapterId: number,
    @Ctx() ctx: GQLCtx,
  ): Promise<ChapterUser> {
    if (!ctx.user) {
      throw Error('User must be logged in to change subscription');
    }

    const chapterUser = await prisma.chapter_users.findUnique({
      where: {
        user_id_chapter_id: {
          chapter_id: chapterId,
          user_id: ctx.user.id,
        },
      },
    });

    if (chapterUser.subscribed) {
      const chapter = await prisma.chapters.findUnique({
        include: { events: true },
        where: { id: chapterId },
      });

      const onlyUserEventsFromChapter = {
        AND: [
          { user_id: ctx.user.id },
          { event_id: { in: chapter.events.map(({ id }) => id) } },
        ],
      };

      await prisma.event_users.updateMany({
        data: { subscribed: false },
        where: onlyUserEventsFromChapter,
      });
      await prisma.event_reminders.deleteMany({
        where: onlyUserEventsFromChapter,
      });
    }
    return await prisma.chapter_users.update({
      data: {
        subscribed: !chapterUser?.subscribed,
      },
      where: {
        user_id_chapter_id: {
          user_id: ctx.user.id,
          chapter_id: chapterId,
        },
      },
      include: {
        user: true,
        chapter_role: {
          include: {
            chapter_role_permissions: { include: { chapter_permission: true } },
          },
        },
      },
    });
  }

  @Mutation(() => Boolean)
  async initUserInterestForChapter(
    @Arg('event_id', () => Int) event_id: number,
    @Ctx() ctx: GQLCtx,
  ): Promise<boolean> {
    if (!ctx.user) {
      throw Error('User must be logged in to update role ');
    }
    const event = await prisma.events.findUnique({
      where: { id: event_id },
      include: { chapter: true },
    });
    if (!event.chapter) {
      throw Error('Cannot find the chapter of the event with id ' + event_id);
    }

    try {
      await prisma.chapter_users.create({
        data: {
          user: { connect: { id: ctx.user.id } },
          chapter: { connect: { id: event.chapter.id } },
          chapter_role: { connect: { name: 'member' } },
          subscribed: true, // TODO use user specified setting
          joined_date: new Date(),
        },
      });
    } catch (e) {
      if (
        !(e instanceof Prisma.PrismaClientKnownRequestError) ||
        e.code !== UNIQUE_CONSTRAINT_FAILED_CODE
      ) {
        throw e;
      }
    }

    return true;
  }
}
