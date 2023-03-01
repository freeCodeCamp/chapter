import { Prisma } from '@prisma/client';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { InstanceSettings } from '../../graphql-types/InstanceSettings';
import { prisma } from '../../prisma';
import { InstanceSettingsInputs } from './input';

@Resolver()
export class InctanceSettingsResolver {
  @Query(() => InstanceSettings)
  async instanceSettings(): Promise<InstanceSettings> {
    return await prisma.instance_settings.findUniqueOrThrow({
      where: { id: 1 },
    });
  }

  @Mutation(() => InstanceSettings)
  async updateInstanceSettings(
    @Arg('data') data: InstanceSettingsInputs,
  ): Promise<InstanceSettings> {
    const instanceSettingData: Prisma.instance_settingsUpdateInput = data;

    return await prisma.instance_settings.update({
      where: { id: 1 },
      data: instanceSettingData,
    });
  }
}
