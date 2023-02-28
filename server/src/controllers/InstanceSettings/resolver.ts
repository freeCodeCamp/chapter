import { Prisma } from '@prisma/client';
import { Arg, Mutation, Resolver } from 'type-graphql';
import { InstanceSettings } from '../../graphql-types/InstanceSettings';
import { prisma } from '../../prisma';
import { UpdateInstanceSettingsInputs } from './input';

@Resolver()
export class InctanceSettingsResolver {
  @Mutation(() => InstanceSettings)
  async updateInstanceSettings(
    @Arg('data') data: UpdateInstanceSettingsInputs,
  ): Promise<InstanceSettings> {
    const instanceSettingData: Prisma.instance_settingsUpdateInput = data;

    return await prisma.instance_settings.update({
      where: { id: 1 },
      data: instanceSettingData,
    });
  }
}
