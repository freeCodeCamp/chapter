import { Mutation, Resolver } from 'type-graphql';
import { ChapterSettings } from '../../graphql-types/ChapterSettings';
import { prisma } from '../../prisma';

@Resolver()
export class ChapterSettingsResolver {
  @Mutation(() => ChapterSettings)
  async chapterSettings(): Promise<ChapterSettings> {
    return await prisma.chapter_settings.findUniqueOrThrow({
      where: { id: 1 },
    });
  }
}
