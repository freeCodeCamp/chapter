import { Query, Resolver } from 'type-graphql';

import { prisma } from '../../prisma';

import { MyEventSubscription } from '../../graphql-types/MyEventSubscription';

@Resolver()
export class MyEventSubscriptionResolver {
  @Query(() => [MyEventSubscription])
  async myEventSubscription(): Promise<MyEventSubscription[]> {
    return await prisma.instance_roles.findMany({
      include: {
        users: { include: { user_events: true } },
      },
    });
  }
}
