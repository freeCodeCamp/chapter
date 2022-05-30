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

@Resolver(() => ChapterUser)
export class ChapterUserResolver {
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

  @Query(() => [ChapterUser])
  async chapterUsers(
    @Arg('chapter_id', () => Int) chapterId: number,
  ): Promise<ChapterUser[]> {
    return await prisma.chapter_users.findMany({
      where: {
        chapter_id: chapterId,
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

    const users = await prisma.chapter_users.findMany({
      where: {
        chapter_id: chapterId,
        user_id: { in: [ctx.user.id, userId] },
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

    const chapterRole = idToRole[ctx.user.id];
    const otherRole = idToRole[userId];

    if (
      otherRole === 'owner' ||
      !['owner', 'organizer'].includes(chapterRole) ||
      (chapterRole === 'organizer' && otherRole === 'organizer')
    ) {
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

  @FieldResolver(() => Boolean)
  async isBanned(@Root() chapter_user: ChapterUser): Promise<boolean> {
    const chapterBans = await prisma.user_bans.findMany({
      where: {
        user_id: chapter_user.user_id,
        chapter_id: chapter_user.chapter_id,
      },
    });

    return Boolean(chapterBans.length);
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
