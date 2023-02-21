import { Arg, Authorized, Ctx, Int, Mutation, Resolver } from 'type-graphql';

import { sub } from 'date-fns';

import { prisma } from '../../prisma';

import { EventUser } from '../../graphql-types/EventUser';
import { ResolverCtx } from '../../common-types/gql';
import { Permission } from '../../../../common/permissions';

@Resolver()
export class EventUserResolver {
  @Authorized(Permission.EventSubscriptionManage)
  @Mutation(() => EventUser)
  async subscribeToEvent(
    @Arg('eventId', () => Int) eventId: number,
    @Ctx() ctx: Required<ResolverCtx>,
  ): Promise<EventUser> {
    const whereCondition = {
      user_id_event_id: { event_id: eventId, user_id: ctx.user.id },
    };
    // TODO(perf): ctx.user should have this already, so it should be possible
    // to search that rather than doing an additional query.
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
    });
  }

  @Authorized(Permission.EventSubscriptionManage)
  @Mutation(() => EventUser)
  async unsubscribeFromEvent(
    @Arg('eventId', () => Int) eventId: number,
    @Ctx() ctx: Required<ResolverCtx>,
  ): Promise<EventUser> {
    const whereCondition = {
      user_id_event_id: { event_id: eventId, user_id: ctx.user.id },
    };
    // TODO(perf): ctx.user should have this already, so it should be possible
    // to search that rather than doing an additional query.
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
    });
  }
}
