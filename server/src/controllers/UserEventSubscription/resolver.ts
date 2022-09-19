import { Query, Resolver } from 'type-graphql';

import { prisma } from '../../prisma';

import { UserEventSubscription } from '../../graphql-types/UserEventSubscription';

@Resolver()
export class UserEventSubscriptionResolver {
  @Query(() => [UserEventSubscription])
  async userEventSubscription(): Promise<UserEventSubscription[]> {
    return await prisma.instance_roles.findMany({
      include: {
        users: { include: { user_events: true } },
      },
    });
  }
}
