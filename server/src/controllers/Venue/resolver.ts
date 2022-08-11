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
    return prisma.venues.findMany({
      include: {
        chapter: {
          include: {
            tags: {
              include: { tag: true },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  @Query(() => [Venue])
  chapterVenues(
    @Arg('chapterId', () => Int) chapterId: number,
  ): Promise<Venue[]> {
    return prisma.venues.findMany({
      where: { chapter_id: chapterId },
      orderBy: { name: 'asc' },
    });
  }

  @Query(() => Venue, { nullable: true })
  venue(@Arg('id', () => Int) id: number): Promise<Venue | null> {
    return prisma.venues.findUnique({
      where: { id },
      include: { chapter: true },
    });
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
      include: { chapter: true },
    });
  }

  @Authorized(Permission.VenueEdit)
  @Mutation(() => Venue)
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

  @Authorized(Permission.VenueDelete)
  @Mutation(() => Venue)
  async deleteVenue(
    @Arg('venueId', () => Int) id: number,
    @Arg('chapterId', () => Int) chapter_id: number,
  ): Promise<{ id: number }> {
    // TODO: handle deletion of non-existent venue
    return await prisma.venues.delete({
      where: { id_chapter_id: { id, chapter_id } },
    });
  }
}
