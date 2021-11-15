import { Resolver, Query } from 'type-graphql';
import { Sponsor } from '../../models/Sponsor';
import { prisma } from 'src/prisma';
@Resolver()
export class SponsorResolver {
  // TODO: add TypeGraphQL return type
  @Query(() => [Sponsor])
  sponsors() {
    return prisma.sponsors.findMany();
  }
}
