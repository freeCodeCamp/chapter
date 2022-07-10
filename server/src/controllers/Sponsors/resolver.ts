import { Prisma } from '@prisma/client';
import { Arg, Authorized, Int, Mutation, Query, Resolver } from 'type-graphql';

import { Permission } from '../../../../common/permissions';
import { Sponsor } from '../../graphql-types/Sponsor';
import { prisma } from '../../prisma';
import { CreateSponsorInputs, UpdateSponsorInputs } from './inputs';

@Resolver()
export class SponsorResolver {
  @Query(() => [Sponsor])
  sponsors(): Promise<Sponsor[]> {
    return prisma.sponsors.findMany();
  }
  @Query(() => Sponsor, { nullable: true })
  sponsor(@Arg('id', () => Int) id: number): Promise<Sponsor | null> {
    return prisma.sponsors.findUnique({ where: { id } });
  }

  @Authorized(Permission.SponsorsManage)
  @Mutation(() => Sponsor)
  createSponsor(@Arg('data') data: CreateSponsorInputs): Promise<Sponsor> {
    const sponsorData: Prisma.sponsorsCreateInput = data;
    return prisma.sponsors.create({ data: sponsorData });
  }

  @Authorized(Permission.SponsorsManage)
  @Mutation(() => Sponsor)
  updateSponsor(
    @Arg('id', () => Int) id: number,
    @Arg('data') data: UpdateSponsorInputs,
  ): Promise<Sponsor> {
    return prisma.sponsors.update({ where: { id }, data });
  }
}
