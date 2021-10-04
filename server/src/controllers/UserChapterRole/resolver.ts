import { Arg, Ctx, Int, Mutation, Resolver } from 'type-graphql';
import { GQLCtx } from 'src/common-types/gql';
import { Event, UserChapterRole } from 'src/models';

@Resolver()
export class UserChapterRoleResolver {
  @Mutation(() => UserChapterRole)
  async initUserInterestForChapter(
    @Arg('event_id', () => Int) event_id: number,
    @Ctx() ctx: GQLCtx,
  ) {
    if (!ctx.user) {
      throw Error('User must be logged in to update role ');
    }
    const event = await Event.findOne(event_id, { relations: ['chapter'] });
    if (!event) {
      throw Error('Cannot find the event with id ' + event_id);
    }
    if (!event.chapter) {
      throw Error('Cannot find the chapter of the event with id ' + event_id);
    }

    const userChapterRole = await UserChapterRole.findOne({
      where: { user_id: ctx.user.id, chapter_id: event.chapter.id },
    });

    if (!userChapterRole) {
      return new UserChapterRole({
        userId: ctx.user.id,
        chapterId: event.chapter.id,
        roleName: 'member',
        interested: true,
      }).save();
    }
    return userChapterRole;
  }
}
