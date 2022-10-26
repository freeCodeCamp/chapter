import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
} from 'type-graphql';
import { Prisma } from '@prisma/client';

import { ResolverCtx } from '../../common-types/gql';
import { prisma, UNIQUE_CONSTRAINT_FAILED } from '../../prisma';
import { ChapterUser, UserBan } from '../../graphql-types';
import { Permission } from '../../../../common/permissions';
import { updateCalendarEventAttendees } from '../../util/updateCalendarEventAttendees';
import { getInstanceRoleName } from '../../util/chapterAdministrator';
import { updateEventWaitlist } from '../../util/updateEventWaitlist';

const chapterUsersInclude = {
  chapter_role: {
    include: {
      chapter_role_permissions: { include: { chapter_permission: true } },
    },
  },
  user: true,
};

@Resolver(() => ChapterUser)
export class ChapterUserResolver {
  @Query(() => ChapterUser, { nullable: true })
  async chapterUser(
    @Arg('chapterId', () => Int) chapterId: number,
    @Ctx() ctx: ResolverCtx,
  ): Promise<ChapterUser | null> {
    if (!ctx.user) {
      return null;
    }

    return await prisma.chapter_users.findUnique({
      include: chapterUsersInclude,
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
    try {
      return await prisma.chapter_users.create({
        data: {
          user: { connect: { id: ctx.user.id } },
          chapter: { connect: { id: chapterId } },
          chapter_role: { connect: { name: 'member' } },
          subscribed: true, // TODO add user setting option override
          joined_date: new Date(),
        },
        include: chapterUsersInclude,
      });
    } catch (e) {
      if (
        !(e instanceof Prisma.PrismaClientKnownRequestError) ||
        e.code !== UNIQUE_CONSTRAINT_FAILED
      ) {
        throw e;
      }
    }

    return await prisma.chapter_users.findUniqueOrThrow({
      where: {
        user_id_chapter_id: { chapter_id: chapterId, user_id: ctx.user.id },
      },
      include: chapterUsersInclude,
    });
  }

  @Mutation(() => ChapterUser)
  async leaveChapter(
    @Arg('chapterId', () => Int) chapterId: number,
    @Ctx() ctx: Required<ResolverCtx>,
  ): Promise<ChapterUser | null> {
    const userEvents = await prisma.event_users.findMany({
      where: {
        user_id: ctx.user.id,
        event: { chapter_id: chapterId },
      },
      include: {
        event: {
          include: { chapter: true, event_users: { include: { rsvp: true } } },
        },
        rsvp: true,
      },
    });
    await prisma.event_users.deleteMany({
      where: {
        user_id: ctx.user.id,
        event: { chapter_id: chapterId },
      },
    });

    const attendingEvents = userEvents.filter(
      ({ rsvp: { name } }) => name === 'yes',
    );

    await Promise.all(
      attendingEvents.map(async ({ event }) =>
        updateEventWaitlist({ event, userId: ctx.user.id }),
      ),
    );

    const eventsWithCalendar = attendingEvents.filter(
      ({ event: { calendar_event_id } }) => calendar_event_id,
    );

    const calendarUpdates = eventsWithCalendar.map(
      async ({
        event: {
          calendar_event_id,
          chapter: { calendar_id },
          id,
        },
      }) => {
        // The calendar must be updated after event_users, so it can use the updated
        // email list
        return await updateCalendarEventAttendees({
          calendarEventId: calendar_event_id,
          calendarId: calendar_id,
          eventId: id,
        });
      },
    );
    await Promise.all(calendarUpdates);
    return await prisma.chapter_users.delete({
      where: {
        user_id_chapter_id: {
          chapter_id: chapterId,
          user_id: ctx.user.id,
        },
      },
      // TODO: return only { user_id }
      include: chapterUsersInclude,
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
      include: chapterUsersInclude,
    });
  }

  @Query(() => [ChapterUser])
  async chapterUsers(@Arg('id', () => Int) id: number): Promise<ChapterUser[]> {
    return await prisma.chapter_users.findMany({
      where: { chapter_id: id },
      include: chapterUsersInclude,
    });
  }

  @Authorized(Permission.ChapterUserRoleChange)
  @Mutation(() => ChapterUser)
  async changeChapterUserRole(
    @Arg('chapterId', () => Int) chapterId: number,
    @Arg('roleName', () => String) newChapterRole: string,
    @Arg('userId', () => Int) userId: number,
  ): Promise<ChapterUser> {
    const chapterUser = await prisma.chapter_users.findUniqueOrThrow({
      include: {
        ...chapterUsersInclude,
        user: {
          include: {
            instance_role: true,
            user_chapters: { include: { chapter_role: true } },
          },
        },
      },
      where: { user_id_chapter_id: { chapter_id: chapterId, user_id: userId } },
    });

    const oldChapterRole = chapterUser.chapter_role.name;
    if (oldChapterRole === newChapterRole) return chapterUser;

    const updatedChapterUser = await prisma.chapter_users.update({
      data: { chapter_role: { connect: { name: newChapterRole } } },
      include: chapterUsersInclude,
      where: { user_id_chapter_id: { chapter_id: chapterId, user_id: userId } },
    });

    const oldInstanceRole = chapterUser.user.instance_role.name;

    const newInstanceRole = getInstanceRoleName({
      changedChapterId: chapterId,
      newChapterRole,
      oldInstanceRole,
      userChapters: chapterUser.user.user_chapters,
    });
    if (newInstanceRole !== oldInstanceRole) {
      await prisma.users.update({
        data: {
          instance_role: { connect: { name: newInstanceRole } },
        },
        where: { id: chapterUser.user_id },
      });
    }

    return updatedChapterUser;
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

    const userEvents = await prisma.event_users.findMany({
      where: {
        user_id: userId,
        event: { chapter_id: chapterId },
      },
      include: {
        event: {
          include: { chapter: true, event_users: { include: { rsvp: true } } },
        },
        rsvp: true,
      },
    });
    await prisma.event_users.deleteMany({
      where: {
        user_id: userId,
        event: { chapter_id: chapterId },
      },
    });

    const attendingEvents = userEvents.filter(
      ({ rsvp: { name } }) => name === 'yes',
    );

    await Promise.all(
      attendingEvents.map(async ({ event }) =>
        updateEventWaitlist({ event, userId }),
      ),
    );

    const eventsWithCalendar = attendingEvents.filter(
      ({ event: { calendar_event_id } }) => calendar_event_id,
    );

    const calendarUpdates = eventsWithCalendar.map(
      async ({
        event: {
          calendar_event_id,
          chapter: { calendar_id },
          id,
        },
      }) => {
        // The calendar must be updated after event_users, so it can use the updated
        // email list
        return await updateCalendarEventAttendees({
          calendarEventId: calendar_event_id,
          calendarId: calendar_id,
          eventId: id,
        });
      },
    );
    await Promise.all(calendarUpdates);

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

  // TODO: it would be nice if this was a field on the ChapterUser type and we
  // could guarantee type safety of this resolver.
  @FieldResolver()
  is_bannable(@Ctx() ctx: ResolverCtx): boolean {
    // TODO: reimplement the logic of
    // https://github.com/freeCodeCamp/chapter/commit/a71e570b22e8bad042438369b1162000dcee3f47,
    // updated with the current roles and permissions
    if (!ctx.user) {
      return false;
    }
    return true;
  }
}
