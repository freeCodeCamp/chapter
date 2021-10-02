import { GQLCtx } from 'src/common-types/gql';
import { Event, UserChapterRole } from 'src/models';
import { Arg, Ctx, Int, Mutation, Resolver } from 'type-graphql';

@Resolver()
export class UserChapterRoleResolver {
  @Mutation(() => UserChapterRole)
  async setUserInterestForChapter(
    @Arg('event_id', () => Int) event_id: number,
    @Ctx() ctx: GQLCtx,
  ) {
    console.log('Inside the resolver');

    if (!ctx.user) {
      throw Error('User must be logged in to update role ');
    }
    const event = await Event.findOne(event_id, { relations: ['chapter'] });
    console.log(event);
    if (!event) {
      throw Error('Cannot find the event with id ' + event_id);
    }
    if (!event.chapter) {
      throw Error('Cannot find the chapter of the event with id ' + event_id);
    }

    const userChapterRole = await UserChapterRole.findOne({
      where: { user_id: ctx.user.id, chapter_id: event.chapter.id },
    });

    console.log(userChapterRole);

    if (!userChapterRole) {
      console.log('Role Not present so creating it');

      return await new UserChapterRole({
        userId: ctx.user.id,
        chapterId: event.chapter.id,
        roleName: 'member',
        interested: true,
      }).save();
    }
    return userChapterRole;
  }
}
