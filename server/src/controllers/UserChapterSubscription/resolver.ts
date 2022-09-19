import { Query, Resolver } from 'type-graphql';

import { prisma } from '../../prisma';

import { UserChapterSubscription } from '../../graphql-types/UserChapterSubscription';

@Resolver()
export class UserChapterSubscriptionResolver {
  @Query(() => [UserChapterSubscription])
  async userChapterSubscription(): Promise<UserChapterSubscription[]> {
    return await prisma.instance_roles.findMany({
      include: {
        users: { include: { user_chapters: true } },
      },
    });
  }
}
