import { Query, Resolver } from 'type-graphql';

import { prisma } from '../../prisma';

import { ChapterRole } from '../../graphql-types/ChapterRole';

@Resolver()
export class ChapterRoleResolver {
  @Query(() => [ChapterRole])
  async chapterRoles(): Promise<ChapterRole[]> {
    return await prisma.chapter_roles.findMany({
      include: {
        chapter_role_permissions: { include: { chapter_permission: true } },
      },
    });
  }
}
