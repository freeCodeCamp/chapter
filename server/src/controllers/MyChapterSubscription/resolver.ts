import { Query, Resolver } from 'type-graphql';

import { prisma } from '../../prisma';

import { MyChapterSubscription } from '../../graphql-types/MyChapterSubscription';

@Resolver()
export class MyChapterSubscriptionResolver {
  @Query(() => [MyChapterSubscription])
  async myChapterSubscription(): Promise<MyChapterSubscription[]> {
    return await prisma.instance_roles.findMany({
      include: {
        users: { include: { user_chapters: true } },
      },
    });
  }
}
