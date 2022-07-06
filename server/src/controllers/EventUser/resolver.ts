import { Arg, Authorized, Ctx, Int, Mutation, Resolver } from 'type-graphql';

import { sub } from 'date-fns';

import { prisma } from '../../prisma';

import { EventUser } from '../../graphql-types/EventUser';
import { GQLCtx } from '../../common-types/gql';
import { Permission } from '../../../prisma/generator/factories/instanceRoles.factory';

@Resolver()
export class EventUserResolver {
  @Authorized(Permission.EventSubscribe)
  @Mutation(() => EventUser)
  async subscribeToEvent(
    @Arg('eventId', () => Int) eventId: number,
    // chapterId is needed for Authorized to work correctly, even though is not
    // used in the resolver
    @Arg('chapterId', () => Int) _chapterId: number,
    @Ctx() ctx: Required<GQLCtx>,
  ): Promise<EventUser> {
    const whereCondition = {
      user_id_event_id: { event_id: eventId, user_id: ctx.user.id },
    };
    const eventUser = await prisma.event_users.findUniqueOrThrow({
      where: whereCondition,
      include: { event_reminder: true, event: true },
    });

    return await prisma.event_users.update({
      data: {
        subscribed: true,
        event_reminder: {
          connectOrCreate: {
            create: { remind_at: sub(eventUser.event.start_at, { days: 1 }) },
            where: whereCondition,
          },
        },
      },
      where: whereCondition,
      include: {
        event_role: {
          include: {
            event_role_permissions: { include: { event_permission: true } },
          },
        },
        user: true,
        rsvp: true,
      },
    });
  }

  @Authorized(Permission.EventUnsubscribe)
  @Mutation(() => EventUser)
  async unsubscribeFromEvent(
    @Arg('eventId', () => Int) eventId: number,
    // chapterId is needed for Authorized to work correctly, even though is not
    // used in the resolver
    @Arg('chapterId', () => Int) _chapterId: number,
    @Ctx() ctx: Required<GQLCtx>,
  ): Promise<EventUser> {
    const whereCondition = {
      user_id_event_id: { event_id: eventId, user_id: ctx.user.id },
    };
    const eventUser = await prisma.event_users.findUniqueOrThrow({
      where: whereCondition,
      include: { event_reminder: true, event: true },
    });

    return await prisma.event_users.update({
      data: {
        subscribed: false,
        ...(eventUser.event_reminder && { event_reminder: { delete: true } }),
      },
      where: whereCondition,
      include: {
        event_role: {
          include: {
            event_role_permissions: { include: { event_permission: true } },
          },
        },
        user: true,
        rsvp: true,
      },
    });
  }
}
