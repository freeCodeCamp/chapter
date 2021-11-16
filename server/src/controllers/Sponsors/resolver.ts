import { Resolver, Query } from 'type-graphql';
import { Sponsor } from '../../models/Sponsor';
import { prisma } from 'src/prisma';
@Resolver()
export class SponsorResolver {
  // TODO: add TypeGraphQL return type
  @Query(() => [Sponsor])
  sponsors(): Promise<Sponsor[]> {
    return prisma.sponsors.findMany();
  }
}
