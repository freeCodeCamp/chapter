import { Prisma } from '@prisma/client';
import { Arg, Ctx, Int, Mutation, Resolver } from 'type-graphql';

import { GQLCtx } from '../../common-types/gql';
import { prisma } from '../../prisma';

const UNIQUE_CONSTRAINT_FAILED_CODE = 'P2002';

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

    try {
      await prisma.user_chapter_roles.create({
        data: {
          user: { connect: { id: ctx.user.id } },
          chapter: { connect: { id: event.chapter.id } },
          role_name: 'member',
          interested: true,
        },
      });
    } catch (e) {
      if (
        !(e instanceof Prisma.PrismaClientKnownRequestError) ||
        e.code !== UNIQUE_CONSTRAINT_FAILED_CODE
      ) {
        throw e;
      }
    }

    return true;
  }
}
