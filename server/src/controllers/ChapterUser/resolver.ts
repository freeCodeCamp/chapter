import {
  Arg,
  Authorized,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver,
} from 'type-graphql';
import { Prisma } from '@prisma/client';

import { ResolverCtx } from '../../common-types/gql';
import { prisma } from '../../prisma';
import { ChapterUser, UserBan } from '../../graphql-types';
import { Permission } from '../../../../common/permissions';

const UNIQUE_CONSTRAINT_FAILED_CODE = 'P2002';

@Resolver(() => ChapterUser)
export class ChapterUserResolver {
  @Query(() => ChapterUser)
  async chapterUser(
    @Arg('chapterId', () => Int) chapterId: number,
    @Ctx() ctx: ResolverCtx,
  ): Promise<ChapterUser | null> {
    if (!ctx.user) {
      return null;
    }

    return await prisma.chapter_users.findUnique({
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
    });
  }

  @Authorized(Permission.ChapterJoin)
  @Mutation(() => ChapterUser)
  async joinChapter(
    @Arg('chapterId', () => Int) chapterId: number,
    @Ctx() ctx: Required<ResolverCtx>,
  ): Promise<ChapterUser> {
    const includes = {
      user: true,
      chapter_role: {
        include: {
          chapter_role_permissions: {
            include: { chapter_permission: true },
          },
        },
      },
    };
    try {
      return await prisma.chapter_users.create({
        data: {
          user: { connect: { id: ctx.user.id } },
          chapter: { connect: { id: chapterId } },
          chapter_role: { connect: { name: 'member' } },
          subscribed: true, // TODO add user setting option override
          joined_date: new Date(),
        },
        include: includes,
      });
    } catch (e) {
      if (
        !(e instanceof Prisma.PrismaClientKnownRequestError) ||
        e.code !== UNIQUE_CONSTRAINT_FAILED_CODE
      ) {
        throw e;
      }
    }

    return await prisma.chapter_users.findUniqueOrThrow({
      where: {
        user_id_chapter_id: { chapter_id: chapterId, user_id: ctx.user.id },
      },
      include: includes,
    });
  }

  @Authorized(Permission.ChapterSubscriptionManage)
  @Mutation(() => ChapterUser)
  async toggleChapterSubscription(
    @Arg('chapterId', () => Int) chapterId: number,
    @Ctx() ctx: Required<ResolverCtx>,
  ): Promise<ChapterUser> {
    const chapterUser = await prisma.chapter_users.findUniqueOrThrow({
      where: {
        user_id_chapter_id: {
          chapter_id: chapterId,
          user_id: ctx.user.id,
        },
      },
      include: { chapter: { include: { events: true } } },
    });
    const chapter = chapterUser.chapter;

    if (chapterUser.subscribed) {
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

  @Query(() => [ChapterUser])
  async chapterUsers(@Arg('id', () => Int) id: number): Promise<ChapterUser[]> {
    return await prisma.chapter_users.findMany({
      where: { chapter_id: id },
      include: {
        chapter_role: {
          include: {
            chapter_role_permissions: { include: { chapter_permission: true } },
          },
        },
        user: true,
      },
    });
  }

  @Authorized(Permission.ChapterUserRoleChange)
  @Mutation(() => ChapterUser)
  async changeChapterUserRole(
    @Arg('chapterId', () => Int) chapterId: number,
    @Arg('roleId', () => Int) roleId: number,
    @Arg('userId', () => Int) userId: number,
  ): Promise<ChapterUser> {
    return await prisma.chapter_users.update({
      data: { chapter_role: { connect: { id: roleId } } },
      where: {
        user_id_chapter_id: {
          chapter_id: chapterId,
          user_id: userId,
        },
      },
      include: {
        chapter_role: {
          include: {
            chapter_role_permissions: { include: { chapter_permission: true } },
          },
        },
        user: true,
      },
    });
  }

  @Authorized(Permission.ChapterBanUser)
  @Mutation(() => UserBan)
  async banUser(
    @Arg('chapterId', () => Int) chapterId: number,
    @Arg('userId', () => Int) userId: number,
    @Ctx() ctx: Required<ResolverCtx>,
  ): Promise<UserBan> {
    if (ctx.user.id === userId) {
      throw Error('You cannot ban yourself');
    }

    return await prisma.user_bans.create({
      data: {
        chapter: { connect: { id: chapterId } },
        user: { connect: { id: userId } },
      },
      include: { chapter: true, user: true },
    });
  }

  @Authorized(Permission.ChapterBanUser)
  @Mutation(() => UserBan)
  async unbanUser(
    @Arg('chapterId', () => Int) chapterId: number,
    @Arg('userId', () => Int) userId: number,
  ): Promise<UserBan> {
    return await prisma.user_bans.delete({
      where: { user_id_chapter_id: { chapter_id: chapterId, user_id: userId } },
      include: { chapter: true, user: true },
    });
  }
}
