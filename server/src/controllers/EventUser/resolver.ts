import { Arg, Ctx, Int, Mutation, Resolver } from 'type-graphql';

import { sub } from 'date-fns';

import { prisma } from '../../prisma';

import { EventUser } from '../../graphql-types/EventUser';
import { GQLCtx } from '../../common-types/gql';

@Resolver()
export class EventUserResolver {
  @Mutation(() => EventUser)
  async subscribeToEvent(
    @Arg('eventId', () => Int) eventId: number,
    @Ctx() ctx: GQLCtx,
  ): Promise<EventUser> {
    if (!ctx.user) {
      throw new Error('User must be logged to subscribe to event');
    }

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

  @Mutation(() => EventUser)
  async unsubscribeFromEvent(
    @Arg('eventId', () => Int) eventId: number,
    @Ctx() ctx: GQLCtx,
  ): Promise<EventUser> {
    if (!ctx.user) {
      throw new Error('User must be logged to unsubscribe from event');
    }

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
