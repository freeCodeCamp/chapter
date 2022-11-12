import { Prisma } from '@prisma/client';
import {
  Arg,
  Authorized,
  Ctx,
  Int,
  Mutation,
  Resolver,
  Query,
} from 'type-graphql';
import { Permission } from '../../../../common/permissions';
import { ResolverCtx } from '../../common-types/gql';

import { Venue } from '../../graphql-types';
import { prisma } from '../../prisma';
import {
  adminedFromChapterUsersWhere,
  isAdminingAll,
} from '../../util/dashboards';
import { VenueInputs } from './inputs';

const venueIncludes = {
  chapter: {
    include: {
      events: true,
    },
  },
};

@Resolver()
export class VenueResolver {
  @Query(() => [Venue])
  venues(): Promise<Venue[]> {
    return prisma.venues.findMany({
      include: venueIncludes,
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

  @Query(() => [Venue])
  async dashboardVenues(@Ctx() ctx: Required<ResolverCtx>): Promise<Venue[]> {
    return await prisma.venues.findMany({
      include: venueIncludes,
      orderBy: { name: 'asc' },
      ...(!isAdminingAll(ctx.user) && {
        where: { chapter: adminedFromChapterUsersWhere(ctx.user.id) },
      }),
    });
  }

  @Authorized(Permission.VenueEdit)
  @Query(() => Venue, { nullable: true })
  venue(@Arg('venueId', () => Int) id: number): Promise<Venue | null> {
    return prisma.venues.findUnique({
      where: { id },
      include: venueIncludes,
    });
  }

  @Authorized(Permission.VenueCreate)
  @Mutation(() => Venue)
  async createVenue(
    @Arg('chapterId', () => Int) chapter_id: number,
    @Arg('data') data: VenueInputs,
  ): Promise<Venue> {
    const venueData: Prisma.venuesCreateInput = {
      ...data,
      chapter: { connect: { id: chapter_id } },
    };
    return prisma.venues.create({
      data: venueData,
      include: venueIncludes,
    });
  }

  @Authorized(Permission.VenueEdit)
  @Mutation(() => Venue)
  updateVenue(
    @Arg('venueId', () => Int) id: number,
    @Arg('chapterId', () => Int) _onlyUsedForAuth: number,
    @Arg('data') data: VenueInputs,
  ): Promise<Venue | null> {
    const venueData: Prisma.venuesUpdateInput = data;
    return prisma.venues.update({
      where: { id },
      data: venueData,
    });
  }

  @Authorized(Permission.VenueDelete)
  @Mutation(() => Venue)
  async deleteVenue(
    @Arg('venueId', () => Int) id: number,
    @Arg('chapterId', () => Int) _onlyUsedForAuth: number,
  ): Promise<{ id: number }> {
    // TODO: handle deletion of non-existent venue
    return await prisma.venues.delete({
      where: { id },
    });
  }
}
