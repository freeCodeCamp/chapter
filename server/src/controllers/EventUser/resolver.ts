import { Resolver, Arg, Int, Mutation, Ctx } from 'type-graphql';

import { sub } from 'date-fns';

import { prisma } from '../../prisma';

import { GQLCtx } from '../../common-types/gql';
import { EventUser } from '../../graphql-types';

@Resolver()
export class EventUserResolver {
  @Mutation(() => EventUser)
  async eventSubscribe(
    @Arg('eventId', () => Int) eventId: number,
    @Ctx() ctx: GQLCtx,
  ): Promise<EventUser> {
    if (!ctx.user) {
      throw new Error('User must be logged to change event subscription');
    }

    const whereCondition = {
      user_id_event_id: { event_id: eventId, user_id: ctx.user.id },
    };
    const eventUser = await prisma.event_users.findUnique({
      where: whereCondition,
      include: { event_reminder: true, event: true },
    });

    if (!eventUser.subscribed) {
      await prisma.event_reminders.create({
        data: {
          event_user: { connect: whereCondition },
          remind_at: sub(eventUser.event.start_at, { days: 1 }),
        },
      });
    }

    return await prisma.event_users.update({
      data: {
        subscribed: !eventUser.subscribed,
        ...(eventUser.subscribed &&
          eventUser.event_reminder && { event_reminder: { delete: true } }),
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
