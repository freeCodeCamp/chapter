import { Arg, Ctx, Int, Mutation, Resolver } from 'type-graphql';

import { GQLCtx } from '../../common-types/gql';
import { prisma } from '../../prisma';

@Resolver()
export class UserChapterRoleResolver {
  @Mutation(() => Boolean)
  async initUserInterestForChapter(
    @Arg('event_id', () => Int) event_id: number,
    @Ctx() ctx: GQLCtx,
  ): Promise<boolean> {
    if (!ctx.user) {
      throw Error('User must be logged in to update role ');
    }
    const event = await prisma.events.findUnique({
      where: { id: event_id },
      include: { chapter: true },
    });
    if (!event.chapter) {
      throw Error('Cannot find the chapter of the event with id ' + event_id);
    }

    // TODO: can we try to create a member role in one query? Wrap it in a try
    // catch and simply return true if it fails due to unique constraint
    // violation?
    const userChapterRole = await prisma.user_chapter_roles.findFirst({
      where: {
        user_id: ctx.user.id,
        chapter_id: event.chapter.id,
      },
      rejectOnNotFound: false,
    });

    if (!userChapterRole) {
      await prisma.user_chapter_roles.create({
        data: {
          user: { connect: { id: ctx.user.id } },
          chapter: { connect: { id: event.chapter.id } },
          role_name: 'member',
          interested: true,
        },
      });
    }

    return true;
  }
}
