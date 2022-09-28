import { Prisma } from '@prisma/client';
import { Arg, Authorized, Int, Mutation, Query, Resolver } from 'type-graphql';

import { Permission } from '../../../../common/permissions';
import { Sponsor, SponsorWithEvents } from '../../graphql-types/Sponsor';
import { prisma } from '../../prisma';
import { CreateSponsorInputs, UpdateSponsorInputs } from './inputs';

@Resolver()
export class SponsorResolver {
  @Authorized(Permission.SponsorView)
  @Query(() => [Sponsor])
  sponsors(): Promise<Sponsor[]> {
    return prisma.sponsors.findMany();
  }
  @Query(() => Sponsor, { nullable: true })
  sponsor(@Arg('id', () => Int) id: number): Promise<Sponsor | null> {
    return prisma.sponsors.findUnique({ where: { id } });
  }
  @Query(() => SponsorWithEvents)
  async sponsorWithEvents(
    @Arg('sponsorId', () => Int) id: number,
  ): Promise<SponsorWithEvents> {
    return await prisma.sponsors.findUniqueOrThrow({
      where: { id },
      include: {
        event_sponsors: {
          include: {
            event: { include: { tags: { include: { tag: true } } } },
          },
        },
      },
    });
  }

  @Authorized(Permission.SponsorManage)
  @Mutation(() => Sponsor)
  createSponsor(@Arg('data') data: CreateSponsorInputs): Promise<Sponsor> {
    const sponsorData: Prisma.sponsorsCreateInput = data;
    return prisma.sponsors.create({ data: sponsorData });
  }

  @Authorized(Permission.SponsorManage)
  @Mutation(() => Sponsor)
  updateSponsor(
    @Arg('id', () => Int) id: number,
    @Arg('data') data: UpdateSponsorInputs,
  ): Promise<Sponsor> {
    return prisma.sponsors.update({ where: { id }, data });
  }
}
