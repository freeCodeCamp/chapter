import { Prisma } from '@prisma/client';
import {
  Arg,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';

import { GQLCtx } from '../../common-types/gql';
import { prisma } from '../../prisma';
import { ChapterUser, UserBan } from '../../graphql-types';

const UNIQUE_CONSTRAINT_FAILED_CODE = 'P2002';

const canToggleBan = (role: string, otherRole: string) =>
  otherRole !== 'owner' &&
  ['owner', 'organizer'].includes(role) &&
  !(role !== 'organizer' && otherRole !== 'organizer');

const getInvolvedChapterRoles = async (
  chapterId: number,
  userId: number,
  otherId: number,
) => {
  const users = await prisma.chapter_users.findMany({
    where: {
      chapter_id: chapterId,
      user_id: { in: [userId, otherId] },
    },
    include: { chapter_role: true, user: true },
  });

  const idToRole: Record<number, string> = users.reduce(
    (acc, { user, chapter_role }) => ({
      ...acc,
      [user.id]: chapter_role.name,
    }),
    {},
  );
  return [idToRole[userId], idToRole[otherId]];
};

@Resolver(() => ChapterUser)
export class ChapterUserResolver {
  @Query(() => ChapterUser)
  async chapterUser(
    @Arg('chapterId', () => Int) chapterId: number,
    @Ctx() ctx: GQLCtx,
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
      rejectOnNotFound: false,
    });
  }

  @Mutation(() => ChapterUser)
  async joinChapter(
    @Arg('chapterId', () => Int) chapterId: number,
    @Ctx() ctx: GQLCtx,
  ): Promise<ChapterUser> {
    if (!ctx.user) {
      throw Error('User must be logged in to join chapter');
    }

    return await prisma.chapter_users.create({
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
  }

  @Mutation(() => ChapterUser)
  async toggleChapterSubscription(
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

  @Mutation(() => Boolean)
  async initUserInterestForChapter(
    @Arg('id', () => Int) id: number,
    @Ctx() ctx: GQLCtx,
  ): Promise<boolean> {
    if (!ctx.user) {
      throw Error('User must be logged in to update role ');
    }
    const event = await prisma.events.findUnique({
      where: { id },
      include: { chapter: true },
    });
    if (!event.chapter) {
      throw Error('Cannot find the chapter of the event with id ' + id);
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

  @Mutation(() => ChapterUser)
  async changeChapterUserRole(
    @Arg('chapterId', () => Int) chapterId: number,
    @Arg('roleId', () => Int) roleId: number,
    @Arg('userId', () => Int) userId: number,
    @Ctx() ctx: GQLCtx,
  ): Promise<ChapterUser> {
    if (!ctx.user) {
      throw Error('User must be logged in to change chapter role');
    }
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

  @Mutation(() => UserBan)
  async banUser(
    @Arg('chapterId', () => Int) chapterId: number,
    @Arg('userId', () => Int) userId: number,
    @Ctx() ctx: GQLCtx,
  ): Promise<UserBan> {
    if (!ctx.user) {
      throw Error('User must be logged to ban');
    }
    if (ctx.user.id === userId) {
      throw Error('Cannot ban yourself');
    }

    const [chapterRole, otherRole] = await getInvolvedChapterRoles(
      chapterId,
      ctx.user.id,
      userId,
    );

    if (!canToggleBan(chapterRole, otherRole)) {
      throw Error('Cannot ban');
    }

    return await prisma.user_bans.create({
      data: {
        chapter: { connect: { id: chapterId } },
        user: { connect: { id: userId } },
      },
      include: { chapter: true, user: true },
    });
  }

  @Mutation(() => UserBan)
  async unbanUser(
    @Arg('chapterId', () => Int) chapterId: number,
    @Arg('userId', () => Int) userId: number,
    @Ctx() ctx: GQLCtx,
  ): Promise<UserBan> {
    if (!ctx.user) {
      throw Error('User must be logged in to unban');
    }
    if (ctx.user.id === userId) {
      throw Error('Cannot unban yourself');
    }

    const [chapterRole, otherRole] = await getInvolvedChapterRoles(
      chapterId,
      ctx.user.id,
      userId,
    );

    if (!canToggleBan(chapterRole, otherRole)) {
      throw Error('Cannot unban');
    }

    return await prisma.user_bans.delete({
      where: { user_id_chapter_id: { chapter_id: chapterId, user_id: userId } },
      include: { chapter: true, user: true },
    });
  }

  @FieldResolver()
  canBeBanned(@Root() chapter_user: ChapterUser, @Ctx() ctx: GQLCtx): boolean {
    if (!ctx.user) {
      return false;
    }

    const chapterId = chapter_user.chapter_id;

    const otherRole = chapter_user.chapter_role.name;
    if (otherRole === 'owner') {
      return false;
    }

    // TODO user permission for banning should be handled by authorization
    const chapterRole = ctx.user.user_chapters.find(
      ({ chapter_id }) => chapter_id === chapterId,
    )?.chapter_role.name;
    if (!chapterRole) {
      return false;
    }

    if (
      chapterRole === 'owner' ||
      (chapterRole === 'organizer' && otherRole !== 'organizer')
    ) {
      return true;
    }

    return false;
  }
}
