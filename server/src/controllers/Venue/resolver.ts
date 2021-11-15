import { Prisma } from '@prisma/client';
import { Resolver, Query, Arg, Int, Mutation } from 'type-graphql';
import { CreateVenueInputs, UpdateVenueInputs } from './inputs';
import { Venue } from 'src/models';
import { prisma } from 'src/prisma';

@Resolver()
export class VenueResolver {
  // TODO: add TypeGraphQL return type
  @Query(() => [Venue])
  venues() {
    return prisma.venues.findMany();
  }

  // TODO: add TypeGraphQL return type
  @Query(() => Venue, { nullable: true })
  venue(@Arg('id', () => Int) id: number) {
    return prisma.venues.findUnique({ where: { id } });
  }

  // TODO: add TypeGraphQL return type
  @Mutation(() => Venue)
  async createVenue(@Arg('data') data: CreateVenueInputs) {
    const venueData: Prisma.venuesCreateInput = data;
    return prisma.venues.create({ data: venueData });
  }

  // TODO: add TypeGraphQL return type
  @Mutation(() => Venue)
  updateVenue(
    @Arg('id', () => Int) id: number,
    @Arg('data') data: UpdateVenueInputs,
  ) {
    const venueData: Prisma.venuesUpdateInput = data;
    return prisma.venues.update({ where: { id }, data: venueData });
  }

  @Mutation(() => Boolean)
  async deleteVenue(@Arg('id', () => Int) id: number): Promise<boolean> {
    // TODO: handle deletion of non-existent venue
    await prisma.venues.delete({ where: { id } });
    return true;
  }
}
