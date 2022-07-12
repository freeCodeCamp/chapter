import { Prisma } from '@prisma/client';
import { Resolver, Query, Arg, Int, Mutation, Authorized } from 'type-graphql';
import { Permission } from '../../../../common/permissions';

import { Venue } from '../../graphql-types';
import { prisma } from '../../prisma';
import { CreateVenueInputs, UpdateVenueInputs } from './inputs';

@Resolver()
export class VenueResolver {
  @Query(() => [Venue])
  venues(): Promise<Venue[]> {
    return prisma.venues.findMany();
  }

  @Query(() => Venue, { nullable: true })
  venue(@Arg('id', () => Int) id: number): Promise<Venue | null> {
    return prisma.venues.findUnique({ where: { id } });
  }

  @Authorized(Permission.VenueCreate)
  @Mutation(() => Venue)
  async createVenue(
    @Arg('chapterId', () => Int) chapter_id: number,
    @Arg('data') data: CreateVenueInputs,
  ): Promise<Venue> {
    const venueData: Prisma.venuesCreateInput = {
      ...data,
      chapter: { connect: { id: chapter_id } },
    };
    return prisma.venues.create({
      data: venueData,
    });
  }

  @Mutation(() => Venue)
  @Authorized(Permission.VenueEdit)
  updateVenue(
    @Arg('venueId', () => Int) id: number,
    @Arg('chapterId', () => Int) chapter_id: number,
    @Arg('data') data: UpdateVenueInputs,
  ): Promise<Venue | null> {
    const venueData: Prisma.venuesUpdateInput = data;
    return prisma.venues.update({
      where: { id_chapter_id: { id, chapter_id } },
      data: venueData,
    });
  }

  @Mutation(() => Boolean)
  async deleteVenue(@Arg('id', () => Int) id: number): Promise<boolean> {
    // TODO: handle deletion of non-existent venue
    await prisma.venues.delete({ where: { id } });
    return true;
  }
}
