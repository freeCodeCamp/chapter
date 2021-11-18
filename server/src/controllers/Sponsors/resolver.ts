import { Prisma } from '@prisma/client';
import { Resolver, Query, Arg, Int, Mutation } from 'type-graphql';

import { CreateSponsorInputs, UpdateSponsorInputs } from './input';
import { Sponsor } from 'src/graphql-types/Sponsor';
import { prisma } from 'src/prisma';

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

  @Mutation(() => Sponsor)
  createSponsor(@Arg('data') data: CreateSponsorInputs): Promise<Sponsor> {
    const sponsorData: Prisma.sponsorsCreateInput = data;
    return prisma.sponsors.create({ data: sponsorData });
  }

  @Mutation(() => Sponsor)
  updateSponsor(
    @Arg('id', () => Int) id: number,
    @Arg('data') data: UpdateSponsorInputs,
  ): Promise<Sponsor> {
    return prisma.sponsors.update({ where: { id }, data });
  }
}
