import { inspect } from 'util';

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
import { prisma, UNIQUE_CONSTRAINT_FAILED } from '../../prisma';
import {
  ChapterUser,
  ChapterUserWithRelations,
  ChapterUserWithRole,
  UserBan,
} from '../../graphql-types';
import { Permission } from '../../../../common/permissions';
import { ChapterRoles } from '../../../../common/roles';
import { getInstanceRoleName } from '../../util/chapterAdministrator';
import { canBanOther } from '../../util/chapterBans';
import { updateWaitlistForUserRemoval } from '../../util/waitlist';
import { removeEventAttendee } from '../../services/Google';
import { redactSecrets } from '../../util/redact-secrets';
import MailerService from '../../../src/services/MailerService';

const chapterUsersInclude = {
  chapter_role: {
    include: {
      chapter_role_permissions: { include: { chapter_permission: true } },
    },
  },
  user: true,
};

async function removeUserFromEventsInChapter({
  userId,
  chapterId,
}: {
  userId: number;
  chapterId: number;
}) {
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: { email: true },
  });
  const eventUsers = await prisma.event_users.findMany({
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

  const eventsAttended = eventUsers
    .filter(({ rsvp: { name } }) => name === 'yes')
    .map(({ event }) => event);

  await Promise.all(
    eventsAttended.map(async (event) =>
      updateWaitlistForUserRemoval({ event, userId }),
    ),
  );

  const eventsWithCalendars = eventsAttended.filter(
    ({ calendar_event_id }) => calendar_event_id,
  );

  const attendeeEmail = user?.email;
  if (!attendeeEmail) {
    console.error(
      `unable to find user ${userId}'s email, cannot remove from calendar events`,
    );
    return;
  }
  const calendarUpdates = eventsWithCalendars.map(
    async ({ calendar_event_id, chapter: { calendar_id } }) => {
      if (calendar_event_id && calendar_id) {
        try {
          await removeEventAttendee(
            {
              calendarEventId: calendar_event_id,
              calendarId: calendar_id,
            },
            {
              attendeeEmail: user?.email,
            },
          );
        } catch (e) {
          console.error('Unable to remove event attendee');
          console.error(inspect(redactSecrets(e), { depth: null }));
        }
      }
    },
  );
  await Promise.all(calendarUpdates);
}

interface Args {
  changedChapterId: number;
  newChapterRole: string;
  user: Prisma.usersGetPayload<{
    include: {
      user_chapters: { include: { chapter_role: true } };
      instance_role: true;
    };
  }>;
}

type EmailProps =
  | {
      email: string[];
      emailSubject: string;
      emailBody: string;
    }
  | {
      email?: never;
      emailSubject?: never;
      emailBody?: never;
    };

async function updateInstanceRoleForChapterRoleChange({
  changedChapterId,
  newChapterRole,
  user,
  email,
  emailSubject,
  emailBody,
}: EmailProps & Args) {
  const oldInstanceRole = user.instance_role.name;
  const userChapters = user.user_chapters;
  const newInstanceRole = getInstanceRoleName({
    changedChapterId,
    newChapterRole,
    oldInstanceRole,
    userChapters,
  });
  if (newInstanceRole !== oldInstanceRole) {
    await prisma.users.update({
      data: { instance_role: { connect: { name: newInstanceRole } } },
      where: { id: user.id },
    });
  }
  if (email && emailSubject && emailBody) {
    await new MailerService({
      emailList: email,
      subject: emailSubject,
      htmlEmail: emailBody,
    }).sendEmail();
  }
}

@Resolver(() => ChapterUser)
export class ChapterUserResolver {
  @Query(() => ChapterUserWithRelations, { nullable: true })
  async chapterUser(
    @Arg('chapterId', () => Int) chapterId: number,
    @Ctx() ctx: ResolverCtx,
  ): Promise<ChapterUserWithRelations | null> {
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
  @Mutation(() => ChapterUserWithRole)
  async joinChapter(
    @Arg('chapterId', () => Int) chapterId: number,
    @Ctx() ctx: Required<ResolverCtx>,
  ): Promise<ChapterUserWithRole> {
    try {
      return await prisma.chapter_users.create({
        data: {
          user: { connect: { id: ctx.user.id } },
          chapter: { connect: { id: chapterId } },
          chapter_role: { connect: { name: 'member' } },
          subscribed: ctx.user.auto_subscribe,
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
    await removeUserFromEventsInChapter({ userId: ctx.user.id, chapterId });

    // Certain chapter roles have associated instance roles with them, so we have to check and update accordingly.
    await updateInstanceRoleForChapterRoleChange({
      changedChapterId: chapterId,
      newChapterRole: ChapterRoles.member,
      user: ctx.user,
    });

    return await prisma.chapter_users.delete({
      where: {
        user_id_chapter_id: {
          chapter_id: chapterId,
          user_id: ctx.user.id,
        },
      },
    });
  }

  @Authorized(Permission.ChapterSubscriptionManage)
  @Mutation(() => ChapterUser)
  async toggleChapterSubscription(
    @Arg('chapterId', () => Int) chapterId: number,
    @Ctx() ctx: Required<ResolverCtx>,
  ): Promise<ChapterUser> {
    const chapterUser = ctx.user.user_chapters.find(
      ({ chapter_id }) => chapter_id === chapterId,
    );

    if (!chapterUser) {
      throw Error(
        'Cannot change subscription for user not beloning to chapter',
      );
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
    });
  }

  @Authorized(Permission.ChapterUserRoleChange)
  @Mutation(() => ChapterUserWithRelations)
  async changeChapterUserRole(
    @Arg('chapterId', () => Int) chapterId: number,
    @Arg('roleName', () => String) newChapterRole: string,
    @Arg('userId', () => Int) userId: number,
  ): Promise<ChapterUserWithRelations> {
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

    const subject = `Your role in chapter has been changed to ${newChapterRole}`;
    const body = `Hi ${chapterUser.user.name}.<br />
    Your role in chapter has been changed to ${newChapterRole}.<br />
    `;

    await updateInstanceRoleForChapterRoleChange({
      changedChapterId: chapterId,
      newChapterRole,
      user: chapterUser.user,
      email: [chapterUser.user.email],
      emailSubject: subject,
      emailBody: body,
    });

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

    const hasPermissionToBanOtherUser = await canBanOther({
      chapterId,
      otherUserId: userId,
      banningUser: ctx.user,
    });
    if (!hasPermissionToBanOtherUser) {
      throw Error('You cannot ban this user');
    }

    await removeUserFromEventsInChapter({ chapterId, userId });

    return await prisma.user_bans.create({
      data: {
        chapter: { connect: { id: chapterId } },
        user: { connect: { id: userId } },
      },
    });
  }

  @Authorized(Permission.ChapterBanUser)
  @Mutation(() => UserBan)
  async unbanUser(
    @Arg('chapterId', () => Int) chapterId: number,
    @Arg('userId', () => Int) userId: number,
    @Ctx() ctx: Required<ResolverCtx>,
  ): Promise<UserBan> {
    const hasPermissionToUnbanOtherUser = await canBanOther({
      chapterId,
      otherUserId: userId,
      banningUser: ctx.user,
    });
    if (!hasPermissionToUnbanOtherUser) {
      throw Error('You cannot unban this user');
    }

    return await prisma.user_bans.delete({
      where: { user_id_chapter_id: { chapter_id: chapterId, user_id: userId } },
    });
  }
}
