import { Arg, Ctx, Int, Mutation, Resolver } from 'type-graphql';

import { prisma } from '../../prisma';

import { EventUser } from '../../graphql-types/EventUser';
import { GQLCtx } from '../../common-types/gql';

@Resolver()
export class EventUserResolver {
  @Mutation(() => EventUser)
  async changeEventUserRole(
    @Arg('eventId', () => Int) eventId: number,
    @Arg('roleId', () => Int) roleId: number,
    @Arg('userId', () => Int) userId: number,
    @Ctx() ctx: GQLCtx,
  ): Promise<EventUser> {
    if (!ctx.user) {
      throw Error('User must be logged in to change event role');
    }
    return await prisma.event_users.update({
      data: { event_role: { connect: { id: roleId } } },
      where: {
        user_id_event_id: { event_id: eventId, user_id: userId },
      },
      include: {
        event_role: {
          include: {
            event_role_permissions: { include: { event_permission: true } },
          },
        },
        rsvp: true,
        user: true,
      },
    });
  }
}
