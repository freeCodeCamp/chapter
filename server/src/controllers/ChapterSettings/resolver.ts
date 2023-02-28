import { Prisma } from '@prisma/client';
import { Arg, Mutation, Resolver } from 'type-graphql';
import { ChapterSettings } from '../../graphql-types/ChapterSettings';
import { prisma } from '../../prisma';
import { UpdateChapterSettingsInputs } from './input';

@Resolver()
export class ChapterSettingsResolver {
  @Mutation(() => ChapterSettings)
  async updateChapterSettings(
    @Arg('data') data: UpdateChapterSettingsInputs,
  ): Promise<ChapterSettings> {
    const chapterSettingData: Prisma.chapter_settingsUpdateInput = data;

    return await prisma.chapter_settings.update({
      where: { id: 1 },
      data: chapterSettingData,
    });
  }
}
